import { DigitalAbacus } from "@/components/digitalAbacus";
import { DEFAULT_SERIAL_STATE } from "./[serial]";

export default function Home() {
  return <DigitalAbacus serialState={DEFAULT_SERIAL_STATE} />;
}
