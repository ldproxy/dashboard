import { columns } from "../src/components/dashboard/DataTableComponents/DataTableColumns";
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import {
  DataTable,
  DataTableProps,
} from "../src/components/dashboard/DataTableComponents/DataTable";
import StoryWrapper from "./StoryWrapper";
import { HealthCheck } from "../src/components/dashboard/DataTableComponents/DataTableColumns";

export default {
  title: "Components/DataTable",
  component: DataTable,
} as Meta;

const Template: StoryFn<DataTableProps<HealthCheck, unknown>> = (args) => (
  <StoryWrapper>
    <div>
      <DataTable {...args} columns={columns} />
    </div>
  </StoryWrapper>
);

export const BaseHealth = Template.bind({});
BaseHealth.args = {
  data: [
    {
      label: "crs",
      url: "localhost:7081",
      state: "AVAILABLE",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [
        {
          label: "subRow1",
          url: "localhost:3000",
          state: "UNAVAILABLE",
          status: "UNAVAILABLE",
          checked: "17:56:36",
          message: "",
          subRows: [],
        },
        {
          label: "subRow2",
          url: "localhost:7081",
          state: "AVAILABLE",
          status: "AVAILABLE",
          checked: "10:36:54",
          message: "",
          subRows: [],
        },
        {
          label: "subRow3",
          url: "localhost:3000",
          state: "AVAILABLE",
          status: "AVAILABLE",
          checked: "17:56:36",
          message: "",
          subRows: [],
        },
      ],
    },
    {
      label: "store/resources",
      url: "localhost:7081",
      state: "AVAILABLE",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "store/values",
      url: "localhost:7081",
      state: "AVAILABLE",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "styles",
      url: "localhost:7081",
      state: "AVAILABLE",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "tilematrixsets",
      url: "localhost:7081",
      state: "AVAILABLE",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
  ],
};
