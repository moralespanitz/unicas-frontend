import { ThemeProvider } from "@/components/theme-provider"
import { Button } from '@/components/ui/button'
import { esES } from '@clerk/localizations'
import { ClerkProvider, ClerkLoaded, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" className=''>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <main className=''>
              <ClerkLoaded>
                {children}
              </ClerkLoaded>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}