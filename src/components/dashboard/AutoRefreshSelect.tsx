"use client";
import React, {
  useEffect,
  useState,
  useRef,
  createContext,
  useContext,
  useCallback,
} from "react";
import Link from "next/link";
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";
import { ThemeProvider } from "@/components/shadcn-ui/theme";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { DashboardIcon, ReloadIcon } from "@radix-ui/react-icons";
import { useSearchParams } from "next/navigation";
import { usePathname } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/shadcn-ui/select";

import "../../app/globals.css";

const ReloadSelect = ({ reloadInterval, setReloadInterval }) => {
  const [showSelect, setShowSelect] = useState(false);
  const selectRef = useRef<HTMLDivElement>(null);
  const reloadOptions = ["off", "1", "2", "5", "10", "20", "60"];

  const handleIconClick = () => {
    setShowSelect(!showSelect);
  };

  const handleSelectChange = (value: string) => {
    const interval = value === "off" ? 0 : Number(value);
    if (interval !== reloadInterval) {
      setReloadInterval(interval);
    }
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
    <div className="relative group" ref={selectRef}>
      <Select
        onValueChange={handleSelectChange}
        value={reloadInterval === 0 ? "off" : reloadInterval?.toString()}
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
  );
};

export default ReloadSelect;
