import { HeadContent, Scripts, createRootRoute } from '@tanstack/react-router'
import Footer from '../components/Footer'
import Header from '../components/Header'

import appCss from '../styles.css?url'

const isDev = import.meta.env.DEV

const THEME_INIT_SCRIPT = `(function(){try{var root=document.documentElement;root.classList.remove('dark');root.classList.add('light');root.setAttribute('data-theme','light');root.style.colorScheme='light';localStorage.setItem('theme','light');}catch(e){}})();`

export const Route = createRootRoute({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      {
        title: 'Trade Desky',
      },
      {
        name: 'description',
        content:
          'Turn Discord-style notification alerts into Tradier or Schwab option orders. Desktop capture, AI parsing, paper or live.',
      },
    ],
    links: [
      {
        rel: 'stylesheet',
        href: appCss,
      },
      // Prefer PNG first; cache-bust so browsers drop the old CRA/React favicon.ico
      { rel: 'icon', href: '/favicon-32.png?v=3', type: 'image/png', sizes: '32x32' },
      { rel: 'icon', href: '/favicon-v2.ico?v=3', sizes: 'any' },
      { rel: 'apple-touch-icon', href: '/apple-touch-icon.png?v=3', sizes: '180x180' },
      { rel: 'manifest', href: '/manifest.json' },
    ],
  }),
  shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="light" data-theme="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_INIT_SCRIPT }} />
        <HeadContent />
      </head>
      <body className="font-sans antialiased [overflow-wrap:anywhere] bg-white text-black">
        <Header />
        {children}
        <Footer />
        {isDev && (
          <>
            {/* Devtools loaded only in development */}
          </>
        )}
        <Scripts />
      </body>
    </html>
  )
}
