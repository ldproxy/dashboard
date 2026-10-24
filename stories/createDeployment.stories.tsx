"use client";

import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import {
  PopUpDialog,
  PopUpDialogProps,
} from "../src/components/dashboard/CreateDeploymentPopUp";
import { Dialog, DialogTrigger } from "../src/components/shadcn-ui/dialog";
import { Button } from "../src/components/shadcn-ui/button";
import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/PopUpDialog",
  component: PopUpDialog,
} as Meta;

const Template: StoryFn<PopUpDialogProps> = (args) => (
  <StoryWrapper>
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <PopUpDialog {...args} />
    </Dialog>
  </StoryWrapper>
);

export const CreateDeploymentDialog = Template.bind({});
CreateDeploymentDialog.args = {
  onSubmit: async (data: any) => {
    console.log("Placeholder function called with data:", data);
    return { success: true };
  },
};
