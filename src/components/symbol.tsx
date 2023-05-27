export const Symbol = ({ text }: { text: string }) => {
  return (
    <div className="flex flex-col items-center justify-center w-12 h-12 text-2xl font-bold bg-gray-800 rounded-full">
      {text}
    </div>
  );
};
