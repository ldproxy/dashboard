import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import CustomersPage, { SummaryProps } from "../components/dashboard/Jobinfo";
import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/JobInfo",
  component: CustomersPage,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <CustomersPage {...args} />
  </StoryWrapper>
);
export const Default = Template.bind({});
Default.args = {
  entity: "verwaltungseinheit",
  tilesets: {
    WebMercatorQuad: {
      progress: {
        percent: 77,
        levels: {
          0: [5],
          1: [5],
          2: [4],
          3: [5],
          4: [4],
          5: [45],
          6: [100],
          7: [77],
          8: [8],
          9: [9],
          10: [10],
          11: [11],
          12: [12],
          13: [14],
          14: [14],
          15: [15],
          16: [16],
          17: [17],
          18: [18],
          19: [19],
          20: [20],
          21: [21],
          22: [22],
          23: [23],
        },
      },
    },
  },
  label: "Example Job",
  percent: 77,
  startedAt: 1620000000,
  updatedAt: 1620001000,
  id: "job-1",
  info: "Processing tiles",
};

export const Ready = Template.bind({});
Ready.args = {
  entity: "verwaltungseinheit",
  tilesets: {
    WebMercatorQuad: {
      progress: {
        percent: 100,
      },
    },
  },
  label: "Example Job",
  percent: 100,
  startedAt: 1620000000,
  updatedAt: 1620001000,
  id: "job-1",
  info: "Processing tiles",
};
