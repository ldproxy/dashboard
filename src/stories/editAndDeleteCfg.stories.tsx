"use client";

import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { EditAndDeletePopUpDialog } from "../lib/editAndDeletePopUp";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { Button } from "@/components/shadcn-ui/button";
import StoryWrapper from "./StoryWrapper";

export default {
  title: "Components/EditAndDeletePopUpDialog",
  component: EditAndDeletePopUpDialog,
} as Meta;

const Template: StoryFn = (args) => (
  <StoryWrapper>
    <Dialog>
      <DialogTrigger asChild>
        <Button>Open Dialog</Button>
      </DialogTrigger>
      <EditAndDeletePopUpDialog {...args} />
    </Dialog>
  </StoryWrapper>
);

export const DeleteDialog = Template.bind({});
DeleteDialog.args = {
  onSubmit: async () => {
    console.log("Delete confirmed");
    return { success: true };
  },
  setPopUp: () => {
    console.log("PopUp closed");
  },
};

export const EditDialog = Template.bind({});
EditDialog.args = {
  handleEdit: async (data: any) => {
    console.log("Edit confirmed", data);
    return { success: true };
  },
  name: "Test Configuration",
  cfgUrl: "http://example.com",
};
