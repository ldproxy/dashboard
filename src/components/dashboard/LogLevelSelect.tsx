import React from "react";

interface LogLevelSelectProps {
  logLevel: string;
  handleChangeLogLevel: (event: React.ChangeEvent<HTMLSelectElement>) => void;
}

const LogLevelSelect: React.FC<LogLevelSelectProps> = ({
  logLevel,
  handleChangeLogLevel,
}) => {
  return (
    <div style={{ marginBottom: "10px" }}>
      <select
        id="logLevel"
        value={logLevel}
        title="Log Level"
        onChange={handleChangeLogLevel}
        style={{
          border: "1px solid #d4d4d4",
          borderRadius: "4px",
          padding: "3px",
          backgroundColor: "white",
          color: "black",
        }}
      >
        <option value="ERROR">ERROR</option>
        <option value="WARN">WARN</option>
        <option value="INFO">INFO</option>
        <option value="DEBUG">DEBUG</option>
        <option value="TRACE">TRACE</option>
      </select>
    </div>
  );
};

export default LogLevelSelect;
