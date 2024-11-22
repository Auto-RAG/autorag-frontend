// app/layout.tsx
import "@/styles/globals.css";
import { Metadata, Viewport } from "next";
import clsx from "clsx";

import { Providers } from "./providers";

import { siteConfig } from "@/config/site";
// import { fontSans } from "@/config/fonts";
import { CustomNavigation } from "@/components/custom-navigation";

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s - ${siteConfig.name}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "white" },
    { media: "(prefers-color-scheme: dark)", color: "black" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body 
        className={clsx(
          "min-h-screen bg-background font-sans antialiased"
        )}
        suppressHydrationWarning
      >
        <Providers themeProps={{ attribute: "class", defaultTheme: "light", enableSystem: false }}>
          <div className="relative flex flex-col h-screen font-ibm-bold">
            {/* <Navbar /> */}
            <div className="min-h-screen bg-gray-50">
              <CustomNavigation />
              {/* Main Content */}
              <main className="w-full mx-auto py-4 px-4 sm:px-6 lg:px-8">
                {children}
              </main>
            </div>

            <footer className="fixed bottom-0 w-full flex items-center justify-center py-3 bg-background border-t">
              <small><b>Powered by AutoRAG</b></small>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
