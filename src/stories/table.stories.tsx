import { columns } from "@/components/dashboard/DataTableComponents/DataTableColumns";
import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import {
  DataTable,
  DataTableProps,
} from "../../src/components/dashboard/DataTableComponents/DataTable";
import StoryWrapper from "./StoryWrapper";
import { HealthCheck } from "@/components/dashboard/DataTableComponents/DataTableColumns";

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
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "store/resources",
      url: "localhost:7081",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "store/values",
      url: "localhost:7081",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "styles",
      url: "localhost:7081",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
    {
      label: "tilematrixsets",
      url: "localhost:7081",
      status: "AVAILABLE",
      checked: "12:36:14",
      message: "",
      subRows: [],
    },
  ],
};
