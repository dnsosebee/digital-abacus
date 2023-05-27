import { settings } from "@/model/settings";
import { SerialState } from "@/model/store";
import { Source_Code_Pro } from "next/font/google";
import Head from "next/head";
import { ReactFlowProvider } from "reactflow";
import { useSnapshot } from "valtio";
import CircuitBoard from "./circuitBoard";
import { DragProvider } from "./dragProvider";
import Linkages from "./linkages";
import { Sidebar } from "./sidebar";
import { Toolbar } from "./toolbar";

const normalFont = Source_Code_Pro({
  weight: "600",
  style: "normal",
  subsets: ["latin", "cyrillic"],
});

export const DigitalAbacus = ({ serialState }: { serialState: SerialState }) => {
  const { showLinkages } = useSnapshot(settings);
  return (
    <DragProvider>
      <Head>
        <title>The Digital Abacus</title>
        <meta
          name="description"
          content="The Digital Abacus is an educational and practical playground for solving complex math problems."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={`bg-slate-100 ${normalFont.className} text-slate-50`}>
        <div className="flex flex-col h-screen">
          <Toolbar />
          <div className="flex-grow flex overflow-hidden">
            <Sidebar />
            <div className="flex-none shadow-2xl h-full border-l-4 border-slate-500 z-50" />
            <div className="split flex-grow flex flex-col">
              <ReactFlowProvider>
                <CircuitBoard serialState={serialState} />
              </ReactFlowProvider>
            </div>
            {showLinkages && (
              <>
                <div className="flex-none shadow-2xl h-full border-l-4 border-slate-500 z-50" />
                <div className="split">
                  <Linkages />
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </DragProvider>
  );
};
