export interface InputCheck {
  healthy: boolean;
  timestamp: string;
  state: string;
  duration: number;
  message?: string;
  sources?: { label: string; status: string }[];
}

export interface Check {
  name?: string;
  healthy?: boolean;
  state: string;
  timestamp?: string;
  duration?: number;
  message?: string;
  sources?: { label: string; status: string }[];
  capabilities?: {
    name: string;
    healthy: boolean;
    state: string;
    message?: string;
  }[];
  components?: {
    name: string;
    healthy: boolean;
    state: string;
    message?: string;
    capabilities: string[];
  }[];
}

export const fetchedHealthChecks: { [key: string]: InputCheck } = {
  "app/crs": {
    healty: false,
    state: "LIMITED",
    duration: 0,
    timestamp: "2024-02-15T17:56:36.681+01:00",
  },
  "entities/services/testi": {
    healthy: true,
    state: "AVAILABLE",
    duration: 0,
    timestamp: "2024-02-15T17:56:36.681+01:00",
    capabilities: [
      {
        name: "Capability1",
        healthy: true,
        state: "AVAILABLE",
        message: "All systems operational",
      },
      {
        name: "Capability2",
        healthy: false,
        state: "UNAVAILABLE",
        message: "System maintenance",
      },
    ],
    components: [
      {
        name: "Component1",
        healthy: true,
        state: "AVAILABLE",
        message: "Component operational",
        capabilities: ["Capability1"],
      },
      {
        name: "Component2",
        healthy: false,
        state: "UNAVAILABLE",
        message: "Component failure",
        capabilities: ["Capability2"],
      },
    ],
  },
  "db.bergbau.pool.ConnectivityCheck": {
    healthy: true,
    state: "AVAILABLE",
    duration: 0,
    timestamp: "2024-02-15T17:56:36.681+01:00",
  },
  "db.krankenhaus.pool.ConnectivityCheck": {
    healthy: true,
    state: "AVAILABLE",

    duration: 5,
    timestamp: "2024-02-15T17:56:36.687+01:00",
  },
  deadlocks: {
    healthy: true,
    state: "AVAILABLE",

    duration: 0,
    timestamp: "2024-02-15T17:56:36.687+01:00",
  },
  store: {
    healthy: true,
    duration: 0,
    state: "AVAILABLE",

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
