"use client";
import type { Metadata } from "next";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shadcn-ui/theme";
import { Sidebar } from "@/components/dashboard/sidebar";
import {
  PlayIcon,
  DashboardIcon,
  CodeIcon,
  IdCardIcon,
  MixIcon,
} from "@radix-ui/react-icons";
import { useEffect, useState } from "react";

import "./globals.css";
import { icons } from "@/lib/icons";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [deploymentId, setDeploymentId] = useState("");

  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

  const getDeploymentId = async () => {
    const currentUrl = new URL(window.location.href);
    const queryParams = new URLSearchParams(currentUrl.search);
    const did = queryParams.get("did");
    if (did) {
      setDeploymentId(did);
    }
  };

  if (multipleDeployments === "true") {
    setInterval(() => {
      getDeploymentId();
    }, 2000);
  }
  console.log("deploymentId", deploymentId);
  return (
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
                <Link href="/api" target="_blank">
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
  );
}
