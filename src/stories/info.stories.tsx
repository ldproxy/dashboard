import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import CustomersPage, {
  SummaryProps,
} from "../../src/components/dashboard/info";
import {
  GlobeIcon,
  ClockIcon,
  UploadIcon,
  DesktopIcon,
} from "@radix-ui/react-icons";
import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/InfoBox",
  component: CustomersPage,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <CustomersPage {...args} />
  </StoryWrapper>
);

export const Single = Template.bind({});
Single.args = {
  name: "foo (ldproxy 3000)",
  infoUrl: "http://localhost:3000",
  versions: [{ version: "1.0.0", apiUrl: "http://localhost:3000/api" }],
  uptimes: [{ uptime: 123456789, apiUrl: "http://localhost:3000/api" }],
  memories: [
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
  ],
  health: "HEALTHY",
  IconFooter1: ClockIcon,
  IconFooter2: UploadIcon,
  IconFooter3: DesktopIcon,
  className: "hover:bg-gray-100 transition-colors duration-200",
};

export const Multi2 = Template.bind({});
Multi2.args = {
  name: "foo (ldproxy 3000)",
  versions: [
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
    { version: "10.1.0", apiUrl: "http://localhost:7081/api" },
  ],
  uptimes: [
    { uptime: 123456789, apiUrl: "http://localhost:3000/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
  ],
  memories: [
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
  ],
  health: "UNHEALTHY",
  infoUrl: "http://localhost:3000",
  className: "hover:bg-gray-100 transition-colors duration-200",
};

export const Multi3 = Template.bind({});
Multi3.args = {
  name: "foo (ldproxy 3000)",
  infoUrl: "http://localhost:3000",
  versions: [
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
    { version: "10.1.0", apiUrl: "http://localhost:7081/api" },
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
  ],
  uptimes: [
    { uptime: 123456789, apiUrl: "http://localhost:3000/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
  ],
  memories: [
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
  ],
  health: "UNHEALTHY",
  className: "hover:bg-gray-100 transition-colors duration-200",
};

export const Multi4 = Template.bind({});
Multi4.args = {
  name: "foo (ldproxy 3000)",
  infoUrl: "http://localhost:3000",
  versions: [
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
    { version: "10.1.0", apiUrl: "http://localhost:7081/api" },
    { version: "1.0.0", apiUrl: "http://localhost:3000/api" },
    { version: "10.1.0", apiUrl: "http://localhost:7081/api" },
  ],
  uptimes: [
    { uptime: 123456789, apiUrl: "http://localhost:3000/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
    { uptime: 123456789, apiUrl: "http://localhost:3000/api" },
    { uptime: 987654321, apiUrl: "http://localhost:7081/api" },
  ],
  memories: [
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
    { memory: 1024 * 1024 * 512, apiUrl: "http://localhost:3000/api" },
    { memory: 1024 * 1024 * 1024, apiUrl: "http://localhost:7081/api" },
  ],
  health: "UNHEALTHY",
  className: "hover:bg-gray-100 transition-colors duration-200",
};
