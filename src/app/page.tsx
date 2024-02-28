"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn-ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ValuesPage() {
  const router = useRouter();

  useEffect(() => {
    router.push("/deployment");
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2"></div>
    </div>
  );
}
