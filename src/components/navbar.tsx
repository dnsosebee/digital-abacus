import { SerialNodeEdge } from "@/model/coords/edges/nodeEdge";
import { popToAncestor, store, useStore } from "@/model/store";
import { HomeIcon } from "@heroicons/react/20/solid";
import { PureTextInput } from "./nodes/standalone";

export const saveTemplate = (serialNode: SerialNodeEdge) => {
  const label = serialNode.label;
  const labelInUse = store.components.some((c) => c.label === label);
  if (labelInUse) {
    if (!confirm("Overwrite existing template?")) {
      return;
    }

  const idx = store.components.findIndex((c) => c.label === label);
  store.components[idx] = serialNode;
  return;
  }
  store.components.push(serialNode);
};

export const Navbar = () => {
  const { ancestors } = useStore();
  if (ancestors.length === 0) {
    return null;
  }

  const updateLabel = (text: string) => {
    store.ancestors[store.ancestors.length - 1].node.label = text;
  };

  const saveActiveTemplate = () => {
    const node = store.ancestors[store.ancestors.length - 1].node;
    const serialNode = node.serialize();
    saveTemplate(serialNode);
  }

  
  // const ancestorLabels =
  return (
    <div className="z-10 visible text-white bg-transparent absolute px-4 py-2">
      <div className="flex flex-row space-x-2  justify-items-center">
        <button onClick={() => popToAncestor(0)}>
          <HomeIcon className="w-5 h-5 inline-block mr-2 mb-1" />
        </button>
        {ancestors.map(({ node, graph }, idx) => (
          <>
            <button className="whitespace-nowrap" disabled>
              /
            </button>
            {idx === ancestors.length - 1 ? (
              <PureTextInput
                value={node.label}
                onChange={(e) => updateLabel(e.target.value)}
                className="bg-transparent text-white"
              />
            ) : (
              <button className="whitespace-nowrap" onClick={() => popToAncestor(idx + 1)}>
                {node.label}
              </button>
            )}
          </>
        ))}
      </div>
      <button className="mt-2 btn btn-xs" onClick={saveActiveTemplate}>Save Template</button>
    </div>
  );
};
