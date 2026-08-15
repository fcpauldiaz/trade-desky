import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

import { createClient } from '@libsql/client'
import { afterEach, describe, expect, it } from 'vitest'

import { unifyUserTables } from '#/lib/unify-user-tables'

const dirs: string[] = []

function tempClient() {
  const dir = mkdtempSync(join(tmpdir(), 'unify-users-'))
  dirs.push(dir)
  return createClient({ url: `file:${join(dir, 'trade.db')}` })
}

afterEach(() => {
  while (dirs.length) {
    rmSync(dirs.pop() as string, { recursive: true, force: true })
  }
})

describe('unifyUserTables', () => {
  it('renames Better Auth user to users when users does not exist', async () => {
    const client = tempClient()
    await client.execute(`
      CREATE TABLE "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "email_verified" integer DEFAULT 0 NOT NULL,
        "image" text,
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL
      )
    `)
    await client.execute(
      `INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('auth-1', 'Ada', 'ada@example.com', 1, 1)`,
    )

    await unifyUserTables(client)

    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user','users')",
    )
    expect(tables.rows.map((row) => row.name).sort()).toEqual(['users'])
    const users = await client.execute('SELECT id, email FROM users')
    expect(users.rows).toEqual([{ id: 'auth-1', email: 'ada@example.com' }])
  })

  it('merges into existing users and drops user', async () => {
    const client = tempClient()
    await client.execute(`
      CREATE TABLE "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "name" text,
        "api_key_hash" text,
        "created_at" integer
      )
    `)
    await client.execute(`
      CREATE TABLE "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "email_verified" integer DEFAULT 0 NOT NULL,
        "image" text,
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL
      )
    `)
    await client.execute(`
      CREATE TABLE "session" (
        "id" text PRIMARY KEY NOT NULL,
        "expires_at" integer NOT NULL,
        "token" text NOT NULL,
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL,
        FOREIGN KEY ("user_id") REFERENCES "user"("id")
      )
    `)
    await client.execute(`
      CREATE TABLE "account" (
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
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL,
        FOREIGN KEY ("user_id") REFERENCES "user"("id")
      )
    `)
    await client.execute(
      `INSERT INTO "users" (id, email, name) VALUES ('recv-1', 'ada@example.com', 'Ada')`,
    )
    await client.execute(
      `INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('auth-1', 'Ada', 'ada@example.com', 1, 1)`,
    )
    await client.execute(
      `INSERT INTO "session" (id, expires_at, token, created_at, updated_at, user_id) VALUES ('s1', 9, 'tok', 1, 1, 'auth-1')`,
    )
    await client.execute(
      `INSERT INTO "account" (id, account_id, provider_id, user_id, created_at, updated_at) VALUES ('a1', 'ada@example.com', 'credential', 'auth-1', 1, 1)`,
    )

    await unifyUserTables(client)

    const tables = await client.execute(
      "SELECT name FROM sqlite_master WHERE type='table' AND name IN ('user','users')",
    )
    expect(tables.rows.map((row) => row.name)).toEqual(['users'])
    const session = await client.execute('SELECT user_id FROM session')
    expect(session.rows).toEqual([{ user_id: 'recv-1' }])
    const users = await client.execute('SELECT id, email FROM users')
    expect(users.rows).toEqual([{ id: 'recv-1', email: 'ada@example.com' }])
  })

  it('repairs session/account FKs when user was dropped with foreign keys off', async () => {
    const client = tempClient()
    await client.execute(`
      CREATE TABLE "users" (
        "id" text PRIMARY KEY NOT NULL,
        "email" text NOT NULL UNIQUE,
        "name" text
      )
    `)
    await client.execute(`
      CREATE TABLE "user" (
        "id" text PRIMARY KEY NOT NULL,
        "name" text NOT NULL,
        "email" text NOT NULL,
        "email_verified" integer DEFAULT 0 NOT NULL,
        "image" text,
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL
      )
    `)
    await client.execute(`
      CREATE TABLE "session" (
        "id" text PRIMARY KEY NOT NULL,
        "expires_at" integer NOT NULL,
        "token" text NOT NULL,
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL,
        "ip_address" text,
        "user_agent" text,
        "user_id" text NOT NULL,
        FOREIGN KEY ("user_id") REFERENCES "user"("id")
      )
    `)
    await client.execute(`
      CREATE TABLE "account" (
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
        "created_at" integer NOT NULL,
        "updated_at" integer NOT NULL,
        FOREIGN KEY ("user_id") REFERENCES "user"("id")
      )
    `)
    await client.execute(
      `INSERT INTO "users" (id, email, name) VALUES ('recv-1', 'ada@example.com', 'Ada')`,
    )
    await client.execute(
      `INSERT INTO "user" (id, name, email, created_at, updated_at) VALUES ('auth-1', 'Ada', 'ada@example.com', 1, 1)`,
    )
    await client.execute(
      `INSERT INTO "session" (id, expires_at, token, created_at, updated_at, user_id) VALUES ('s1', 9, 'tok', 1, 1, 'auth-1')`,
    )
    await client.execute(
      `INSERT INTO "account" (id, account_id, provider_id, user_id, created_at, updated_at) VALUES ('a1', 'ada@example.com', 'credential', 'auth-1', 1, 1)`,
    )
    await client.execute('PRAGMA foreign_keys=OFF')
    await client.execute('DROP TABLE "user"')
    await client.execute('PRAGMA foreign_keys=ON')

    await unifyUserTables(client)

    const fk = await client.execute('PRAGMA foreign_key_list(session)')
    expect(fk.rows.map((row) => row.table)).toEqual(['users'])
    await client.execute(
      `INSERT INTO "session" (id, expires_at, token, created_at, updated_at, user_id) VALUES ('s2', 9, 'tok2', 1, 1, 'recv-1')`,
    )
    const sessions = await client.execute('SELECT id, user_id FROM session ORDER BY id')
    expect(sessions.rows).toEqual([
      { id: 's1', user_id: 'auth-1' },
      { id: 's2', user_id: 'recv-1' },
    ])
  })
})
