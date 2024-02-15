export interface InputCheck {
  healthy: boolean;
  duration: number;
  timestamp: string;
}

export interface Check {
  name: string;
  healthy: boolean;
  duration: number;
  timestamp: string;
}

const fetchedHealthChecks: { [key: string]: InputCheck } = {
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
  },
};

export const healthChecks: Check[] = Object.keys(fetchedHealthChecks).map(
  (name) => ({
    name,
    ...fetchedHealthChecks[name],
  })
);
