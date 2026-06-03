import AppFooter from "~/components/Footer/AppFooter";
import AppNavbar from '~/components/Navbar/AppNavbar';
import { Toaster } from "~/components/ui/sonner";
import { ReactNode } from "react";

interface AppLayoutProps {
  children: ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <AppNavbar />
      <Toaster
        position="top-center"
        richColors
        closeButton
        duration={10000}
        visibleToasts={10}
        theme="light"
        expand={true}
      />
      <main className="grow pb-16">
        <div className="container pt-8">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
