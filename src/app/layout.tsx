"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shadcn-ui/theme";
import { SectionProps, Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardIcon } from "@radix-ui/react-icons";
import { icons } from "@/lib/icons";
import { Dev } from "@/dev-data/constants";
import "./globals.css";

import { ReadonlyURLSearchParams, useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

import ReloadSelect from "@/components/dashboard/AutoRefreshSelect";
import { IS_DEV, IS_MODE_MULTI, IS_MODE_SAAS, IS_MODE_SINGLE } from "@/lib/env";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

interface ReloadIntervalContextProps {
  reloadInterval: number;
}

const ReloadIntervalContext = createContext<
  ReloadIntervalContextProps | undefined
>(undefined);

export const useReloadInterval = () => {
  const context = useContext(ReloadIntervalContext);
  if (!context) {
    throw new Error(
      "useReloadInterval must be used within a ReloadIntervalProvider"
    );
  }
  return context.reloadInterval;
};

const reloadIntervalDefault = IS_DEV ? 0 : 5;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const searchParams = useSearchParams();
  const [reloadInterval, setReloadInterval] = useState<number>(
    reloadIntervalDefault
  );

  const deploymentId = searchParams.get("did");

  const sidebar: SectionProps = { title: "", entries: [], global: [] };

  if (!IS_MODE_SINGLE) {
    sidebar.global.push({
      title: "Home",
      icon: icons.Home,
      route: "/home",
      ignore: IS_MODE_SINGLE,
    });
  }
  if (IS_MODE_SAAS) {
    sidebar.entries.push({
      title: "Configurations",
      icon: icons.Reader,
      route: deploymentId
        ? `/configurations?did=${deploymentId}`
        : "/configurations",
    });
  }
  if (deploymentId || IS_MODE_SINGLE) {
    sidebar.entries.push(
      {
        title: "Deployment",
        icon: icons.Play,
        route: `/deployment?did=${deploymentId}`,
      },
      {
        title: "Entities",
        icon: icons.Id,
        route: `/entities?did=${deploymentId}`,
      },
      {
        title: "Values",
        icon: icons.Code,
        route: `/values?did=${deploymentId}`,
      }
    );
  }

  return (
    <ReloadIntervalContext.Provider value={{ reloadInterval }}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={cn(
            "min-h-screen bg-background font-sans antialiased",
            inter.variable
          )}
        >
          <ThemeProvider
            attribute="class"
            storageKey="ldproxy-portal"
            enableSystem
            disableTransitionOnChange
          >
            <div className="hidden h-full flex-col md:flex">
              <div className="flex flex-col items-start justify-between space-y-2 py-4 px-4 lg:px-8 sm:flex-row sm:items-center sm:space-y-0 md:h-16">
                <h2 className="text-lg font-semibold whitespace-nowrap">
                  <Link href="/">
                    <DashboardIcon className="mr-2 h-4 w-4 inline" />
                    <span>dashboard</span>
                  </Link>
                </h2>
                <div className="ml-auto flex w-full space-x-2 sm:justify-end">
                  {/*TODO: blur, show selected, manual refresh */}
                  <ReloadSelect
                    reloadInterval={reloadInterval}
                    setReloadInterval={setReloadInterval}
                  />
                  <a
                    href="/api"
                    target="_blank"
                    style={{ marginRight: "-10px", marginLeft: "18px" }}
                  >
                    <span>API</span>
                  </a>
                </div>
              </div>
              <div className="border-t">
                <div className="bg-background">
                  <div className="grid lg:grid-cols-5">
                    <Sidebar sections={[sidebar]} className="hidden lg:block" />
                    <div className="col-span-3 lg:col-span-4 lg:border-l">
                      <div className="h-full px-4 py-6 lg:px-8">{children}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </body>
      </html>
    </ReloadIntervalContext.Provider>
  );
}
