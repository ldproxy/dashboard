export interface InputCheck {
  healthy: boolean;
  timestamp: string;
  duration: number;
  sources?: { label: string; status: string }[];
}

export interface Check {
  name: string;
  healthy: boolean;
  timestamp: string;
  duration: number;
  sources?: { label: string; status: string }[];
}

export const fetchedHealthChecks: { [key: string]: InputCheck } = {
  "db.bergbau.pool.ConnectivityCheck": {
    healthy: true,
    duration: 0,
    timestamp: "2024-02-15T17:56:36.681+01:00",
  },
  "db.krankenhaus.pool.ConnectivityCheck": {
    healthy: true,
    duration: 5,
    timestamp: "2024-02-15T17:56:36.687+01:00",
  },
  deadlocks: {
    healthy: true,
    duration: 0,
    timestamp: "2024-02-15T17:56:36.687+01:00",
  },
  store: {
    healthy: true,
    duration: 0,
    timestamp: "2024-02-15T17:56:36.687+01:00",
    sources: [
      {
        label: "FS[.]",
        status: "HEALTHY",
      },
      {
        label: "S3[s3.ldproxy.net/bplan]",
        status: "DEFECTIVE",
      },
    ],
  },
};
