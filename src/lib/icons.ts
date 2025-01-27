import {
  PlayIcon,
  DashboardIcon,
  CodeIcon,
  IdCardIcon,
  ListBulletIcon,
  UploadIcon,
  ClockIcon,
  DesktopIcon,
  HomeIcon,
  InfoCircledIcon,
  CheckCircledIcon,
  QuestionMarkCircledIcon,
  ReaderIcon,
  TrashIcon,
  Pencil1Icon,
  ExternalLinkIcon,
  CrossCircledIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { Cross } from "lucide-react";

export const icons = {
  Play: "Play",
  Id: "Id",
  Code: "Code",
  ListBullet: "ListBullet",
  Upload: "Upload",
  Clock: "Clock",
  Desktop: "Desktop",
  Home: "Home",
  InfoCircled: "InfoCircled",
  CheckCircled: "CheckCircled",
  QuestionMark: "QuestionMark",
  Reader: "Reader",
  Trash: "Trash",
  Pencil1: "Pencil1",
  ExternalLink: "ExternalLink",
  Cross: "Cross",
};

export const getIcon = (
  icon: string
): React.FunctionComponent<IconProps> | undefined => {
  switch (icon) {
    case icons.Play:
      return PlayIcon;
    case icons.Id:
      return IdCardIcon;
    case icons.Code:
      return CodeIcon;
    case icons.ListBullet:
      return ListBulletIcon;
    case icons.Upload:
      return UploadIcon;
    case icons.Clock:
      return ClockIcon;
    case icons.Desktop:
      return DesktopIcon;
    case icons.Home:
      return HomeIcon;
    case icons.InfoCircled:
      return InfoCircledIcon;
    case icons.CheckCircled:
      return CheckCircledIcon;
    case icons.QuestionMark:
      return QuestionMarkCircledIcon;
    case icons.Reader:
      return ReaderIcon;
    case icons.Trash:
      return TrashIcon;
    case icons.Pencil1:
      return Pencil1Icon;
    case icons.ExternalLink:
      return ExternalLinkIcon;
    case icons.Cross:
      return CrossCircledIcon;
    default:
      return undefined;
  }
};
