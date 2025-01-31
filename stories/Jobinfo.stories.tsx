import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import JobInfo, { SummaryProps } from "../src/components/dashboard/Jobinfo";
import StoryWrapper from "./StoryWrapper";
import { fromDev } from "../src/dev-data/jobs";

export default {
  title: "Components/JobInfo",
  component: JobInfo,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <JobInfo {...args} />
  </StoryWrapper>
);

// Extrahieren der Daten aus fromDev
const devData = fromDev();
const exampleJob = devData[0].response.sets[0];

export const Default = Template.bind({});
Default.args = {
  entity: exampleJob.entity,
  tilesets: exampleJob.details.tileSets,
  label: exampleJob.label,
  percent: exampleJob.percent,
  startedAt: exampleJob.startedAt,
  updatedAt: exampleJob.updatedAt,
  id: exampleJob.id,
  info: "Processing tiles",
  url: devData[0].url,
};

export const Ready = Template.bind({});
Ready.args = {
  entity: exampleJob.entity,
  tilesets: exampleJob.details.tileSets,
  label: exampleJob.label,
  percent: 100,
  startedAt: exampleJob.startedAt,
  updatedAt: exampleJob.updatedAt,
  id: exampleJob.id,
  info: "Processing tiles",
  url: devData[0].url,
};
