import React from "react";

interface ToggleFiltersLogProps {
  isDropdownOpenLog: boolean;
  setIsDropdownOpenLog: (isDropdownOpenLog: boolean) => void;
  flagsLog: Record<string, boolean>;
  handleFlagChangeLog: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ToggleFiltersLog: React.FC<ToggleFiltersLogProps> = ({
  isDropdownOpenLog,
  setIsDropdownOpenLog,
  flagsLog,
  handleFlagChangeLog,
}) => {
  return (
    <div style={{ marginBottom: "10px", position: "relative" }}>
      <button
        onClick={() => setIsDropdownOpenLog(!isDropdownOpenLog)}
        style={{
          backgroundColor: "white",
          width: "125px",
          border: "1px solid lightgray",
          color: "black",
          cursor: "pointer",
          padding: "3px",
          borderRadius: "4px",
        }}
      >
        Toggle Filters
      </button>
      {isDropdownOpenLog && (
        <div
          style={{
            position: "absolute",
            top: "40px",
            left: 0,
            backgroundColor: "white",
            border: "1px solid #d4d4d4",
            borderRadius: "4px",
            padding: "10px",
            zIndex: 20,
            display: "flex",
            flexDirection: "column",
            width: "225px",
          }}
        >
          {Object.keys(flagsLog).map((flag) => (
            <label key={flag} style={{ marginBottom: "5px" }}>
              <input
                type="checkbox"
                name={flag}
                checked={flagsLog[flag as keyof typeof flagsLog]}
                onChange={handleFlagChangeLog}
                style={{ marginRight: "5px" }}
              />
              {flag}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default ToggleFiltersLog;
