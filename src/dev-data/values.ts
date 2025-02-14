import { MultiResponse, SingleResponse } from "@/app/api/util";
import { InputValues } from "@/lib/values";

const values = {
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

export const fromDev = (
  wrap: boolean,
  apiUrls?: string[]
): InputValues | SingleResponse<InputValues> | MultiResponse<InputValues> => {
  if (wrap && apiUrls) {
    return apiUrls.map((url) => ({
      url,
      response: values,
    }));
  }

  return values;
};
