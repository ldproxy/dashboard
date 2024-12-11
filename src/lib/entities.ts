import { Entity, fromDev } from "@/dev-data/entities";
import { getApiUrl } from "./utils";

export const fetchedEntities =
  process.env.DEPLOYMENTS || process.env.NODE_ENV !== "development"
    ? {}
    : fromDev();

export type CategoryHealthCounts = {
  [key: string]: HealthCounts;
};

export type HealthCounts = {
  available: number;
  limited: number;
  unavailable: number;
};

export const getEntityCategory = (entity: Entity) => {
  return entity.type === "services" ? "API" : entity.subType.split(/[/]/)[0];
};

export const asLabel = (entityCategory: string) => {
  const formattedCategory =
    entityCategory[0].toUpperCase() + entityCategory.substring(1);
  return entityCategory === "API" ? formattedCategory + "s" : formattedCategory;
};

export const getEntityCounts = (entities: Entity[]): HealthCounts =>
  entities.reduce(
    (counts, entity) => {
      const entityType = getEntityCategory(entity);
      if (!counts) {
        counts = { available: 0, limited: 0, unavailable: 0 };
      }
      if (entity.status === "AVAILABLE") {
        counts.available++;
      } else if (entity.status === "LIMITED") {
        counts.limited++;
      } else if (entity.status === "UNAVAILABLE") {
        counts.unavailable++;
      }
      return counts;
    },
    { available: 0, limited: 0, unavailable: 0 }
  );

export const getEntityCategoryCounts = (
  entities: Entity[],
  categories: string[]
): CategoryHealthCounts =>
  categories.reduce((counts, category) => {
    counts[category] = getEntityCounts(
      entities.filter((entity) => getEntityCategory(entity) === category)
    );
    return counts;
  }, {} as CategoryHealthCounts);

export const getStateSummary = (counts: HealthCounts) => {
  if (!counts || !counts) {
    return "No entities found";
  }
  let summary = "";

  if (counts.available) {
    summary += `${counts.available} available`;
  }
  if (counts.limited) {
    if (summary.length > 0) summary += " ";
    summary += `${counts.limited} limited`;
  }
  if (counts.unavailable) {
    if (summary.length > 0) summary += " ";
    summary += `${counts.unavailable} unavailable`;
  }

  return summary;
};

export const getEntities = async (API_URL?: string) => {
  const apiUrls = [API_URL];
  let apiUrl = apiUrls[0];
  if (!apiUrl) {
    const apiUrls = await getApiUrl();
    apiUrl = apiUrls[0];
  }

  const response = await fetch(`/api/fetchEntities?apiUrl=${apiUrl}`);
  if (!response.ok) {
    throw new Error("Failed to fetch Entities");
  }
  const data = await response.json();

  return data;
};
