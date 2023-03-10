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
          <p className="text-2xl font-bold text">The Digital Abacus</p>
          <CircuitBoard />
        </div>
      </main>
    </>
  );
}
