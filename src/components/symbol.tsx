import { Source_Serif_4 } from "next/font/google";

const mathFont = Source_Serif_4({
  weight: "900",
  style: "normal",
  subsets: ["latin", "cyrillic"],
});

export const Symbol = ({ text, className = "" }: { text: string; className?: string }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-12 min-w-[3rem] px-2 py-1 text-4xl font-bold bg-slate-500 rounded-full shadow-2xl ${mathFont.className} ${className}`}
    >
      {text}
    </div>
  );
};
