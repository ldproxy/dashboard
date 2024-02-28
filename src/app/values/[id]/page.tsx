"use client";
import { Button } from "@/components/shadcn-ui/button";
import { GetEntities, getValuesCfg, getHealthChecks } from "@/lib/utils";
import { ReloadIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [cfg, setCfg] = useState<{}>({});
  const [hasError, setHasError] = useState(false);
  const router = useRouter();

  const loadCfg = async () => {
    try {
      const newCfg = await getValuesCfg(params.id);
      if (newCfg.message === "Method not allowed") {
        setHasError(true);
      } else {
        setCfg(newCfg);
      }
    } catch (error) {
      setHasError(true);
      console.error("Error loading cfg:", error);
    }
  };

  useEffect(() => {
    loadCfg();
  }, []);

  return (
    <>
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <a
            onClick={() => router.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
          </a>
          <h2 className="text-2xl font-semibold tracking-tight ml-2">
            {params.id ? params.id.split("_")[1] : "Not Found..."}
          </h2>
        </div>
        <div className="p-8 pt-6">
          <Button
            onClick={() => {
              loadCfg();
            }}
            className="font-bold"
          >
            <ReloadIcon className="mr-2 h-4 w-4" />
            Reload
          </Button>
        </div>
      </div>
      <div className="p-8 pt-6">
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid lightgray",
          }}
        >
          {hasError
            ? "No results."
            : Object.keys(cfg).length === 0
            ? "Loading..."
            : Object.entries(cfg).map(([key, value]) => {
                const strValue = JSON.stringify(value, null, 2);

                const highlightedValue = Prism.highlight(
                  strValue,
                  Prism.languages.json,
                  "json"
                );

                return (
                  <div key={key} style={{ display: "flex" }}>
                    <span>{key}:</span>
                    <pre
                      dangerouslySetInnerHTML={{ __html: highlightedValue }}
                      style={{ margin: "0 0 0 10px" }}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </>
  );
}
