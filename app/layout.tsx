import { ThemeProvider } from "@/components/theme-provider"
import { Button } from '@/components/ui/button'
import { esES } from '@clerk/localizations'
import { ClerkProvider, ClerkLoaded, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider localization={esES}>
      <html lang="es" className=''>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <main className=''>
              <ClerkLoaded>
                {children}
              </ClerkLoaded>
            </main>
            <div className="fixed bottom-0 right-0 text-black bg-white">
              <Toaster />
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider >
  )
}