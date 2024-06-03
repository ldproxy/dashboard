"use client";

import { useEffect, useState } from "react";
import { getDeployments } from "../../lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { getIcon } from "@/lib/icons";
import Link from "next/link";

export default function HomePage() {
  const [deployments, setDeployments] = useState([]);
  const IconComponent = getIcon("Home");

  useEffect(() => {
    getDeployments().then((data: any) => setDeployments(data));
  }, []);

  return (
    <div className="flex-1 space-y-4 p-8 pt-0">
      <div className="justify-between space-y-2">
        <h2
          className="text-2xl font-semibold tracking-tight"
          style={{ marginBottom: "50px" }}
        >
          Deployments
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {deployments.map((deployment: any, index: number) => (
            //               <Link key={index} href={"http://localhost:3001/deployment"}>
            <Link key={index} href={deployment.url || "#"}>
              <Card
                key={index}
                className="shadow-lg hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
              >
                <CardContent>
                  <CardHeader>
                    <CardTitle
                      style={{
                        marginTop: "20px",
                        fontSize: "1.5em",
                      }}
                    >
                      <div className="flex items-center text-blue-600">
                        {IconComponent ? (
                          <IconComponent className="h-6 w-6 text-blue-600 mr-2" />
                        ) : null}

                        <span className="ml-2" style={{ fontSize: "1.0em" }}>
                          {deployment.name}
                        </span>
                      </div>
                    </CardTitle>
                  </CardHeader>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
