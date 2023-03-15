import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <script src="/model/p5.min.js" /> */}
        <script src="/model/coord.js" async />
        <script src="/model/settings.js" async />
        <script src="/model/sketch.js" async />
        <script src="/model/graph/vertex.js" async />
        <script src="/model/graph/edge.js" async />
        <script src="/model/graph/relGraph.js" async />
        <script src="/model/constraint.js" async />
        <script src="/model/operations.js" async />
        <script src="/model/linkages/linkagepoint.js" async />
        <script src="/model/linkages/linkageop.js" async />
        <script src="/model/linkages/linkagegraph.js" async />
        <script src="/model/graphics.js" async />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
