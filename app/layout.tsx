import './globals.css'
import { ReactNode } from 'react'
import ScrollProvider from '../components/ScrollProvider'
import { SettingsProvider } from '../components/SettingsContext'

export const metadata = {
  title: 'JARVIS 2.0 — J.A.R.V.I.S. Interface',
}

export default function RootLayout({ children }: { children: ReactNode }){
  return (
    <html lang="en">
      <body>
        <SettingsProvider>
          <ScrollProvider>
            {children}
          </ScrollProvider>
        </SettingsProvider>
      </body>
    </html>
  )
}
