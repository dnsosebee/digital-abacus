import pino from "pino";

export const logger = pino({
  level: "debug",
  browser: {
    asObject: false,
  },
});
