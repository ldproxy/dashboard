"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/shadcn-ui/dialog";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/shadcn-ui/form";
import { Input } from "@/components/shadcn-ui/input";
import React, { useEffect, useState } from "react";
import { Separator } from "@radix-ui/react-separator";
import { Button } from "@/components/shadcn-ui/button";
import { getCfgs } from "./utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/shadcn-ui/select";
import { DevDeployment } from "@/data/constants";

interface Configuration {
  name: string;
  url: string;
}

export interface PopUpDialogProps {
  onSubmit: (data: any) => Promise<{ success: boolean }>;
}

const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name muss min. 1 Zeichen lang sein.",
    })
    .max(30, {
      message: "Username darf max. 30 Zeichen lang sein.",
    })
    .refine((value) => !/[äöüÄÖÜ]/.test(value), {
      message: "Username darf keine Umlaute enthalten.",
    }),
  id: z.string().refine((value) => /^\d+$/.test(value), {
    message: "Id muss eine Zahl sein.",
  }),
  url: z.string().refine((value) => /^[a-zA-Z0-9:.]+$/.test(value), {
    message:
      "URL darf nur aus Buchstaben, Zahlen, Doppelpunkten und Punkten bestehen.",
  }),
  cfg: z.string({
    required_error: "Bitte wählen sie eine Konfiguration.",
  }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const PopUpDialog: React.FC<PopUpDialogProps> = ({ onSubmit }) => {
  const [submitResult, setSubmitResult] = useState<{ success: boolean } | null>(
    null
  );
  const [configurations, setConfigurations] = useState<Configuration[]>([]);

  useEffect(() => {
    getCfgs().then((data: any) => {
      setConfigurations(data);
      if (DevDeployment) {
        console.log("configurations", data);
      }
    });
  }, []);

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      id: "",
      url: "",
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const result = await onSubmit(data);
      if (result) {
        setSubmitResult(result);
        form.reset();
      }
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars", error);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <div style={{ marginBottom: "15px" }}>
          <DialogTitle>Deployment hinzufügen</DialogTitle>
        </div>
        <Separator />
      </DialogHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-8"
          style={{ marginBottom: "25px" }}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input placeholder="ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="url"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Url</FormLabel>
                <FormControl>
                  <Input placeholder="Url" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cfg"
            render={({ field }) => (
              <FormItem>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Konfiguration wählen..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {configurations.map((cfg, cfgIndex) => (
                      <SelectItem key={`${cfgIndex}`} value={cfg.name}>
                        {cfg.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            style={{ fontWeight: "bold" }}
            type="submit"
            disabled={!form.formState.isValid ? true : false}
          >
            Create
          </Button>
        </form>
      </Form>
      {submitResult && !submitResult.success ? (
        <div style={{ color: "red" }}>Ein Fehler ist aufgetreten.</div>
      ) : submitResult && submitResult.success ? (
        <div style={{ color: "green" }}>
          Deployment wurde erfolgreich hinzugefügt.
        </div>
      ) : (
        ""
      )}
    </DialogContent>
  );
};
