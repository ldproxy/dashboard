import React, { useEffect, useRef, useState } from "react";
import { DoubleArrowDownIcon } from "@radix-ui/react-icons";
import { initialLog } from "@/dev-data/log";
import { ClipLoader } from "react-spinners";

interface LogViewerProps {
  logLevel: string;
}

const LogViewer: React.FC<LogViewerProps> = ({ logLevel }) => {
  const logEndRef = useRef<HTMLDivElement>(null);
  const [autoScroll, setAutoScroll] = useState(true);
  const [logs, setLogs] = useState<string[]>(initialLog);
  const [isConnected, setIsConnected] = useState(true);
  const eventSourceRef = useRef<EventSource | null>(null);
  console.log("First Log level: ", logLevel);
  useEffect(() => {
    const initializeLogs = async () => {
      await changeLogLevel();
      await getLogs();
    };

    initializeLogs();

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logLevel]);

  useEffect(() => {
    if (autoScroll && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs, autoScroll]);

  const getLogs = async () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
    }

    const eventSource = new EventSource(`/api/log?logLevel=${logLevel}`);
    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      setIsConnected(true);
    };

    eventSource.onmessage = (event) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    };

    eventSource.addEventListener("log", (event: MessageEvent) => {
      setLogs((prevLogs) => [...prevLogs, event.data]);
    });

    eventSource.onerror = (error) => {
      console.error("EventSource failed:", error);
      eventSource.close();
      setIsConnected(false);
    };
  };

  const toggleAutoScroll = () => {
    setAutoScroll(!autoScroll);
  };

  const changeLogLevel = async () => {
    try {
      const response = await fetch(`/api/log?logLevel=${logLevel}`, {
        method: "GET",
        headers: {
          Accept: "text/event-stream",
        },
      });

      if (!response.ok) {
        alert("Failed to set log level and filters");
      }
    } catch (error) {
      alert(
        "Network error: Unable to set log level. Please check your connection."
      );
    }
  };

  return (
    <>
      <div
        style={{
          position: "relative",
          backgroundColor: "#1e1e1e",
          color: "#d4d4d4",
          paddingLeft: "10px",
          paddingRight: "10px",
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
        <div style={{ height: "25px" }}>
          {isConnected && (
            <div style={{ paddingTop: "10px" }}>
              <ClipLoader color={"#d4d4d4"} loading={true} size={15} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default LogViewer;
