import { Head, Html, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        {/* <script src="/model/p5.min.js" /> */}
        <script src="/model/coord.js" />
        <script src="/model/settings.js" />
        <script src="/model/sketch.js" />
        <script src="/model/graph/vertex.js" />
        <script src="/model/graph/edge.js" />
        <script src="/model/graph/relGraph.js" />
        <script src="/model/constraint.js" />
        <script src="/model/operations.js" />
        <script src="/model/linkages/linkagepoint.js" />
        <script src="/model/linkages/linkageop.js" />
        <script src="/model/linkages/linkagegraph.js" />
        <script src="/model/graphics.js" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
