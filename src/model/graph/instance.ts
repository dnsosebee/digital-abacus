import { Vertex } from "./vertex";

type GraphInstance = {
  edgeInstances: EdgeInstance<T>[];
};

type EdgeInstance<T> = {
  vertices: Vertex<T>[];
};
