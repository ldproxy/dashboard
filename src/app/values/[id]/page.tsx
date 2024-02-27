"use client";
import { Button } from "@/components/shadcn-ui/button";
import { GetEntities, getValuesCfg, getHealthChecks } from "@/lib/utils";
import { ReloadIcon, ChevronLeftIcon } from "@radix-ui/react-icons";
import { useState, useEffect } from "react";

import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";

export default function CustomerPage({ params }: { params: { id: string } }) {
  const [cfg, setCfg] = useState<{}>({});

  const loadCfg = async () => {
    try {
      const newCfg = await getValuesCfg(params.id);
      setCfg(newCfg);
    } catch (error) {
      console.error("Error loading cfg:", error);
    }
  };

  useEffect(() => {
    loadCfg();
  }, []);

  return (
    <>
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <a
            onClick={() => window.history.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
            Back
          </a>
          <div className="flex items-center space-x-2">
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
        <h2 className="text-2xl font-semibold tracking-tight">
          {params.id ? params.id.split("_")[1] : "Not Found..."}
        </h2>
        <div
          style={{
            backgroundColor: "#f5f5f5",
            borderRadius: "8px",
            padding: "16px",
            border: "1px solid lightgray",
          }}
        >
          {Object.entries(cfg).map(([key, value]) => {
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
