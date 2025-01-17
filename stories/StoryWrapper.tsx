import React from "react";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../src/components/shadcn-ui/theme";
import { cn } from "../src/lib/utils";
import "../src/app/globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

const StoryWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div
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
        {children}
      </ThemeProvider>
    </div>
  );
};

export default StoryWrapper;
