"use client";

import { useEffect, useState } from "react";
import { Deployment, getDeployments, postDeployment } from "@/lib/deployments";
import { getIcon } from "@/lib/icons";
import Link from "next/link";
import { getAvailableNodes, getAvailableNodesCount } from "@/lib/utils";
import Info from "@/components/dashboard/InfoBox";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { buttonVariants } from "@/components/shadcn-ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { PopUpDialog } from "@/components/dashboard/CreateDeploymentPopUp";
import { DevHome } from "@/dev-data/constants";
import { Check, loadHealthChecksHomePage } from "@/lib/health";
import { InfoItem, loadInfoHomePage } from "@/lib/info";
import { useReloadInterval } from "../layout";
import { IS_MODE_SAAS, IS_MODE_SINGLE } from "@/lib/env";

type InfoType = { name: string; info: InfoItem }[];
type HealthChecksType = { [key: string]: Check[] };

export default function HomePage() {
  const autoRefreshInterval = useReloadInterval();
  const [deployments, setDeployments] = useState([]);
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

  const router = useRouter();

  useEffect(() => {
    if (IS_MODE_SINGLE) {
      router.replace("/404");
    }
  }, [router]);

  useEffect(() => {
    getDeployments().then((data: any) => {
      setDeployments(data);
    });

    if (autoRefreshInterval > 0) {
      const interval = setInterval(() => {
        getDeployments().then((data: any) => {
          setDeployments(data);
        });
      }, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
  }, [autoRefreshInterval]);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        const [health, _] = await Promise.all([
          loadHealthChecksHomePage(deployments),
          loadInfoHomePage(deployments, setInfo),
        ]);
        if (health && Object.keys(health).length > 0) {
          setHealthStatusAndNodes(health);
        }
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
    if (!isInitialLoad && autoRefreshInterval > 0) {
      const loadData = async () => {
        const [health, _] = await Promise.all([
          loadHealthChecksHomePage(deployments),
          loadInfoHomePage(deployments, setInfo),
        ]);
        if (health && Object.keys(health).length > 0) {
          setHealthStatusAndNodes(health);
        }
      };
      const interval = setInterval(loadData, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments, isInitialLoad, autoRefreshInterval]);

  const setHealthStatusAndNodes = async (health: HealthChecksType) => {
    const healthStatuses = await getHealthStatuses(health);
    const availableNodes = await getAvailableNodes(health, deployments);
    const healthyNodes = getAvailableNodesCount(health, deployments);
    setHealthStatuses(healthStatuses);
    setAvailableNodes(availableNodes);
    setHealthyNodes(healthyNodes);
  };

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
        {IS_MODE_SAAS && (
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

              if (DevHome) {
                console.log(
                  "deploymentInfo",
                  deploymentInfo,
                  "deploymentHealthStatus",
                  deploymentHealthStatus
                );
              }

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
                <Link href={`/deployment?did=${deployment.id}`} key={index}>
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
