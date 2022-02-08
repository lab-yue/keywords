import {
  defineGraph,
  defineGraphConfig,
  defineLink,
  defineNode,
  type GraphController as OriginGraphController,
  type GraphLink,
  type GraphNode,
} from "d3-graph-controller";
import keywordsToml from "./keywords.toml";

export namespace Keyword {
  export interface Data {
    keywords: {
      type: string;
      name?: string;
      label?: Node["label"];
      color?: string;
      items: string[];
    }[];
  }

  export type Type = string;
  export interface Node extends GraphNode<Type> {
    radius: number;
  }

  export interface Link extends GraphLink<Type, Node, Node> {}

  export type GraphController = OriginGraphController<Type, Node, Link>;
}

export const config = defineGraphConfig<
  Keyword.Type,
  Keyword.Node,
  Keyword.Link
>({
  autoResize: true,
  nodeRadius: (node: Keyword.Node) => node.radius,
  simulation: {
    forces: {
      collision: {
        radiusMultiplier: 1.6,
      },
      link: {
        length: 20,
      },
    },
  },
});

export const keywordsData = (keywordsToml as Keyword.Data).keywords;

let links: Keyword.Link[] = [];
let nodes = keywordsData.flatMap(({ type, ...category }) => {
  const node = ({
    text,
    radius,
  }: {
    text?: Exclude<Keyword.Node["label"], false>["text"];
    radius?: Keyword.Node["radius"];
  }) => {
    if (!text) return null;
    return defineNode<Keyword.Type, Keyword.Node>({
      id: text,
      type,
      isFocused: false,
      color: category.color ?? "#ccc",
      label: {
        color: "#000",
        fontSize: "1rem",
        text,
        ...category.label,
      },
      radius: radius ?? 32,
    });
  };

  const mainNode = node({
    text: category.name,
    radius: 40,
  });
  const subs = category.items.map((text) => {
    const subNode = node({
      text,
      radius: 32,
    });
    if (mainNode && subNode) {
      links.push(
        defineLink<Keyword.Type, Keyword.Node, Keyword.Node, Keyword.Link>({
          source: mainNode,
          target: subNode,
          color: "gray",
          label: false,
        })
      );
    }
    return subNode;
  });
  return [mainNode, ...subs].filter(Boolean) as Keyword.Node[];
});

export const graph = defineGraph<Keyword.Type, Keyword.Node, Keyword.Link>({
  nodes,
  links,
});
