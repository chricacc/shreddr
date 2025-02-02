import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/ThemeProvider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { cookies } from "next/headers";
import { Toaster } from "@/components/ui/sonner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Shreddr - Unleash your inner Guitar Hero",
  description: "Shreddr - Unleash your inner Guitar Hero",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar:state")?.value === 'true';

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex min-h-screen flex-col`}>
        <Providers>
          <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="w-full">
              <div className="flex p-4 md:p-2 items-center gap-4 md:gap-8">
                <SidebarTrigger className="w-9 h-9 border" />
                <h1 className="text-3xl">Shreddr</h1>
              </div>
              <div className="md:mx-20 mx-4 mt-4">
                {children}
              </div>
              <Toaster />
            </main>
          </SidebarProvider>
        </Providers>
      </body>
    </html >
  );
}
