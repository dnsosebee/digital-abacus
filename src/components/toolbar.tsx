import { settings } from "@/model/settings";
import { AdjustmentsHorizontalIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Source_Code_Pro } from "next/font/google";
import { useSnapshot } from "valtio";
import { Button, VerticalLine } from "./button";
import { PureSingleNumericInput } from "./numericInput";

const headingFont = Source_Code_Pro({
  weight: "800",
  style: "normal",
  subsets: ["latin", "cyrillic"],
});

export const Toolbar = () => {
  return (
    <div
      className={`font-bold bg-slate-900 border-b-2 border-slate-500 shadow-xl ${headingFont.className} justify-between flex items-stretch`}
    >
      <Title />
      <GeneralSettings />
      <LinkagesSettings />
    </div>
  );
};

const Title = () => (
  <h1 className="text-lg pl-2 gradient pr-10 lg:pr-24">
    <AdjustmentsHorizontalIcon className="w-6 h-6 inline-block mr-2 mb-1" />
    <p className="hidden lg:inline">The Digital Abacus</p>
  </h1>
);

const GeneralSettings = () => {
  const { showImaginary, stepSize } = useSnapshot(settings);

  const toggleShowImaginary = () => {
    settings.showImaginary = !settings.showImaginary;
  };

  const setStepSize = (n: number) => {
    settings.stepSize = n;
  };

  return (
    <div className="flex">
      <VerticalLine />
      <Button onClick={toggleShowImaginary} className={showImaginary ? "bg-slate-500" : ""}>
        {showImaginary ? (
          <>
            <p className="mr-2">complex</p>
            <EyeIcon className="w-6 h-6 inline-block" />
          </>
        ) : (
          <>
            <p className="mr-2">complex</p>
            <EyeSlashIcon className="w-6 h-6 inline-block" />
          </>
        )}
      </Button>
      <VerticalLine />
      <PureSingleNumericInput value={stepSize} onChange={setStepSize} />

      <VerticalLine />
    </div>
  );
};

const LinkagesSettings = () => {
  const { showLinkages, showDifferentials } = useSnapshot(settings);

  const toggleShowLinkages = () => {
    settings.showLinkages = !settings.showLinkages;
  };

  const toggleShowDifferentials = () => {
    settings.showDifferentials = !settings.showDifferentials;
  };

  return (
    <div className="flex">
      <VerticalLine />
      {showLinkages && (
        <>
          <Button
            onClick={toggleShowDifferentials}
            className={showDifferentials ? "bg-slate-500" : ""}
          >
            {showDifferentials ? (
              <>
                <p className="mr-2">δs</p>
                <EyeIcon className="w-6 h-6 inline-block" />
              </>
            ) : (
              <>
                <p className="mr-2">δs</p>
                <EyeSlashIcon className="w-6 h-6 inline-block" />
              </>
            )}
          </Button>
          <VerticalLine />
        </>
      )}
      <Button onClick={toggleShowLinkages} className={showLinkages ? "bg-slate-500" : ""}>
        {showLinkages ? (
          <>
            <p className="mr-2">Linkages</p>
            <EyeIcon className="w-6 h-6 inline-block" />
          </>
        ) : (
          <>
            <p className="mr-2">Linkages</p>
            <EyeSlashIcon className="w-6 h-6 inline-block" />
          </>
        )}
      </Button>
      <VerticalLine />
    </div>
  );
};
