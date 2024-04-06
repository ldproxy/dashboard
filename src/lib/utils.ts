"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const API_URL = "/api";//"http://localhost:7081/api";
const API_URL2 = "/api";

export const GetEntities = async () => {
  try {
    const response = await fetch(API_URL + "/entities");
    const data = await response.json();
    const newMappedEntities = Object.keys(data).flatMap((type) =>
      data[type].map((entity: any) => ({
        type,
        uid: `${type}_${entity.id}`,
        ...entity,
      }))
    );
    return newMappedEntities;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getHealthChecks = async () => {
  try {
    const response = await fetch(API_URL + "/health");
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

export const getInfo = async () => {
  try {
    const response = await fetch(API_URL + "/info");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getMetrics = async () => {
  try {
    const response = await fetch(API_URL + "/metrics");
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

export const getValues = async () => {
  try {
    const response = await fetch(API_URL2 + "/values");
    const data = await response.json();
    return data;
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
