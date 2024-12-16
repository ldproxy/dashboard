"use client";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shadcn-ui/theme";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useEffect, useState, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { FormControl } from "@/components/shadcn-ui/form";

import "./globals.css";
import { icons } from "@/lib/icons";
import { Dev } from "@/dev-data/constants";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [deploymentId, setDeploymentId] = useState("");
  const [showSelect, setShowSelect] = useState(false);
  const [reloadInterval, setReloadInterval] = useState("off");
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const selectRef = useRef<HTMLSelectElement>(null);
  const reloadOptions = ["off", "1", "2", "5", "10", "20"];

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

    if (
      process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "multi" ||
      process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "saas"
    ) {
      getDeploymentId();
    }
  }, [pathname, searchParams]);

  const handleIconClick = () => {
    setShowSelect(!showSelect);
  };

  const handleSelectChange = (value: string) => {
    setReloadInterval(value);
    setShowSelect(false);
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (
      selectRef.current &&
      !selectRef.current.contains(event.target as Node)
    ) {
      setShowSelect(false);
    }
  };

  useEffect(() => {
    if (showSelect) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showSelect]);

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
                <div className="relative group">
                  <Select
                    onValueChange={handleSelectChange}
                    value={reloadInterval}
                  >
                    <SelectTrigger style={{ height: "25px", width: "82px" }}>
                      <div className="flex items-center justify-center ">
                        <ReloadIcon
                          className="h-4 w-4 inline"
                          style={{
                            cursor: "pointer",
                            marginTop: "-2px",
                          }}
                          onClick={handleIconClick}
                        />
                      </div>
                      <div className="absolute left-1/2 transform -translate-x-1/2 w-px h-full bg-gray-300"></div>
                    </SelectTrigger>
                    <SelectContent>
                      {reloadOptions.map((option, index) => (
                        <SelectItem key={index} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <div className="absolute left-0 mb-1 hidden group-hover:block bg-white border border-gray-300 rounded shadow-lg p-1">
                    Reload
                  </div>
                </div>
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
                        global:
                          process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS ===
                          "saas"
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
  );
}
