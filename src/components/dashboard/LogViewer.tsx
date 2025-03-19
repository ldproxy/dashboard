import React, { useEffect, useRef, useState } from "react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { initialLog } from "@/dev-data/log";

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC = () => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [logs, setLogs] = useState<string[]>(initialLog);

  useEffect(() => {
    const eventSource = new EventSource("/api/log");

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  return (
    <div
      style={{
        position: "relative",
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: "10px",
        borderRadius: "8px",
        height: "100%",
        width: "100%",
        overflowY: "auto",
        fontFamily: "monospace",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: "10px",
          bottom: "10px",
          right: "10px",
          marginRight: "15px",
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <button
          onClick={toggleAutoScroll}
          style={{
            backgroundColor: autoScroll ? "#fff" : "#444",
            border: "none",
            color: autoScroll ? "#000" : "#d4d4d4",
            cursor: "pointer",
            padding: "5px",
            borderRadius: "4px",
          }}
          title={autoScroll ? "Disable auto-scroll" : "Enable auto-scroll"}
        >
          <DoubleArrowDownIcon />
        </button>
      </div>
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      <div ref={logEndRef} />
      <div style={{ height: "20px" }} />
    </div>
  );
};

export default LogViewer;
