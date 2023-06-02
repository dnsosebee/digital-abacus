import { settings } from "@/model/settings";
import { mainGraph } from "@/model/store";
import {
  AdjustmentsHorizontalIcon,
  EyeIcon,
  EyeSlashIcon,
  TrashIcon,
} from "@heroicons/react/20/solid";
import { Source_Code_Pro } from "next/font/google";
import { useSnapshot } from "valtio";
import { PureSingleNumericInput } from "./numericInput";

const headingFont = Source_Code_Pro({
  weight: "800",
  style: "normal",
  subsets: ["latin", "cyrillic"],
});

export const Topbar = () => {
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
  <h1 className="text-2xl px-2 select-none text-gray-600">
    <AdjustmentsHorizontalIcon className="w-5 h-5 inline-block xl:hidden mr-2 mb-1" />
    <p className="hidden xl:inline">The Digital Abacus</p>
  </h1>
);

const GeneralSettings = () => {
  const { showComplex: showImaginary, stepSize, updateCycles } = useSnapshot(settings);

  const toggleShowImaginary = () => {
    settings.showComplex = !settings.showComplex;
  };

  const setStepSize = (n: number) => {
    settings.stepSize = n;
  };

  const setUpdateCycles = (n: number) => {
    settings.updateCycles = n;
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
      <button onClick={eraseAll} className="btn btn-sm">
        <p className="mr-2">reset</p>
        <TrashIcon className="w-5 h-5 inline-block" />
      </button>
      <div className="flex rounded-xl bg-gray-800">
        <p className="self-center justify-self-center px-2 py-[0.45rem] select-none text-sm">
          GRANULARITY:
        </p>
        <PureSingleNumericInput
          value={stepSize}
          onChange={setStepSize}
          className="bg-neutral w-24 px-2"
          dragFineness={0.001}
          fineness={0.000001}
          min={0.000001}
          max={1}
        />
      </div>
      <div className="flex rounded-xl bg-gray-800">
        <p className="self-center justify-self-center px-2 py-[0.45rem] select-none text-sm">
          SPEED:
        </p>
        <PureSingleNumericInput
          value={updateCycles}
          onChange={setUpdateCycles}
          className="bg-neutral w-12 px-2"
          dragFineness={1}
          fineness={1}
          min={0}
          max={100}
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
