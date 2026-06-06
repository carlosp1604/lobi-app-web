import { Outfit } from 'next/font/google'
import { Toaster } from '~/components/ui/sonner'
import { AppFooter } from '~/components/Footer/AppFooter'
import { AppNavbar } from '~/components/Navbar/AppNavbar'
import { ReactNode } from 'react'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
})

interface AppLayoutProps {
  children: ReactNode
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className={ `${outfit.variable} flex min-h-screen flex-col bg-background text-foreground antialiased` }>
      <style jsx global>{ `
        :root {
          --font-outfit: ${outfit.style.fontFamily};
        }
      ` }</style>
      <AppNavbar/>
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={ 10000 }
        visibleToasts={ 10 }
        theme="light"
        expand={ true }
        className="pointer-events-auto"
        toastOptions={ {
          classNames: {
            // Workaround taken from: https://github.com/shadcn-ui/ui/issues/2401#issuecomment-1891091664
            toast: 'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground ' +
              'group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:pointer-events-auto',
          },
        } }
      />
      <main className="grow pb-16">
        <div className="container pt-8">
          { children }
        </div>
      </main>
      <AppFooter/>
    </div>
  )
}
