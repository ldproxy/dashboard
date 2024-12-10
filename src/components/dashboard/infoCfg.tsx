import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import Link from "next/link";
import { getIcon } from "@/lib/icons";
import { IconProps } from "@radix-ui/react-icons/dist/types";
import { deleteConfig, getCfgs, updateCfg } from "../../lib/utils";
import { Dialog, DialogTrigger } from "@/components/shadcn-ui/dialog";
import { EditAndDeletePopUpDialog } from "./EditAndDeletePopUp";
import { ExternalLink } from "lucide-react";

export interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  cfgUrl?: string;
  title?: string;
  setConfigurations: any;
}

export default function InfoCfg({
  cfgUrl,
  title,
  name,
  setConfigurations,
}: SummaryProps) {
  const [popUp, setPopUp] = useState<boolean>(false);
  const [popUpEdit, setPopUpEdit] = useState<boolean>(false);

  const currentUrl = window.location.href;
  const url = new URL(currentUrl);
  const params = new URLSearchParams(url.search);

  const hasIdParam = params.has("id");

  if (!hasIdParam) {
    params.append("id", name);
  } else {
    params.append("cfg", name);
  }

  // Entfernen doppelter Parameter
  const uniqueParams = new URLSearchParams();
  params.forEach((value, key) => {
    if (!uniqueParams.has(key)) {
      uniqueParams.append(key, value);
    }
  });

  let newPathname = url.pathname;
  if (!newPathname.includes("/details")) {
    newPathname += "/details";
  } else {
    newPathname += "/cfg";
  }

  const route = `${url.origin}${newPathname}?${uniqueParams.toString()}`;
  const Icon: React.FunctionComponent<IconProps> =
    getIcon("Trash") || (() => <span />);

  const IconPencil: React.FunctionComponent<IconProps> =
    getIcon("Pencil1") || (() => <span />);

  const IconLink: React.FunctionComponent<IconProps> =
    getIcon("ExternalLink") || (() => <span />);

  const deleteCfg = async () => {
    try {
      await deleteConfig(name);
      const cfgData = await getCfgs();
      setConfigurations(cfgData);
      setPopUp(false);
      return { success: true };
    } catch (error) {
      console.error("Fehler beim Löschen der Konfiguration", error);
      return { success: false };
    }
  };

  const handleEdit = async (data: any): Promise<{ success: boolean }> => {
    if (cfgUrl) {
      try {
        await updateCfg(name, data.name, cfgUrl, data.url);
        const cfgData = await getCfgs();
        setConfigurations(cfgData);
        setPopUp(false);
        return { success: true };
      } catch (error) {
        console.error("Fehler beim Editieren der Konfiguration", error);
        return { success: false };
      }
    }
    return { success: false };
  };

  return (
    <div className={`relative shadow-lg`}>
      <Link href={route}>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-semibold text-blue-700 flex items-center">
              {cfgUrl ? (
                <Link
                  href={cfgUrl}
                  target="_blank"
                  className="flex items-center relative group"
                  onClick={(e) => e.stopPropagation()}
                >
                  {cfgUrl}
                  <ExternalLink className="ml-2 h-4 w-4 text-blue-500 cursor-pointer" />
                  <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    {cfgUrl}
                  </span>
                </Link>
              ) : (
                title
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center items-center">
            <div
              className="text-2xl font-bold break-normal"
              style={{
                marginBottom: "3px",
                width: "100%",
              }}
            >
              {name}
            </div>
          </CardContent>
        </Card>
      </Link>
      {cfgUrl && (
        <>
          <Dialog open={popUpEdit} onOpenChange={(open) => setPopUpEdit(open)}>
            <DialogTrigger asChild>
              <IconPencil className="absolute right-40 top-1/2 transform -translate-y-1/2 h-8 w-8 text-blue-500 cursor-pointer" />
            </DialogTrigger>
            <EditAndDeletePopUpDialog
              handleEdit={handleEdit}
              name={name}
              cfgUrl={cfgUrl}
            />
          </Dialog>
          <Dialog open={popUp} onOpenChange={(open) => setPopUp(open)}>
            <DialogTrigger asChild>
              <Icon className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 text-red-500 cursor-pointer mr-20" />
            </DialogTrigger>
            <EditAndDeletePopUpDialog
              onSubmit={deleteCfg}
              setPopUp={setPopUp}
            />
          </Dialog>
        </>
      )}
    </div>
  );
}
