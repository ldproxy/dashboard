"use client";

import { useEffect, useState } from "react";
import Prism from "prismjs";
import "prismjs/components/prism-json";
import "prismjs/themes/prism.css";
import { useRouter, useSearchParams } from "next/navigation";
import { getCfgs } from "@/lib/cfg";
import { ClipLoader } from "react-spinners";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { DevCfg } from "@/dev-data/constants";
import { useReloadInterval } from "../../../layout";

interface Entity {
  title: string;
  content: {
    id: string;
    enabled: boolean;
    providerType: string;
    providerSubType: string;
  };
}

interface Configuration {
  name: string;
  entities: Entity[];
}

export default function HomePage() {
  const autoRefreshInterval = useReloadInterval();
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cfg, setCfg] = useState<any>(null);

  const router = useRouter();
  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;
  if (DevCfg) {
    console.log("multipleDeployments", multipleDeployments);
  }

  useEffect(() => {
    getCfgs().then((data: any) => {
      setConfigurations(data);
      if (DevCfg) {
        console.log("configurations", data);
      }
      setIsLoading(false);
    });

    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        getCfgs().then((data: any) => {
          setConfigurations(data);
        });
      }, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval]);

  const searchParams = useSearchParams();
  let idParam: string | null = null;
  let cfgParam: string | null = null;
  if (searchParams) {
    idParam = searchParams.get("id");
    cfgParam = searchParams.get("cfg");
  }

  useEffect(() => {
    if (idParam && cfgParam && configurations.length > 0) {
      const config = configurations.find((cfg) => cfg.name === idParam);
      if (config) {
        const entity = config.entities.find(
          (entity) => entity.title === cfgParam
        );
        if (entity) {
          setCfg(entity.content);
        }
      }
    }
  }, [idParam, cfgParam, configurations]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between mb-9 mt-8">
        <div className="flex items-center">
          <a
            onClick={() => router.back()}
            className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400 mr-2.5"
          >
            <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
          </a>
          <h2 className="text-2xl font-semibold tracking-tight">
            {idParam ? `${idParam}` : "Configuration"}
          </h2>
        </div>
        {isLoading && (
          <div className="ml-auto mr-10">
            <ClipLoader color={"#123abc"} loading={true} size={20} />
          </div>
        )}
      </div>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          borderRadius: "8px",
          padding: "16px",
          border: "1px solid lightgray",
        }}
      >
        {isLoading ? (
          <div className="flex items-center">
            <ClipLoader color={"#123abc"} loading={true} size={20} />
            <span style={{ marginLeft: "5px" }}>Loading...</span>
          </div>
        ) : cfg ? (
          Object.entries(cfg).map(([key, value]) => {
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
          })
        ) : (
          <div>No configuration found.</div>
        )}
      </div>
    </div>
  );
}
