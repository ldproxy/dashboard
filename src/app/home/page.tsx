"use client";

import { useEffect, useState } from "react";
import { Deployment, getDeployments, postDeployment } from "@/lib/deployments";
import { getIcon } from "@/lib/icons";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import {
  getLimitedNodes,
  getHealthyNodesCount,
  getOfflineNodesCount,
} from "@/lib/utils";
import InfoBox from "@/components/dashboard/InfoBox";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { buttonVariants } from "@/components/shadcn-ui/button";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { PopUpDialog } from "@/components/dashboard/CreateDeploymentPopUp";
import { DevHome } from "@/dev-data/constants";
import { Check } from "@/lib/health";
import { InfoItem } from "@/lib/info";
import { useReloadInterval } from "../layout";
import { IS_MODE_SAAS, IS_MODE_SINGLE } from "@/lib/env";
type InfoType = { name: string; info: InfoItem }[];
type HealthChecksType = { [key: string]: Check[] };
import { useDataLoader } from "@/lib/loadDataHook";

export default function HomePage() {
  const autoRefreshInterval = useReloadInterval();
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [limitedNodes, setLimitedNodes] = useState([
    { name: "", availableUrlsCount: 0 },
  ]);
  const [offlineNodes, setOfflineNodes] = useState([
    { name: "", offlineUrlsCount: 0 },
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState<
    { name: string; healthStatus: string }[] | null
  >(null);
  const [healthyNodes, setHealthyNodes] = useState<
    { name: string; availableUrlsCount: number }[] | null
  >(null);
  const [popUp, setPopUp] = useState<boolean>(false);
  const {
    healthCecksHomepage,
    infoHomepage,
    loadData,
    errorStatus,
    fetchError,
  } = useDataLoader(undefined, deployments);
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
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]);

  useEffect(() => {
    const loadDataHomepage = async () => {
      setIsLoading(true);
      try {
        if (
          healthCecksHomepage &&
          Object.keys(healthCecksHomepage).length > 0
        ) {
          setHealthStatusAndNodes(healthCecksHomepage);
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
      (async () => {
        await loadData({
          loadHealthChecksHomepage: true,
          loadInfoHomepage: true,
        });
        loadDataHomepage();
      })();
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments, healthCecksHomepage]);

  useEffect(() => {
    if (!isInitialLoad && autoRefreshInterval > 0) {
      const loadDataHomepage = async () => {
        loadData({ loadHealthChecksHomepage: true, loadInfoHomepage: true });

        if (
          healthCecksHomepage &&
          Object.keys(healthCecksHomepage).length > 0
        ) {
          setHealthStatusAndNodes(healthCecksHomepage);
        }
      };
      const interval = setInterval(() => {
        loadDataHomepage();
      }, autoRefreshInterval * 1000);
      return () => clearInterval(interval);
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments, isInitialLoad, autoRefreshInterval, healthCecksHomepage]);

  const setHealthStatusAndNodes = async (health: HealthChecksType) => {
    const healthStatuses = await getHealthStatuses(health);
    const limitedNodes = await getLimitedNodes(health, deployments);
    const healthyNodes = getHealthyNodesCount(health, deployments);
    const offlineNodes = getOfflineNodesCount(health, deployments);
    setHealthStatuses(healthStatuses);
    setLimitedNodes(limitedNodes);
    setHealthyNodes(healthyNodes);
    setOfflineNodes(offlineNodes);
  };
  const getHealthStatuses = async (healthChecks: HealthChecksType) => {
    if (deployments.length > 0) {
      return deployments.map((deployment: Deployment) => {
        const checks = healthChecks[deployment.name];
        let healthStatus = "";

        if (checks && checks.length > 0) {
          const hasErrorStatus = deployment.apiUrl.some((url) =>
            Object.keys(errorStatus).includes(url)
          );

          if (hasErrorStatus) {
            healthStatus = "LIMITED";
          } else if (checks.every((check) => check.state === "AVAILABLE")) {
            healthStatus = "HEALTHY";
          } else if (checks.every((check) => check.state === "OFFLINE")) {
            healthStatus = "OFFLINE";
          } else {
            healthStatus = "LIMITED";
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
          {Object.values(fetchError).map(
            (error, index) =>
              error && (
                <div
                  key={index}
                  className="flex items-center space-x-2 p-4 bg-red-100 border border-red-400 text-red-700 rounded"
                >
                  <ExclamationTriangleIcon className="h-5 w-5" />
                  <span>{error}</span>
                </div>
              )
          )}
          {deployments.map((deployment: any, index: number) =>
            (() => {
              const deploymentInfo =
                infoHomepage &&
                infoHomepage.find((i) => {
                  return i.name === deployment.name;
                });

              const deploymentHealthStatus =
                healthStatuses &&
                healthStatuses.find((h) => h.name === deployment.name)
                  ?.healthStatus;

              const limitedNodesCount =
                limitedNodes.find((node) => node.name === deployment.name)
                  ?.availableUrlsCount || 0;

              const healthyNodesCount =
                (healthyNodes &&
                  healthyNodes.find((node) => node.name === deployment.name)
                    ?.availableUrlsCount) ||
                0;

              const offlineNodesCount =
                (offlineNodes &&
                  offlineNodes.find((node) => node.name === deployment.name)
                    ?.offlineUrlsCount) ||
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
                <InfoBox
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
                  limitedNodes={limitedNodesCount}
                  healthyNodes={healthyNodesCount}
                  offlineNodes={offlineNodesCount}
                  healthStatus={
                    deploymentHealthStatus &&
                    typeof deploymentHealthStatus === "string"
                      ? deploymentHealthStatus
                      : ""
                  }
                  IconFooter1={getIcon("InfoCircled")}
                  IconFooter2={getIcon("CheckCircled")}
                  IconFooter3={getIcon("QuestionMark")}
                  IconFooter4={getIcon("Cross")}
                  className="hover:bg-gray-100 transition-colors duration-200"
                />
              );

              return deploymentHealthStatus === "OFFLINE" ? (
                <div key={index}>{infoComponent}</div>
              ) : (
                <span
                  className="cursor-pointer"
                  onClick={() =>
                    router.push(`/deployment?did=${deployment.id}`)
                  }
                  key={index}
                >
                  {infoComponent}
                </span>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
