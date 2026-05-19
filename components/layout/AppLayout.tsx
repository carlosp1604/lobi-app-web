import React from 'react';
import AppNavbar from '~/components/Navbar/AppNavbar';
import AppFooter from "~/components/Footer/AppFooter";

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground antialiased">
      <AppNavbar />
      <main className="grow pb-16">
        <div className="container pt-6">
          {children}
        </div>
      </main>
      <AppFooter />
    </div>
  );
}
