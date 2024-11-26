import React from "react";
import { Meta, Story } from "@storybook/react";
import CustomersPage, {
  SummaryProps,
} from "../../src/components/dashboard/summary";
import { IdCardIcon } from "@radix-ui/react-icons";

export default {
  title: "Components/Summary",
  component: CustomersPage,
} as Meta;

const Template: Story<SummaryProps> = (args) => (
  <div style={{ width: "300px", margin: "0 auto" }}>
    <CustomersPage {...args} />
  </div>
);

export const AVAILABLE = Template.bind({});
AVAILABLE.args = {
  header: "AVAILABLE",
  main: "testi",
  footer: "OGC_API",
  route: "/entities/details?did=3&id=services_testi",
  total: undefined,
  Icon: undefined,
};

export const Unknown = Template.bind({});
Unknown.args = {
  header: "UNKNOWN",
  main: "testi",
  footer: "/WFS",
  route: "/entities/details?did=3&id=services_testi",
  total: undefined,
  Icon: undefined,
};

export const Overview = Template.bind({});
Overview.args = {
  total: "2",
  main: "Features",
  route: "/entities/details?did=3&id=services_testi",
  Icon: IdCardIcon,
};
