"use client";

import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import InfoCfg from "../components/dashboard/infoCfg";
import { SummaryProps } from "@/components/dashboard/infoCfg";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";
import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/InfoCfg",
  component: InfoCfg,
} as Meta;

const Template: StoryFn<SummaryProps> = (args) => (
  <StoryWrapper>
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <InfoCfg {...args} />
    </Dialog>
  </StoryWrapper>
);

export const ConfigurationDialog = Template.bind({});
ConfigurationDialog.args = {
  name: "Test Configuration",
  cfgUrl: "http://example.com",
  setConfigurations: () => {
    console.log("Configurations updated");
  },
};
