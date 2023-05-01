import { SerialState } from "@/model/store";
import Head from "next/head";
import { ReactFlowProvider } from "reactflow";
import CircuitBoard from "./circuitBoard";
import Linkages from "./linkages";

export const DigitalAbacus = ({ serialState }: { serialState: SerialState }) => {
  return (
    <>
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
          <div className="flex-grow flex">
            <div className="split flex-grow flex flex-col">
              <ReactFlowProvider>
                <CircuitBoard serialState={serialState} />
              </ReactFlowProvider>
            </div>
            <div className="split overflow-scroll">
              <Linkages />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};