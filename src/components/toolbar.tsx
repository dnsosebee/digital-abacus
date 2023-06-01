import { settings } from "@/model/settings";
import { mainGraph } from "@/model/store";
import { AdjustmentsHorizontalIcon, EyeIcon, EyeSlashIcon } from "@heroicons/react/20/solid";
import { Source_Code_Pro } from "next/font/google";
import { useSnapshot } from "valtio";
import { PureSingleNumericInput } from "./numericInput";

const headingFont = Source_Code_Pro({
  weight: "800",
  style: "normal",
  subsets: ["latin", "cyrillic"],
});

export const Toolbar = () => {
  return (
    <div
      className={`font-bold ${headingFont.className} justify-between flex items-stretch text-gray-200 px-2 pt-2 pb-1`}
    >
      <div className="flex items-stretch">
        <Title />
        <GeneralSettings />
      </div>
      <LinkagesSettings />
    </div>
  );
};

const Title = () => (
  <h1 className="text-2xl pl-2 pr-10 lg:pr-4 select-none text-gray-600">
    <AdjustmentsHorizontalIcon className="w-5 h-5 inline-block mr-2 mb-1" />
    <p className="hidden lg:inline">The Digital Abacus</p>
  </h1>
);

const GeneralSettings = () => {
  const { showComplex: showImaginary, stepSize } = useSnapshot(settings);

  const toggleShowImaginary = () => {
    settings.showComplex = !settings.showComplex;
  };

  const setStepSize = (n: number) => {
    if (n > 0) {
      settings.stepSize = n;
    }
  };

  const eraseAll = () => {
    confirm("Erase all and start over?") && mainGraph.reset();
  };

  return (
    <div className="flex space-x-3">
      <button
        onClick={toggleShowImaginary}
        className={`btn btn-sm ${
          showImaginary ? "bg-slate-500 hover:bg-slate-700 " : "hover:bg-slate-700 "
        }`}
      >
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
      </button>
      <button onClick={eraseAll} className="btn btn-sm btn-error">
        reset
      </button>
      <div className="flex rounded-xl bg-gray-800">
        <p className="self-center justify-self-center px-2 py-[0.45rem] select-none text-sm">
          INTERVAL:
        </p>
        <PureSingleNumericInput
          value={stepSize}
          onChange={setStepSize}
          className="bg-neutral w-24 px-2"
          dragFineness={0.001}
        />
      </div>
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
    <div className="flex space-x-3">
      {showLinkages && (
        <>
          <button onClick={toggleShowDifferentials} className={`btn btn-sm`}>
            {showDifferentials ? (
              <>
                <p className="mr-2">deltas</p>
                <EyeIcon className="w-6 h-6 inline-block" />
              </>
            ) : (
              <>
                <p className="mr-2">deltas</p>
                <EyeSlashIcon className="w-6 h-6 inline-block" />
              </>
            )}
          </button>
        </>
      )}
      <button onClick={toggleShowLinkages} className={`btn btn-sm`}>
        {showLinkages ? (
          <>
            <p className="mr-2">plot</p>
            <EyeIcon className="w-6 h-6 inline-block" />
          </>
        ) : (
          <>
            <p className="mr-2">plot</p>
            <EyeSlashIcon className="w-6 h-6 inline-block" />
          </>
        )}
      </button>
    </div>
  );
};
