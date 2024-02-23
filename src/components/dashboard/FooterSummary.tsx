import { CheckCircledIcon, CrossCircledIcon } from "@radix-ui/react-icons";
import { Badge } from "@/components/shadcn-ui/badge";

interface FooterSummaryProps {
  footer: string;
}

export const FooterSummary: React.FC<FooterSummaryProps> = ({ footer }) => {
  const type = footer.includes("_")
    ? footer.split("_")[1]
    : footer.includes("/")
    ? footer.split("/")[1]
    : null;
  console.log("footer: ", footer);
  console.log("type1: ", type);
  return (
    <>
      {footer
        ? footer.split(" ").map((word, index, words) => {
            if (word === "active" && !isNaN(Number(words[index - 1]))) {
              return [
                <span
                  key={index}
                  className="text-green-500"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "15px",
                  }}
                >
                  <CheckCircledIcon
                    className="text-green-500"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  {words[index - 1]} {word}
                </span>,
              ];
            } else if (
              word === "defective" &&
              !isNaN(Number(words[index - 1]))
            ) {
              return [
                <span
                  key={index}
                  className="text-red-500"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <CrossCircledIcon
                    className="text-red-500"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  {words[index - 1]} {word}
                </span>,
              ];
            } else if (word === "true") {
              return [
                <span
                  key={index}
                  className="text-green-500"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  <CheckCircledIcon
                    className="text-green-500"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  Store is healthy
                </span>,
              ];
            } else if (word === "false") {
              return [
                <span
                  key={index}
                  className="text-red-500"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    marginRight: "20px",
                  }}
                >
                  <CheckCircledIcon
                    className="text-red-500"
                    key="CheckCircledIcon"
                    style={{
                      marginRight: "3px",
                    }}
                  />
                  Store is unhealthy
                </span>,
              ];
            } else if (type !== null) {
              return <Badge key={type}>{type}</Badge>;
            } else if (
              !isNaN(Number(word)) &&
              (words[index + 1] === "active" ||
                words[index + 1] === "defective")
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
