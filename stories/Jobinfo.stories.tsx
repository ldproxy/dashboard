import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import JobInfo, { SummaryProps } from "../src/components/dashboard/Jobinfo";
import StoryWrapper from "./StoryWrapper";
import { jobSets } from "../src/dev-data/jobs";

export default {
  title: "Components/JobInfo",
  component: JobInfo,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <JobInfo {...args} />
  </StoryWrapper>
);

const exampleJob = jobSets.sets[0];
const exampleUrl = "localhost:7080";

export const Default = Template.bind({});
Default.args = {
  entity: exampleJob.context.entity,
  tilesets: exampleJob.progress.details,
  label: exampleJob.label,
  percent: exampleJob.progress.percent,
  status: exampleJob.status,
  startedAt: exampleJob.startedAt,
  updatedAt: exampleJob.updatedAt,
  id: exampleJob.id,
  info: "Processing tiles",
  url: exampleUrl,
};

export const Ready = Template.bind({});
Ready.args = {
  entity: exampleJob.context.entity,
  tilesets: exampleJob.progress.details,
  label: exampleJob.label,
  percent: 100,
  status: "SUCCESSFUL",
  startedAt: exampleJob.startedAt,
  updatedAt: exampleJob.updatedAt,
  id: exampleJob.id,
  info: "Processing tiles",
  url: exampleUrl,
};
