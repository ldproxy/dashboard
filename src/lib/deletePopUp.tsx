"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/shadcn-ui/dialog";
import React from "react";
import { Button } from "@/components/shadcn-ui/button";

interface PopUpDialogProps {
  onSubmit: () => Promise<{ success: boolean }>;
  setPopUp: React.Dispatch<React.SetStateAction<boolean>>;
}

export const PopUpDialog: React.FC<PopUpDialogProps> = ({
  onSubmit,
  setPopUp,
}) => {
  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle style={{ margin: "20px" }}>
          Wollen Sie die Konfiguration wirklich löschen?
        </DialogTitle>
      </DialogHeader>
      <DialogFooter className="flex justify-center">
        <div className="flex justify-center w-full">
          <Button
            onClick={onSubmit}
            style={{ fontWeight: "bold", marginRight: "10px", width: "100px" }}
          >
            Ja
          </Button>
          <Button
            onClick={() => {
              setPopUp(false);
            }}
            variant="secondary"
            style={{ fontWeight: "bold", width: "100px" }}
          >
            Nein
          </Button>
        </div>
      </DialogFooter>
    </DialogContent>
  );
};
