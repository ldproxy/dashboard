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
  ReaderIcon,
  TrashIcon,
  Pencil1Icon,
  ExternalLinkIcon,
} from "@radix-ui/react-icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";

export const icons = {
  Play: "Play",
  Id: "Id",
  Code: "Code",
  ListBullet: "ListBullet",
  Upload: "Upload",
  Clock: "Clock",
  Desktop: "Desktop",
  Home: "Home",
  Reader: "Reader",
  Trash: "Trash",
  Pencil1: "Pencil1",
  ExternalLink: "ExternalLink",
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
    case icons.Reader:
      return ReaderIcon;
    case icons.Trash:
      return TrashIcon;
    case icons.Pencil1:
      return Pencil1Icon;
    case icons.ExternalLink:
      return ExternalLinkIcon;
    default:
      return undefined;
  }
};
