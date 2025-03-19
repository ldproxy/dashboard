import React, { useEffect, useRef } from "react";

interface LogViewerProps {
  logs: string[];
}

const LogViewer: React.FC<LogViewerProps> = ({ logs }) => {
  const logEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  return (
    <div
      style={{
        backgroundColor: "#1e1e1e",
        color: "#d4d4d4",
        padding: "10px",
        borderRadius: "8px",
        height: "400px",
        overflowY: "auto",
        fontFamily: "monospace",
      }}
    >
      {logs.map((log, index) => (
        <div key={index}>{log}</div>
      ))}
      <div ref={logEndRef} />
    </div>
  );
};

export default LogViewer;
