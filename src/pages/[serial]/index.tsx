import { DigitalAbacus } from "@/components/digitalAbacus";
import { logger } from "@/lib/logger";
import { Store, storeSchema } from "@/model/solver/store";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  return {
    props: {
      serial: context.params!.serial,
    },
  };
};

export default function Home({ serial }: { serial: string }) {
  let store: Store;
  logger.debug({ serial }, "Home");
  try {
    const decoded = decodeURIComponent(serial);
    logger.debug({ decoded }, "Home");
    const json = JSON.parse(decoded);
    logger.debug({ json }, "Home");
    store = storeSchema.parse(json);
    console.log("done parsing");
  } catch (e) {
    logger.error(e);
    throw e;
    // store = DEFAULT_SERIAL_STATE;
  }

  return <DigitalAbacus store={store} />;
}
