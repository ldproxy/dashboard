import { IconProps } from "@radix-ui/react-icons/dist/types";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/shadcn-ui/card";
import { FooterSummary } from "./FooterSummary";

interface SummaryProps extends React.HTMLAttributes<HTMLDivElement> {
  header?: string;
  main: string | React.ReactElement;
  total?: number;
  footer?: string;
  route?: string;
  Icon?: React.FunctionComponent<IconProps>;
}

export default function CustomersPage({
  header,
  main,
  footer,
  route,
  total,
  Icon,
  ...props
}: SummaryProps) {
  const color =
    header === "AVAILABLE" || header === "ACTIVE" || header === "true"
      ? "text-success"
      : header === "LIMITED"
      ? "text-warning"
      : header === "UNAVAILABLE" || header === "false"
      ? "text-destructive"
      : "text-blue-700";

  return (
    <Link href={route || "#"}>
      <Card
        className="shadow-lg hover:bg-gray-100 transition-colors duration-200"
        {...props}
      >
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
          <CardTitle
            className={`text-sm font-semibold ${color}${
              !header ? "text-2xl font-bold mb-1" : ""
            }`}
          >
            {header ? (
              header
            ) : (
              <span className="text-2xl font-bold mb-1">{total}</span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className="text-2xl font-bold"
            style={{
              display: "flex",
              flexDirection: "row",
              marginBottom: "5px",
              alignItems: "center",
              justifyContent: "flex-start",
              gap: "10px",
            }}
          >
            {Icon ? <Icon className="h-6 w-6 text-muted-foreground" /> : null}
            <span
              style={{
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
              title={typeof main === "string" ? main : ""}
            >
              {main}
            </span>
          </div>
          <div style={{ display: "flex", flexWrap: "wrap" }}>
            <p
              className="text-xs text-muted-foreground"
              style={{ display: "flex", flexDirection: "row" }}
            >
              {footer ? <FooterSummary footer={footer} /> : null}
            </p>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
