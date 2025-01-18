"use client";
import React, { useEffect, useState, createContext, useContext } from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shadcn-ui/theme";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { icons } from "@/lib/icons";
import { Dev } from "@/dev-data/constants";
import "./globals.css";

import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";

import ReloadSelect from "@/components/dashboard/AutoRefreshSelect";
import { IS_MODE_MULTI, IS_MODE_SAAS } from "@/lib/env";

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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [deploymentId, setDeploymentId] = useState("");
  const [reloadInterval, setReloadInterval] = useState<number>(0);
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    const getDeploymentId = () => {
      let did;
      if (searchParams) {
        if (Dev) {
          console.log("params", searchParams.get("did"));
        }
        did = searchParams.get("did");
      }
      if (did && typeof did === "string") {
        setDeploymentId(did);
      }
    };

    if (IS_MODE_MULTI) {
      getDeploymentId();
    }
  }, [pathname, searchParams]);

  return (
    <ReloadIntervalContext.Provider value={{ reloadInterval }}>
      <html lang="en">
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
                  <ReloadSelect
                    reloadInterval={reloadInterval}
                    setReloadInterval={setReloadInterval}
                  />
                  <Link
                    href="/api"
                    target="_blank"
                    style={{ marginRight: "-10px", marginLeft: "18px" }}
                  >
                    <span>API</span>
                  </Link>
                </div>
              </div>
              <div className="border-t">
                <div className="bg-background">
                  <div className="grid lg:grid-cols-5">
                    <Sidebar
                      sections={[
                        {
                          title: "",
                          entries: [
                            {
                              title: "Deployment",
                              icon: icons.Play,
                              route: deploymentId
                                ? `/deployment?did=${deploymentId}`
                                : "/deployment",
                            },
                            {
                              title: "Entities",
                              icon: icons.Id,
                              route: deploymentId
                                ? `/entities?did=${deploymentId}`
                                : "/entities",
                            },
                            {
                              title: "Values",
                              icon: icons.Code,
                              route: deploymentId
                                ? `/values?did=${deploymentId}`
                                : "/values",
                            },
                          ],
                          global: IS_MODE_SAAS
                            ? [
                                {
                                  title: "Configurations",
                                  icon: icons.Reader,
                                  route: deploymentId
                                    ? `/configurations?did=${deploymentId}`
                                    : "/configurations",
                                },
                              ]
                            : [],
                        },
                      ]}
                      className="hidden lg:block"
                    />
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
