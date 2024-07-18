import {
  CheckCircledIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
} from "@radix-ui/react-icons";
import { Badge } from "@/components/shadcn-ui/badge";

interface FooterSummaryProps {
  footer: string;
}

export const FooterSummary: React.FC<FooterSummaryProps> = ({ footer }) => {
  const type = footer.includes("/")
    ? footer.split("/")[1]
    : footer.includes("OGC_API")
    ? footer
    : null;
  console.log("footer: ", footer);
  console.log("type1: ", type);
  return (
    <>
      {footer
        ? footer.split(" ").map((word, index, words) => {
            if (word === "available" && !isNaN(Number(words[index - 1]))) {
              return [
                <span
                  key={index}
                  className="text-success mr-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                    fontSize: "20px",
                  }}
                  title={`${words[index - 1]} ${word}`}
                >
                  <CheckCircledIcon
                    className="text-success"
                    width="20px"
                    height="20px"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  {words[index - 1]}
                </span>,
              ];
            } else if (word === "limited" && !isNaN(Number(words[index - 1]))) {
              return [
                <span
                  key={index}
                  className="text-warning mr-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                    fontSize: "20px",
                  }}
                  title={`${words[index - 1]} ${word}`}
                >
                  <ExclamationTriangleIcon
                    className="text-warning"
                    width="20px"
                    height="20px"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  {words[index - 1]}
                </span>,
              ];
            } else if (
              word === "unavailable" &&
              !isNaN(Number(words[index - 1]))
            ) {
              return [
                <span
                  key={index}
                  className="text-destructive mr-2"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                    fontSize: "20px",
                  }}
                  title={`${words[index - 1]} ${word}`}
                >
                  <CrossCircledIcon
                    className="text-destructive"
                    width="20px"
                    height="20px"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "5px",
                    }}
                  />
                  {words[index - 1]}
                </span>,
              ];
            } else if (type !== null) {
              return (
                <Badge variant="secondary" key={type}>
                  {type}
                </Badge>
              );
            } else if (
              !isNaN(Number(word)) &&
              (words[index + 1] === "available" ||
                words[index + 1] === "unavailable" ||
                words[index + 1] === "limited")
            ) {
              return null;
            } else {
              return word + " ";
            }
          })
        : null}
    </>
  );
};
