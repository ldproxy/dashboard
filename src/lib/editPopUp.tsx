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
import { updateCfg } from "./utils";

interface PopUpDialogProps {
  name: string;
  title: string;
  handleEdit: (data: any) => Promise<{ success: boolean }>;
}

const profileFormSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: "Name muss min. 1 Zeichen lang sein.",
    })
    .max(30, {
      message: "Name darf max. 30 Zeichen lang sein.",
    })
    .refine((value) => !/[äöüÄÖÜ]/.test(value), {
      message: "Name darf keine Umlaute enthalten.",
    }),
  title: z
    .string()
    .min(1, {
      message: "Url muss min. 1 Zeichen lang sein.",
    })
    .max(50, {
      message: "Url darf max. 30 Zeichen lang sein.",
    })
    .refine((value) => !/[äöüÄÖÜ]/.test(value), {
      message: "Url darf keine Umlaute enthalten.",
    }),
});

export type ProfileFormValues = z.infer<typeof profileFormSchema>;

export const EditPopUpDialog: React.FC<PopUpDialogProps> = ({
  handleEdit,
  name,
  title,
}) => {
  const [submitResult, setSubmitResult] = useState<{ success: boolean } | null>(
    null
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    mode: "onChange",
    defaultValues: {
      name: name,
      title: title,
    },
  });

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      const result = await handleEdit(data);
      if (result) {
        setSubmitResult(result);
        form.reset();
      }
    } catch (error) {
      console.error("Fehler beim Absenden des Formulars", error);
    }
  };

  useEffect(() => {
    form.reset({
      name: name,
      title: title,
    });
  }, [name, title, form]);

  return (
    <DialogContent>
      <DialogHeader>
        <div style={{ marginBottom: "15px" }}>
          <DialogTitle>Konfiguration umbennen</DialogTitle>
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
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>URL</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            style={{ fontWeight: "bold" }}
            type="submit"
            disabled={!form.formState.isValid ? true : false}
          >
            Change
          </Button>
        </form>
      </Form>
      {submitResult && !submitResult.success ? (
        <div style={{ color: "red" }}>Ein Fehler ist aufgetreten.</div>
      ) : submitResult && submitResult.success ? (
        <div style={{ color: "green" }}>
          Konfiguration wurde erfolgreich umbenannt.
        </div>
      ) : (
        ""
      )}
    </DialogContent>
  );
};
