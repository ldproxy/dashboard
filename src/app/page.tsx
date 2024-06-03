"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/shadcn-ui/button";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function ValuesPage() {
  const router = useRouter();
  const multipleDeployments = process.env.NEXT_PUBLIC_MULTIPLE_DEPLOYMENTS;

  useEffect(() => {
    if (multipleDeployments === "false") {
      router.push("/deployment");
    } else if (multipleDeployments === "true") {
      router.push("/home");
    }
  }, [router, multipleDeployments]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2"></div>
    </div>
  );
}
