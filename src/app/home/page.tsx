"use client";

import { useEffect, useState } from "react";
import { getDeployments, postDeployment } from "../../lib/utils";
import { getIcon } from "@/lib/icons";
import Link from "next/link";
import { GetEntities, getHealthChecks, getInfo, getMetrics } from "@/lib/utils";
import { Check } from "@/data/health";
import { InputInfo } from "@/data/info";
import { Metrics } from "@/data/metrics";
import { Deployment } from "@/data/deployments";
import Info from "@/components/dashboard/info";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/navigation";

type InfoType = { name: string; info: InputInfo }[];
type MetricsType = { name: string; metrics: Metrics };
type HealthChecksType = { [key: string]: Check[] };

export default function HomePage() {
  const [deployments, setDeployments] = useState([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [metrics, setMetrics] = useState<MetricsType[]>([]);
  const [info, setInfo] = useState<InfoType>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [healthStatuses, setHealthStatuses] = useState<
    { name: string; healthStatus: string }[] | null
  >(null);

  const router = useRouter();
  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;
  console.log("multipleDeployments", multipleDeployments);
  useEffect(() => {
    if (multipleDeployments === "false") {
      router.replace("/404");
    }
  }, [multipleDeployments, router]);

  useEffect(() => {
    getDeployments().then((data: any) => {
      setDeployments(data);
      console.log("deployments", data);
    });
  }, []);

  const loadInfo = async () => {
    try {
      if (deployments.length > 0) {
        const promises = deployments.map(async (deployment: any) => {
          const newInfo = await getInfo(deployment.apiUrl);

          if (newInfo.length > 0) {
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

  const loadMetrics = async () => {
    try {
      if (deployments.length > 0) {
        const promises = deployments.map(async (deployment: any) => {
          const newMetrics = await getMetrics(deployment.apiUrl);
          return { name: deployment.name, metrics: newMetrics };
        });
        const results = await Promise.all(promises);
        const filteredResults = results.filter(
          (result): result is { name: string; metrics: Metrics } =>
            result !== undefined
        );
        setMetrics(filteredResults);
      }
    } catch (error) {
      console.error("Error loading metrics:", error);
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
            healthChecksObj[deployment.name] = [{ state: "OFFLINE" }];
          }
        });
        await Promise.all(promises);
        setHealthChecks(healthChecksObj);
        const healthStatuses = await getHealthStatuses(healthChecksObj);
        setHealthStatuses(healthStatuses);
      }
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      try {
        await Promise.all([loadHealthChecks(), loadInfo(), loadMetrics()]);
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
        await Promise.all([loadHealthChecks(), loadInfo(), loadMetrics()]);
      };
      const interval = setInterval(loadData, 2000);
      return () => clearInterval(interval);
    }
    // not all dependendies to avoid infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]);

  const getHealthStatuses = async (healthChecks: HealthChecksType) => {
    if (deployments.length > 0) {
      return deployments.map((deployment: Deployment) => {
        const checks = healthChecks[deployment.name];

        let healthStatus = "";

        if (checks && checks.length > 0) {
          if (checks.some((check) => check.state === "UNAVAILABLE")) {
            healthStatus = "UNHEALTHY";
          } else if (checks.every((check) => check.state === "AVAILABLE")) {
            healthStatus = "HEALTHY";
          } else if (checks.some((check) => check.state === "OFFLINE")) {
            healthStatus = "OFFLINE";
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
      <div className="flex items-center justify-between mb-9 mt-8">
        <h2 className="text-2xl font-semibold tracking-tight">Deployments</h2>
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
          {deployments.map((deployment: any, index: number) =>
            (() => {
              const deploymentInfo =
                info &&
                info.find((i) => {
                  return i.name === deployment.name;
                });

              const deploymentMetrics =
                metrics &&
                metrics.find((m) => {
                  return m.name === deployment.name;
                });
              const deploymentHealthStatus =
                healthStatuses &&
                healthStatuses.find((h) => h.name === deployment.name)
                  ?.healthStatus;

              console.log(
                "deploymentInfo",
                deploymentInfo,
                "deploymentMetrics",
                deploymentMetrics,
                "deploymentHealthStatus",
                deploymentHealthStatus
              );

              const infoComponent = (
                <Info
                  key={index}
                  name={
                    (deploymentInfo &&
                    Array.isArray(deploymentInfo.info) &&
                    deploymentInfo.info.length > 0 &&
                    typeof deploymentInfo.info[0].url === "string"
                      ? deploymentInfo.info[0].url
                          .replace("https://", "")
                          .replace("http://", "")
                          .replace(/\/$/, "") +
                        (deployment.name ? ` (${deployment.name})` : "")
                      : "") || ""
                  }
                  versions={
                    deploymentInfo && Array.isArray(deploymentInfo.info)
                      ? deploymentInfo.info
                          .filter((item) => typeof item.version === "string")
                          .map((item) => ({
                            version: item.version,
                            apiUrl: item.apiUrl,
                          }))
                      : []
                  }
                  uptimes={
                    deploymentMetrics &&
                    Array.isArray(deploymentMetrics.metrics)
                      ? deploymentMetrics.metrics
                          .filter((metric) => typeof metric.uptime === "number")
                          .map((metric) => ({
                            uptime: metric.uptime,
                            apiUrl: metric.apiUrl,
                          }))
                      : []
                  }
                  memories={
                    deploymentMetrics &&
                    Array.isArray(deploymentMetrics.metrics)
                      ? deploymentMetrics.metrics
                          .filter((metric) => typeof metric.memory === "number")
                          .map((metric) => ({
                            memory: metric.memory,
                            apiUrl: metric.apiUrl,
                          }))
                      : []
                  }
                  health={
                    deploymentHealthStatus &&
                    typeof deploymentHealthStatus === "string"
                      ? deploymentHealthStatus
                      : ""
                  }
                  IconFooter1={getIcon("Clock")}
                  IconFooter2={getIcon("Upload")}
                  IconFooter3={getIcon("Desktop")}
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
