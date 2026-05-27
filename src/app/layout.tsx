import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Sidebar from "@/components/shared/Sidebar";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "SaaS Application",
  description: "Enterprise grade management application",
};

import ClientLayoutWrapper from "@/components/shared/ClientLayoutWrapper";
import { getSession } from "@/services/auth/session";
import { getSubscriptionStatus } from "@/actions/subscription";
import PlanBanner from "@/components/shared/PlanBanner";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getSession();
  let subStatus = null;
  
  if (session) {
    subStatus = await getSubscriptionStatus();
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased h-full`}
    >
      <body className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-slate-50 to-blue-50/50 dark:from-slate-950 dark:to-blue-950/20 text-slate-900 dark:text-slate-50">
        {subStatus && <PlanBanner status={subStatus} />}
        <div className="flex flex-1 overflow-hidden">
          <ClientLayoutWrapper session={session}>
            {children}
          </ClientLayoutWrapper>
        </div>
      </body>
    </html>
  );
}
