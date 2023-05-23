import { Store } from "@/model/solver/store";
import Head from "next/head";
import { ReactFlowProvider } from "reactflow";
import CircuitBoard from "./circuitBoard";
import { DragProvider } from "./dragProvider";
import Linkages from "./linkages";

// export const deltasContext = React.createContext<{
//   showDeltas: boolean;
//   setShowDeltas: (showDeltas: boolean) => void;
// }>({ showDeltas: false, setShowDeltas: () => {} });

export const DigitalAbacus = ({ store }: { store: Store }) => {
  return (
    <DragProvider>
      <Head>
        <title>The Digital Abacus</title>
        <meta name="description" content="An Awesome Algebra Playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col h-screen">
          <h1 className="text-2xl font-bold text-gray-800 bg-slate-300 shadow-xl px-2 py-1">
            The Digital Abacus
          </h1>
          <div className="flex-grow flex overflow-hidden">
            <div className="split flex-grow flex flex-col">
              <ReactFlowProvider>
                <CircuitBoard store={store} />
              </ReactFlowProvider>
            </div>
            <div className="split">
              <Linkages />
            </div>
          </div>
        </div>
      </main>
    </DragProvider>
  );
};
