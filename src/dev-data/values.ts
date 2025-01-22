import { InputValues } from "@/lib/values";

export const fromDev = (): InputValues => {
  return {
    codelists: [
      {
        path: "foo",
        status: "HEALTHY",
        type: "codelists",
      },
    ],
    "tile-matrix-sets": [
      {
        id: "bar",
        status: "ACTIVE",
        type: "tile-matrix-sets",
      },
    ],
  };
};
