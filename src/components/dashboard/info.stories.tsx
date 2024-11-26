import React from "react";
import { Meta, Story } from "@storybook/react";
import CustomersPage, { SummaryProps } from "./info";
import { GlobeIcon } from "@radix-ui/react-icons";

export default {
  title: "Components/InfoBox",
  component: CustomersPage,
} as Meta;

const Template: Story<SummaryProps> = (args) => <CustomersPage {...args} />;

export const Default = Template.bind({});
Default.args = {
  name: "Example Deployment",
  versions: [
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
    { version: "1.1.0", apiUrl: "http://localhost:7081/api" },
  ],
  uptimes: [
    { uptime: 123456789, apiUrl: "http://localhost:3000/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
  ],
  memories: [
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
  ],
  health: "HEALTHY",
  Icon: GlobeIcon,
  IconFooter1: GlobeIcon,
  IconFooter2: GlobeIcon,
  IconFooter3: GlobeIcon,
  className: "",
};
