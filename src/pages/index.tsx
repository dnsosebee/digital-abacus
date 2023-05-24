import { DigitalAbacus } from "@/components/digitalAbacus";
import { INITIAL_STORE } from "@/model/solver/schema/store";

export default function Home() {
  return <DigitalAbacus store={INITIAL_STORE} />;
}
