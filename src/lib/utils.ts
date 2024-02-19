"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Entity, InputEntity } from "@/data/entities";
import { Check, InputCheck } from "@/data/health";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useState, useEffect } from "react";

export const GetEntities = () => {
  const [mappedEntities, setMappedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/api?type=entities")
      .then((response) => response.json())
      .then((data) => {
        const newMappedEntities = Object.keys(data).flatMap((type) =>
          data[type].map((entity: any) => ({
            type,
            uid: `${type}_${entity.id}`,
            ...entity,
          }))
        );
        setMappedEntities(newMappedEntities);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return mappedEntities;
};

export const GetHealthChecks = () => {
  const [mappedhealthChecks, setMappedHealthChecks] = useState<Check[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/api?type=healthchecks")
      .then((response) => response.json())
      .then((data) => {
        const newMappedHealthChecks = Object.keys(data).map((name) => ({
          name,
          ...data[name],
        }));
        setMappedHealthChecks(newMappedHealthChecks);
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return mappedhealthChecks;
};
