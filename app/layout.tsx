import { ClerkProvider, SignInButton, SignOutButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import './globals.css'
import { ThemeProvider } from "@/components/theme-provider"
import { Button } from '@/components/ui/button'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className=''>

        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <div className='px-10 py-2 flex flex-row items-center h-full bg-white'>
              <SignedOut>
                <Button>
                  <SignInButton />
                </Button>
              </SignedOut>
              <SignedIn>
                <div className='flex justify-between flex-row w-full'>
                  <UserButton />
                  <Button>
                    <SignOutButton />
                  </Button>
                </div>
              </SignedIn>
            </div>
            <main className='bg-white '>
              {children}
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}