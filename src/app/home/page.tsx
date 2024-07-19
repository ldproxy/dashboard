"use client";

import { useEffect, useState } from "react";
import { getDeployments } from "../../lib/utils";
import { getIcon } from "@/lib/icons";
import Link from "next/link";
import { GetEntities, getHealthChecks, getInfo, getMetrics } from "@/lib/utils";
import { Check } from "@/data/health";
import { InputInfo } from "@/data/info";
import { Metrics } from "@/data/metrics";
import { Deployment } from "@/data/deployments";
import Info from "@/components/dashboard/info";

type InfoType = { [key: string]: InputInfo };
type MetricsType = { [key: string]: Metrics };
type HealthChecksType = { [key: string]: Check[] };

export default function HomePage() {
  const [deployments, setDeployments] = useState([]);
  const [healthChecks, setHealthChecks] = useState<HealthChecksType>({});
  const [metrics, setMetrics] = useState<MetricsType[]>([]);
  const [info, setInfo] = useState<InfoType[]>([]);

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
          console.log("deployment.baseUrl", deployment.apiUrl);
          const newInfo = await getInfo(deployment.apiUrl);
          return { name: deployment.name, info: newInfo };
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
        setMetrics(results);
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
          const newHealthChecks = await getHealthChecks(deployment.apiUrl);
          healthChecksObj[deployment.name] = newHealthChecks;
        });
        await Promise.all(promises);
        setHealthChecks(healthChecksObj);
      }
    } catch (error) {
      console.error("Error loading health checks:", error);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      loadHealthChecks();
      loadInfo();
      loadMetrics();
    }, 2000);
    return () => clearInterval(interval);
    // to avoid indefinite loops
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deployments]);

  const getHealthStatuses = () => {
    if (deployments.length > 0) {
      return deployments.map((deployment: Deployment) => {
        const checks = healthChecks[deployment.name];
        const healthStatus =
          checks && checks.length > 0
            ? checks.some((check: Check) => check.state !== "AVAILABLE")
              ? "UNHEALTHY"
              : "HEALTHY"
            : "";
        return { name: deployment.name, healthStatus };
      });
    } else return null;
  };

  const healthStatuses = getHealthStatuses();

  const currentUrl = new URL(window.location.href);
  const baseUrl = currentUrl.origin;
  const deploymentUrl = `${baseUrl}/deployment`;

  console.log("info", info, "metrics", metrics, "healthChecks", healthChecks);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="justify-between space-y-2">
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ marginBottom: "50px" }}
        >
          Deployments
        </h2>
        <div
          className="grid gap-4 md:grid-cols-1 lg:grid-cols-1 "
          style={{ marginBottom: "10px" }}
        >
          {deployments.map((deployment: any, index: number) =>
            (() => {
              const deploymentInfo = info.find(
                (i) => i.name === deployment.name
              );
              const deploymentMetrics = metrics.find(
                (m) => m.name === deployment.name
              );
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

              return (
                <Link href={deploymentUrl} key={index}>
                  <Info
                    key={index}
                    name={
                      (deploymentInfo &&
                      typeof deploymentInfo.info.url === "string"
                        ? (deploymentInfo.info.url as string)
                            .replace("https://", "")
                            .replace("http://", "") +
                          (deployment.name ? ` (${deployment.name})` : "")
                        : "") || ""
                    }
                    version={
                      deploymentInfo &&
                      typeof deploymentInfo.info.version === "string"
                        ? deploymentInfo.info.version
                        : ""
                    }
                    uptime={
                      deploymentMetrics &&
                      deploymentMetrics.metrics.uptime &&
                      typeof deploymentMetrics.metrics.uptime === "number"
                        ? deploymentMetrics.metrics.uptime
                        : 0
                    }
                    memory={
                      deploymentMetrics &&
                      deploymentMetrics.metrics.memory &&
                      typeof deploymentMetrics.metrics.memory === "number"
                        ? deploymentMetrics.metrics.memory
                        : 0
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
                </Link>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
}
