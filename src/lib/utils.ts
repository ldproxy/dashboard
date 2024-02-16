import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { Entity, InputEntity } from "@/data/entities";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GetEntities = () => {
  let myEntities: { [key: string]: InputEntity[] } = {};

  console.log("myEntities", myEntities);

  const fetchData = () => {
    fetch("http://localhost:3000/api")
      .then((response) => response.json())
      .then((data) => (myEntities = data))
      .catch((error) => console.error("Error:", error));
  };

  // Call fetchData at the appropriate time
  fetchData();

  // TODO: fetch from api route
  const mappedEntities: Entity[] = Object.keys(myEntities).flatMap((type) =>
    myEntities[type].map((entity) => ({
      type,
      uid: `${type}_${entity.id}`,
      ...entity,
    }))
  );
  console.log("mappedEntities", mappedEntities);
  return mappedEntities;
};

export default GetEntities;
