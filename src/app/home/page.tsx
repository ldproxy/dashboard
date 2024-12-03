"use client";

import { useEffect, useState } from "react";
import { getDeployments, postDeployment } from "../../lib/utils";
import { getIcon } from "@/lib/icons";
import Link from "next/link";
import {
  getHealthChecks,
  getInfo,
  getAvailableNodes,
  getAvailableNodesCount,
} from "@/lib/utils";
import { Check } from "@/data/health";
import { InputInfo } from "@/data/info";
import { Deployment } from "@/data/deployments";
import Info from "@/components/dashboard/homeInfo";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { buttonVariants } from "@/components/shadcn-ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { PopUpDialog } from "@/lib/cfgPopUp";

type InfoType = { name: string; info: InputInfo }[];
type HealthChecksType = { [key: string]: Check[] };

export default function HomePage() {
  const [deployments, setDeployments] = useState([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [availableNodes, setAvailableNodes] = useState([
    { name: "", availableUrlsCount: 0 },
  ]);
  const [info, setInfo] = useState<InfoType>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState<
    { name: string; healthStatus: string }[] | null
  >(null);
  const [healthyNodes, setHealthyNodes] = useState<
    { name: string; availableUrlsCount: number }[] | null
  >(null);
  const [popUp, setPopUp] = useState<boolean>(false);

  const createDeployment = async (data: any) => {
    try {
      await postDeployment({
        name: data.name,
        apiUrl: [`http://${data.url}/api`],
        url: `http://${data.url}/deployment`,
        id: data.id,
        cfg: data.cfg,
      });
      const deploymentsData = await getDeployments();
      setDeployments(deploymentsData);
      return { success: true };
    } catch (error) {
      console.error("Fehler beim Erstellen des Deployments", error);
      return { success: false };
    }
  };

  const router = useRouter();
  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;
  console.log("multipleDeployments", multipleDeployments);
  useEffect(() => {
    if (multipleDeployments === "single") {
      if (multipleDeployments === "single") {
        router.replace("/404");
      }
    }
  }, [multipleDeployments, router]);

  useEffect(() => {
    getDeployments().then((data: any) => {
      setDeployments(data);
    });
  }, []);

  const loadInfo = async () => {
    try {
      if (deployments.length > 0) {
        const promises = deployments.map(async (deployment: any) => {
          const newInfo = await getInfo(deployment.apiUrl);

          if (newInfo && newInfo.length > 0) {
            return { name: deployment.name, info: newInfo as InputInfo };
          } else {
            return { name: deployment.name, info: [] as InputInfo };
          }
        });
        const results = await Promise.all(promises);
        setInfo(results);
      }
    } catch (error) {
      console.error("Error loading info:", error);
    }
  };

  const loadHealthChecks = async () => {
    try {
      if (deployments.length > 0) {
        let healthChecksObj: HealthChecksType = {};
        const promises = deployments.map(async (deployment: any) => {
          try {
            const newHealthChecks = await getHealthChecks(deployment.apiUrl);
            healthChecksObj[deployment.name] = newHealthChecks;
          } catch (error) {
            console.error(
              "Error fetching health checks for",
              deployment.name,
              ":",
              error
            );
            healthChecksObj[deployment.name] = [
              { state: "OFFLINE", url: deployment.url },
            ];
          }
        });
        await Promise.all(promises);
        setHealthChecks(healthChecksObj);
        const healthStatuses = await getHealthStatuses(healthChecksObj);
        const availableNodes = await getAvailableNodes(
          healthChecksObj,
          deployments
        );
        const healthyNodes = await getAvailableNodesCount(
          healthChecksObj,
          deployments
        );
        setHealthStatuses(healthStatuses);
        setAvailableNodes(availableNodes);
        setHealthyNodes(healthyNodes);
      }
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadHealthChecks(), loadInfo()]);
      } catch (error) {
        console.error(
          "Ein Fehler ist beim Laden der Daten aufgetreten:",
          error
        );
      } finally {
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    if (isInitialLoad && deployments.length > 0) {
      loadData();
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]);

  useEffect(() => {
    if (!isInitialLoad) {
      const loadData = async () => {
        await Promise.all([loadHealthChecks(), loadInfo()]);
      };
      const interval = setInterval(loadData, 2000);
      return () => clearInterval(interval);
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments, isInitialLoad]);

  const getHealthStatuses = async (healthChecks: HealthChecksType) => {
    if (deployments.length > 0) {
      return deployments.map((deployment: Deployment) => {
        const checks = healthChecks[deployment.name];
        let healthStatus = "";

        if (checks && checks.length > 0) {
          if (checks.every((check) => check.state === "AVAILABLE")) {
            healthStatus = "HEALTHY";
          } else if (checks.every((check) => check.state === "OFFLINE")) {
            healthStatus = "OFFLINE";
          } else if (
            checks.some((check) => check.state === "OFFLINE") &&
            checks.some((check) => check.state === "AVAILABLE")
          ) {
            healthStatus = "LIMITED";
          } else {
            healthStatus = "AVAILABLE";
          }
        } else {
          healthStatus = "OFFLINE";
        }

        return { name: deployment.name, healthStatus };
      });
    } else return null;
  };

  const currentUrl = new URL(window.location.href);
  const baseUrl = currentUrl.origin;
  const deploymentUrl = `${baseUrl}/deployment`;

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">Deployments</h2>
        {isLoading && (
          <div className="ml-auto mr-10">
            <ClipLoader color={"#123abc"} loading={true} size={20} />
          </div>
        )}
        {/* <Button className="font-bold" onClick={createDeployment}>
          Create Deployment
        </Button> */}
        {process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "saas" && (
          <Dialog onOpenChange={(open) => setPopUp(open)}>
            <DialogTrigger
              className={buttonVariants({ variant: "default" })}
              style={{ fontWeight: "bold" }}
            >
              <PlusCircledIcon className="mr-2 h-4 w-4" />
              Neu
            </DialogTrigger>
            <PopUpDialog onSubmit={createDeployment} />
          </Dialog>
        )}
      </div>
      <div className="justify-between space-y-2">
        <div
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 "
          style={{ marginBottom: "10px" }}
        >
          {deployments.map((deployment: any, index: number) =>
            (() => {
              const deploymentInfo =
                info &&
                info.find((i) => {
                  return i.name === deployment.name;
                });

              const deploymentHealthStatus =
                healthStatuses &&
                healthStatuses.find((h) => h.name === deployment.name)
                  ?.healthStatus;

              const availableNodesCount =
                availableNodes.find((node) => node.name === deployment.name)
                  ?.availableUrlsCount || 0;

              const healthyNodesCount =
                (healthyNodes &&
                  healthyNodes.find((node) => node.name === deployment.name)
                    ?.availableUrlsCount) ||
                0;

              console.log(
                "deploymentInfo",
                deploymentInfo,
                "deploymentHealthStatus",
                deploymentHealthStatus
              );

              const infoComponent = (
                <Info
                  key={index}
                  name={deployment.name ? ` ${deployment.name}` : ""}
                  url={
                    deploymentInfo &&
                    Array.isArray(deploymentInfo.info) &&
                    deploymentInfo.info.length > 0 &&
                    typeof deploymentInfo.info[0].url === "string"
                      ? deploymentInfo.info[0].url
                      : ""
                  }
                  totalNodes={deployment.apiUrl.length}
                  availableNodes={availableNodesCount}
                  HealthyNodes={healthyNodesCount}
                  healthStatus={
                    deploymentHealthStatus &&
                    typeof deploymentHealthStatus === "string"
                      ? deploymentHealthStatus
                      : ""
                  }
                  IconFooter1={getIcon("InfoCircled")}
                  IconFooter2={getIcon("CheckCircled")}
                  IconFooter3={getIcon("QuestionMark")}
                  className="hover:bg-gray-100 transition-colors duration-200"
                />
              );

              return deploymentHealthStatus === "OFFLINE" ? (
                <div key={index}>{infoComponent}</div>
              ) : (
                <Link
                  href={`${deploymentUrl}?did=${deployment.id}`}
                  key={index}
                >
                  {infoComponent}
                </Link>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
