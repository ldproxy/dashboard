"use client";
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Entity, InputEntity } from "@/data/entities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

import { useState, useEffect } from "react";

const GetEntities = () => {
  const [myEntities, setMyEntities] = useState<{
    [key: string]: InputEntity[];
  }>({});
  const [mappedEntities, setMappedEntities] = useState<Entity[]>([]);

  useEffect(() => {
    fetch("http://localhost:3000/api/api")
      .then((response) => response.json())
      .then((data) => {
        setMyEntities(data);
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

export default GetEntities;
