import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { QueryClientProvider } from "@/components/providers/query-client-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { BreadcrumbNavigation } from "@/components/navigation/breadcrumb-navigation";

export const metadata: Metadata = {
  title: "QA Plan Application",
  description: "MTP Application QA Plan with Database Integration",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body className="min-h-screen bg-background">
        <QueryClientProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <MainNavigation />
              <main className="flex-1">
                <div className="container mx-auto px-4 py-6">
                  <BreadcrumbNavigation />
                  {children}
                </div>
              </main>
            </div>
          </AuthProvider>
        </QueryClientProvider>
      </body>
    </html>
  );
}
