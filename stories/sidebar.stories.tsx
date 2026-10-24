import React from "react";
import { Meta, StoryFn } from "@storybook/react";
import { Sidebar, SidebarProps } from "../src/components/dashboard/Sidebar";
import { PlayIcon, IdCardIcon, CodeIcon } from "@radix-ui/react-icons";
import StoryWrapper from "./StoryWrapper";
import { icons } from "../src/lib/icons";

export default {
  title: "Components/Sidebar",
  component: Sidebar,
} as Meta;

const Template: StoryFn<SidebarProps> = (args) => (
  <StoryWrapper>
    <Sidebar {...args} />
  </StoryWrapper>
);

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
      global:
        process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS === "saas"
          ? [
              {
                title: "Configurations",
                icon: icons.Reader,
                route: 1 ? `/configurations?did=1` : "/configurations",
              },
            ]
          : [],
    },
  ],
};
