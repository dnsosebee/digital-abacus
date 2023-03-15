import dynamic from "next/dynamic";

const DynamicLinkages = dynamic(() => import("@/components/linkages"), { ssr: false });

const Page = () => {
  return <DynamicLinkages />;
};

export default Page;
