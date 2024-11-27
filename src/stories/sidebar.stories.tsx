import React from "react";
import { Meta, Story } from "@storybook/react";
import { Sidebar, SidebarProps } from "../../src/components/dashboard/sidebar";
import { PlayIcon, IdCardIcon, CodeIcon } from "@radix-ui/react-icons";

export default {
  title: "Components/Sidebar",
  component: Sidebar,
} as Meta;

const Template: Story<SidebarProps> = (args) => <Sidebar {...args} />;

export const Default = Template.bind({});
Default.args = {
  sections: [
    {
      title: "ldproxy 3000",
      entries: [
        { title: "Deployment", icon: "Play", route: "/deployment?did=3" },
        { title: "Entities", icon: "Id", route: "/entities?did=3" },
        { title: "Values", icon: "Code", route: "/values?did=3" },
      ],
    },
  ],
};
