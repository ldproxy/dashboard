import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import CustomersPage, { SummaryProps } from "../components/dashboard/InfoBox";
import { getIcon } from "@/lib/icons";

import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/HomeInfoBox",
  component: CustomersPage,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <CustomersPage {...args} />
  </StoryWrapper>
);

export const Healthy = Template.bind({});
Healthy.args = {
  name: "ldproxy 3000",
  url: "http://localhost:3000/",
  totalNodes: 3,
  availableNodes: 3,
  HealthyNodes: 3,
  healthStatus: "HEALTHY",
  IconFooter1: getIcon("InfoCircled"),
  IconFooter2: getIcon("CheckCircled"),
  IconFooter3: getIcon("QuestionMark"),
  className: "hover:bg-gray-100 transition-colors duration-200",
};
