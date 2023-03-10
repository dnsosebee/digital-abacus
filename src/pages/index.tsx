import CircuitBoard from "@/components/circuitBoard";
import Head from "next/head";

export default function Home() {
  return (
    <>
      <Head>
        <title>The Digital Abacus</title>
        <meta name="description" content="An Awesome Algebra Playground" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div className="flex flex-col h-full">
          <h1 className="text-2xl font-bold text-gray-800 bg-slate-300 shadow-xl px-2 py-1">
            The Digital Abacus
          </h1>
          <CircuitBoard />
        </div>
      </main>
    </>
  );
}
