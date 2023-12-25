import { DigitalAbacus } from "@/components/digitalAbacus";
import { logger } from "@/lib/logger";
import { UPDATE_ITERATIVE } from "@/model/settings";
import { SerialState, serialStateSchema } from "@/model/store";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serial: context.params!.serial,
    },
  };
};

export default function Home({ serial }: { serial: string }) {
  let serialState: SerialState;
  logger.debug({ serial }, "Home");
  try {
    const decoded = decodeURIComponent(serial);
    logger.debug({ decoded }, "Home");
    const json = JSON.parse(decoded);
    logger.debug({ json }, "Home");
    serialState = serialStateSchema.parse(json);
    console.log("done parsing");
  } catch (e) {
    logger.error(e);
    serialState = DEFAULT_SERIAL_STATE;
  }

  return <DigitalAbacus serialState={serialState} />;
}

export const DEFAULT_SERIAL_STATE = {
  graph: {
    vertices: [],
    edges: [],
    focus: null,
    mode: UPDATE_ITERATIVE,
    stickies: [],
  },
  stickies: [],
};
