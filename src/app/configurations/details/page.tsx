"use client";

import { useEffect, useState } from "react";
import { getCfgs } from "../../../lib/utils";
import { ClipLoader } from "react-spinners";
import { useRouter, useSearchParams } from "next/navigation";
import InfoCfg from "@/components/dashboard/InfoCfg";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { DevCfg } from "@/data/constants";

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
  url: string;
  entities: Entity[];
}

export default function HomePage() {
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoConfigMessage, setShowNoConfigMessage] = useState(false);

  let id: string | null = "";
  let searchParams = useSearchParams();

  if (searchParams !== null) {
    const urllId = searchParams.get("id");
    id = urllId;
  }

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
  }, []);

  const filteredConfigurations = configurations.filter(
    (cfg) => cfg.name === id && cfg.entities?.some((entity) => entity.title)
  );

  useEffect(() => {
    if (filteredConfigurations.length === 0) {
      const timer = setTimeout(() => {
        setShowNoConfigMessage(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isLoading, configurations, filteredConfigurations.length]);

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
            Configurations
          </h2>
        </div>
        {isLoading && (
          <div className="ml-auto mr-10">
            <ClipLoader color={"#123abc"} loading={true} size={20} />
          </div>
        )}
      </div>
      <div className="justify-between space-y-2">
        <div
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 "
          style={{ marginBottom: "10px" }}
        >
          {filteredConfigurations.length === 0 && showNoConfigMessage ? (
            <div>Keine Konfigurationen gefunden</div>
          ) : (
            filteredConfigurations.map((cfg, cfgIndex) =>
              cfg.entities.map((entity, entityIndex) => (
                <InfoCfg
                  key={`${cfgIndex}-${entityIndex}`}
                  title={cfg.name}
                  name={entity.title}
                  setConfigurations={setConfigurations}
                />
              ))
            )
          )}
        </div>
      </div>
    </div>
  );
}
