import { Noto_Serif } from "next/font/google";

// const mathFont = Noto_Sans_Math({
//   weight: "400",
//   style: "normal",
//   subsets: ["math"],
// });

const mathFont = Noto_Serif({
  weight: "700",
  style: "normal",
  subsets: ["cyrillic"],
});

export const Symbol = ({
  text,
  className = "",
  selected,
}: {
  text: string;
  className?: string;
  selected: boolean;
}) => {
  return (
    <div
      className={`flex flex-col items-center justify-center h-10 min-w-[3rem] px-3 text-2xl font-bold rounded-full shadow-2xl ${
        mathFont.className
      } ${selected ? "bg-white ring-2 ring-blue-400" : "bg-gray-200"} ${className}`}
    >
      {text}
    </div>
  );
};
