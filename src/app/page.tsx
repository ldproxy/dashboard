"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { IS_MODE_MULTI } from "@/lib/env";

export default function ValuesPage() {
  const router = useRouter();

  useEffect(() => {
    if (IS_MODE_MULTI) {
      router.push("/home");
    } else {
      router.push("/deployment");
    }
  }, [router]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="flex items-center justify-between space-y-2"></div>
    </div>
  );
}
