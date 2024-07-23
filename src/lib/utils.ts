"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { useState, useEffect } from "react";
import { Deployment } from "@/data/deployments";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const multipleDeployments = process.env.MULTIPLE_DEPLOYMENTS;

/*
const currentUrl = new URL(window.location.href);
const baseUrl = currentUrl.origin;
const apiUrl = `${baseUrl}/api`;
const API_URL = apiUrl;
*/

// const API_URL = "http://localhost:7081/api";
const API_URL2 = "/api";

export async function GetApiUrl(): Promise<string> {
  let apiUrl = "";

  const deployments = await getDeployments();

  const currentUrl = new URL(window.location.href);

  if (currentUrl && deployments.length > 0) {
    const url = new URL(currentUrl.href);
    const queryParams = new URLSearchParams(url.search);
    const deploymentId = queryParams.get("did");

    let matchingDeployment;
    // case multipleDeployments === "true"
    if (deploymentId) {
      matchingDeployment = deployments.find(
        (deployment: Deployment) => deployment.id === deploymentId
      );
      // case multipleDeployments === "false"
    } else {
      const baseUrl = currentUrl.origin;
      const apiUrl = `${baseUrl}/api`;

      return apiUrl;
    }

    if (matchingDeployment && matchingDeployment.apiUrl) {
      apiUrl = matchingDeployment.apiUrl;
    }

    return apiUrl;
  }
  return apiUrl;
}

export const GetEntities = async (API_URL?: string) => {
  let apiUrl = API_URL;
  if (!apiUrl) {
    apiUrl = await GetApiUrl();
  }
  try {
    const response = await fetch(apiUrl + "/entities");
    const data = await response.json();
    const newMappedEntities = Object.keys(data)
      .flatMap((type) =>
        data[type].map((entity: any) => ({
          type,
          uid: `${type}_${entity.id}`,
          ...entity,
        }))
      )
      .filter((entity: any) => entity.status !== "DISABLED");
    return newMappedEntities;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

function calculateDaysBetweenDates(begin: number, end: number): number {
  const oneDay = 1000 * 60 * 60 * 24;
  const diff = end - begin;
  return Math.floor(diff / oneDay);
}

export const getHealthChecks = async (API_URL?: string) => {
  let apiUrl = API_URL;
  if (!apiUrl) {
    apiUrl = await GetApiUrl();
  }
  try {
    const response = await fetch(apiUrl + "/health");
    if (!response.ok) {
      throw new Error(`API call failed with status: ${response.status}`);
    }
    const data = await response.json();
    const mappedHealthChecks = Object.keys(data).map((name) => ({
      name,
      ...data[name],
      capabilities: data[name].capabilities
        ? Object.keys(data[name].capabilities).map((cap) => ({
            name: cap,
            ...data[name].capabilities[cap],
          }))
        : undefined,
      components: data[name].components
        ? Object.keys(data[name].components).map((comp) => ({
            name: comp,
            ...data[name].components[comp],
          }))
        : undefined,
    }));
    return mappedHealthChecks;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getInfo = async (API_URL?: string) => {
  let apiUrl = API_URL;
  if (!apiUrl) {
    apiUrl = await GetApiUrl();
  }
  try {
    const response = await fetch(apiUrl + "/info");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getMetrics = async (API_URL?: string) => {
  let apiUrl = API_URL;
  if (!apiUrl) {
    apiUrl = await GetApiUrl();
  }
  try {
    const response = await fetch(apiUrl + "/metrics");
    const data = await response.json();
    return {
      uptime: data.gauges["jvm.attribute.uptime"].value,
      memory: data.gauges["jvm.memory.total.used"].value,
    };
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeployments = async () => {
  try {
    const response = await fetch("/api/deployments");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const postDeployment = async (deployment: Deployment) => {
  try {
    const response = await fetch("/api/deployments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(deployment),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getValues = async (API_URL?: string) => {
  let apiUrl = API_URL;
  if (!apiUrl) {
    apiUrl = await GetApiUrl();
  }
  try {
    const response = await fetch(apiUrl + "/values");
    const data = await response.json();
    return Object.keys(data).flatMap((type) =>
      data[type].map((value: any) => ({
        type,
        uid: `${type}_${value.path}`,
        ...value,
      }))
    );
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/entities/${formattedParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeploymentCfg = async () => {
  try {
    const response = await fetch(API_URL2 + "/cfg/global/deployment");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getValuesCfg = async (param: string) => {
  try {
    const formattedParam = param.replace(/_/g, "/");

    const response = await fetch(`${API_URL2}/cfg/values/${formattedParam}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
