"use client";

import { useEffect, useState } from "react";
import { getCfgs } from "../../lib/utils";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import InfoCfg from "@/components/dashboard/infoCfg";

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
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const router = useRouter();
  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;
  console.log("multipleDeployments", multipleDeployments);
  useEffect(() => {
    if (multipleDeployments === "false") {
      router.replace("/404");
    }
  }, [multipleDeployments, router]);

  useEffect(() => {
    getCfgs().then((data: any) => {
      setConfigurations(data);
      console.log("configurations", data);
      setIsLoading(false);
    });
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between mb-9 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">
          Configurations
        </h2>
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
          {configurations.map((cfg, cfgIndex) =>
            cfg.entities.map((entity, entityIndex) => (
              <InfoCfg
                key={`${cfgIndex}-${entityIndex}`}
                title={cfg.name}
                name={entity.title}
                className="additional-class"
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
