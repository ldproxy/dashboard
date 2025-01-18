"use client";

import { useEffect, useState } from "react";
import { getCfgs } from "../../lib/cfg";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import InfoCfg from "@/components/dashboard/InfoCfg";
import { ChevronLeftIcon } from "@radix-ui/react-icons";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { PopUpDialog } from "@/components/dashboard/CreateCfgPopUp";
import { buttonVariants } from "@/components/shadcn-ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { DevCfg } from "@/dev-data/constants";
import { postCfg } from "@/lib/cfg";
import { useReloadInterval } from "../layout";

interface Configuration {
  name: string;
  url: string;
}

export default function HomePage() {
  const autoRefreshInterval = useReloadInterval();
  const [configurations, setConfigurations] = useState<Configuration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [popUp, setPopUp] = useState<boolean>(false);

  const router = useRouter();

  useEffect(() => {
    getCfgs().then((data: any) => {
      setConfigurations(data);
      if (DevCfg) {
        console.log("configurations", data);
      }
      setIsLoading(false);

      if (autoRefreshInterval > 0) {
        const interval = setInterval(() => {
          getCfgs().then((data: any) => {
            setConfigurations(data);
          });
        }, autoRefreshInterval * 1000);
        return () => clearInterval(interval);
      }
    });
  }, [autoRefreshInterval]);

  const hasNoQueryParams =
    new URLSearchParams(window.location.search).toString() === "";

  const createCfg = async (data: any) => {
    try {
      await postCfg({
        name: data.name,
        url: data.url,
      });
      const cfgData = await getCfgs();
      setConfigurations(cfgData);
      return { success: true };
    } catch (error) {
      console.error("Fehler beim Erstellen der Konfiguration", error);
      return { success: false };
    }
  };

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between mb-9 mt-8">
        <div className="flex items-center">
          {hasNoQueryParams && (
            <a
              onClick={() => router.back()}
              className="font-bold flex items-center cursor-pointer text-blue-500 hover:text-blue-400 mr-2.5"
            >
              <ChevronLeftIcon className="mr-[-1px] h-6 w-6" />
            </a>
          )}
          <h2 className="text-2xl font-semibold tracking-tight">
            Configurations
          </h2>
        </div>
        {isLoading && (
          <div className="ml-auto mr-10">
            <ClipLoader color={"#123abc"} loading={true} size={20} />
          </div>
        )}
        <Dialog onOpenChange={(open) => setPopUp(open)}>
          <DialogTrigger
            className={buttonVariants({ variant: "default" })}
            style={{ fontWeight: "bold" }}
          >
            <PlusCircledIcon className="mr-2 h-4 w-4" />
            Neu
          </DialogTrigger>
          <PopUpDialog onSubmit={createCfg} />
        </Dialog>
      </div>
      <div className="justify-between space-y-2">
        <div
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 "
          style={{ marginBottom: "10px" }}
        >
          {configurations.map((cfg, cfgIndex) => (
            <InfoCfg
              key={`${cfgIndex}`}
              name={cfg.name}
              cfgUrl={cfg.url}
              setConfigurations={setConfigurations}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
