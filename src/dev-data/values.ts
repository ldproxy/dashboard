import { InputValue } from "@/lib/values";

export const fromDev = (): InputValue[] => {
  return [
    {
      path: "foo",
      status: "HEALTHY",
      type: "codelists",
    },
    {
      id: "bar",
      status: "ACTIVE",
      type: "tile-matrix-sets",
    },
  ];
};
