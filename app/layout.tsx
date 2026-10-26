import type { Metadata, Viewport } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { QueryClientProvider } from "@/components/providers/query-client-provider";
import { AuthProvider } from "@/components/providers/auth-provider";
import { MainNavigation } from "@/components/navigation/main-navigation";
import { BreadcrumbNavigation } from "@/components/navigation/breadcrumb-navigation";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
// Montserrat stands in for Gotham, the licensed WebtrixPro header face.
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "QA Plan | WebtrixPro",
  description:
    "WebtrixPro QA Plan — track test cases, tester progress, and issues. Smart Software. AI-Powered.",
  generator: "v0.dev",
};

export const viewport: Viewport = {
  themeColor: "#000000",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${montserrat.variable} bg-background`}
    >
      <body className="min-h-screen bg-background font-sans antialiased">
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
