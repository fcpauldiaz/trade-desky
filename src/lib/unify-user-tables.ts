import type { Client } from '@libsql/client'

type TableInfo = {
  name: string
}

async function tableNames(client: Client): Promise<Set<string>> {
  const result = await client.execute(
    "SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'",
  )
  return new Set(result.rows.map((row) => String((row as TableInfo).name)))
}

async function columnNames(client: Client, table: string): Promise<Set<string>> {
  const result = await client.execute(`PRAGMA table_info("${table}")`)
  return new Set(result.rows.map((row) => String(row.name)))
}

async function addColumnIfMissing(
  client: Client,
  table: string,
  column: string,
  ddl: string,
): Promise<void> {
  const columns = await columnNames(client, table)
  if (columns.has(column)) {
    return
  }
  await client.execute(`ALTER TABLE "${table}" ADD COLUMN ${ddl}`)
}

async function recreateAuthForeignKeys(client: Client): Promise<void> {
  await client.execute('PRAGMA foreign_keys=OFF')
  await client.execute(`
    CREATE TABLE "session_new" (
      "id" text PRIMARY KEY NOT NULL,
      "expires_at" integer NOT NULL,
      "token" text NOT NULL,
      "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "updated_at" integer NOT NULL,
      "ip_address" text,
      "user_agent" text,
      "user_id" text NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
    )
  `)
  await client.execute(`
    INSERT INTO "session_new" ("id","expires_at","token","created_at","updated_at","ip_address","user_agent","user_id")
    SELECT "session"."id", "session"."expires_at", "session"."token", "session"."created_at", "session"."updated_at",
           "session"."ip_address", "session"."user_agent",
           COALESCE(
             (SELECT "users"."id" FROM "users"
              JOIN "user" ON "user"."email" = "users"."email"
              WHERE "user"."id" = "session"."user_id"),
             "session"."user_id"
           )
    FROM "session"
  `)
  await client.execute('DROP TABLE "session"')
  await client.execute('ALTER TABLE "session_new" RENAME TO "session"')
  await client.execute('CREATE UNIQUE INDEX IF NOT EXISTS "session_token_unique" ON "session" ("token")')
  await client.execute('CREATE INDEX IF NOT EXISTS "session_userId_idx" ON "session" ("user_id")')

  await client.execute(`
    CREATE TABLE "account_new" (
      "id" text PRIMARY KEY NOT NULL,
      "account_id" text NOT NULL,
      "provider_id" text NOT NULL,
      "user_id" text NOT NULL,
      "access_token" text,
      "refresh_token" text,
      "id_token" text,
      "access_token_expires_at" integer,
      "refresh_token_expires_at" integer,
      "scope" text,
      "password" text,
      "created_at" integer DEFAULT (cast(unixepoch('subsecond') * 1000 as integer)) NOT NULL,
      "updated_at" integer NOT NULL,
      FOREIGN KEY ("user_id") REFERENCES "users"("id") ON UPDATE no action ON DELETE cascade
    )
  `)
  await client.execute(`
    INSERT INTO "account_new" ("id","account_id","provider_id","user_id","access_token","refresh_token","id_token","access_token_expires_at","refresh_token_expires_at","scope","password","created_at","updated_at")
    SELECT "account"."id", "account"."account_id", "account"."provider_id",
           COALESCE(
             (SELECT "users"."id" FROM "users"
              JOIN "user" ON "user"."email" = "users"."email"
              WHERE "user"."id" = "account"."user_id"),
             "account"."user_id"
           ),
           "account"."access_token", "account"."refresh_token", "account"."id_token",
           "account"."access_token_expires_at", "account"."refresh_token_expires_at",
           "account"."scope", "account"."password", "account"."created_at", "account"."updated_at"
    FROM "account"
  `)
  await client.execute('DROP TABLE "account"')
  await client.execute('ALTER TABLE "account_new" RENAME TO "account"')
  await client.execute('CREATE INDEX IF NOT EXISTS "account_userId_idx" ON "account" ("user_id")')
  await client.execute('PRAGMA foreign_keys=ON')
}

async function mergeAuthUserIntoUsers(client: Client): Promise<void> {
  await addColumnIfMissing(client, 'users', 'email_verified', '"email_verified" integer DEFAULT 0 NOT NULL')
  await addColumnIfMissing(client, 'users', 'image', '"image" text')
  await addColumnIfMissing(client, 'users', 'updated_at', '"updated_at" integer DEFAULT 0 NOT NULL')

  await client.execute(`
    INSERT INTO "users" ("id", "name", "email", "email_verified", "image", "created_at", "updated_at")
    SELECT "id", "name", "email", "email_verified", "image", "created_at", "updated_at"
    FROM "user"
    WHERE "id" NOT IN (SELECT "id" FROM "users")
      AND "email" NOT IN (SELECT "email" FROM "users")
  `)
}

export async function unifyUserTables(client: Client): Promise<void> {
  const tables = await tableNames(client)
  if (!tables.has('user')) {
    return
  }

  if (!tables.has('users')) {
    await client.execute('ALTER TABLE "user" RENAME TO "users"')
    return
  }

  await mergeAuthUserIntoUsers(client)
  await recreateAuthForeignKeys(client)
  await client.execute('DROP TABLE "user"')
}
