"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const GetEntities = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/entities");
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
    const response = await fetch("http://localhost:3000/api/health");
    const data = await response.json();
    const mappedHealthChecks = Object.keys(data).map((name) => ({
      name,
      ...data[name],
    }));
    return mappedHealthChecks;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getInfo = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/info");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getMetrics = async () => {
  try {
    const response = await fetch("http://localhost:3000/api/metrics");
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
    const response = await fetch("http://localhost:3000/api/values");
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

    const response = await fetch(
      `http://localhost:3000/api/cfg/entities/${formattedParam}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};

export const getDeploymentCfg = async () => {
  try {
    const response = await fetch(
      "http://localhost:3000/api/cfg/global/deployment"
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
