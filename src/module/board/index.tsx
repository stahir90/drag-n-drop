import { FC, useState } from "react";
import { Container, Node, Button } from "../../component";
import "./styles.scss";

type PositionProps = {
  x: number;
  y: number;
};

type NodeProps = {
  id: string;
  containerId?: string;
  rect?: DOMRect;
  position: PositionProps;
};

type ContainerProps = {
  id: string;
  rect?: DOMRect;
  position: PositionProps;
  nodeList?: NodeProps[];
};

enum Collision {
  CONTAINER,
  OUTSIDE_CONTAINER,
  MOVE_NOT_FOUND,
}

type CollisionDectectionProps = {
  type: Collision;
  destinatedContainer?: ContainerProps;
};

const isCollisionDetected = (
  containerList: ContainerProps[],
  node: NodeProps | undefined
): CollisionDectectionProps | undefined => {
  let nTop: number, nLeft: number, nRight: number, nBottom: number;
  let cTop: number, cLeft: number, cRight: number, cBottom: number;

  if (!node) {
    return node;
  }

  if (node.rect) {
    nTop = node.rect?.top;
    nLeft = node.rect?.left;
    nRight = node.rect?.right;
    nBottom = node.rect?.bottom;
  }
  let isVerticalMatch = false;
  let isHorizontalMatch = false;

  const destinatedContainer = containerList.find((container) => {
    if (container.rect) {
      cTop = container.rect.top;
      cLeft = container.rect.left;
      cRight = container.rect.right;
      cBottom = container.rect.bottom;

      if (
        (nTop > cTop && nTop < cBottom) ||
        (nBottom > cTop && nBottom < cBottom)
      ) {
        isVerticalMatch = true;
      } else {
        isVerticalMatch = false;
      }

      if (
        (nLeft > cLeft && nLeft < cRight) ||
        (nRight > cLeft && nRight < cRight)
      ) {
        isHorizontalMatch = true;
      } else {
        isHorizontalMatch = false;
      }

      if (isHorizontalMatch && isVerticalMatch) {
        return true;
      }
    }
    return false;
  });
  console.log(`detection ${destinatedContainer?.id}`);

  if (destinatedContainer) {
    return {
      type: Collision.CONTAINER,
      destinatedContainer,
    };
  } else {
    if (node.containerId) {
      const container = containerList.find(
        (container) => container.id === node.containerId
      );
      if (container?.rect && node.rect) {
        cTop = container.rect.top;
        cLeft = container.rect.left;
        cRight = container.rect.right;
        cBottom = container.rect.bottom;

        nTop = node.rect?.top;
        nLeft = node.rect?.left;
        nRight = node.rect?.right;
        nBottom = node.rect?.bottom;

        if (
          nBottom < cTop ||
          nTop > cBottom ||
          nLeft > cRight ||
          nRight < cLeft
        ) {
          return {
            type: Collision.OUTSIDE_CONTAINER,
            destinatedContainer: container,
          };
        }
      }
    }
    return {
      type: Collision.MOVE_NOT_FOUND,
      destinatedContainer: undefined,
    };
  }
};

const Board: FC = () => {
  const [containerList, setContainerList] = useState<ContainerProps[]>([]);
  const [nodeList, setNodeList] = useState<NodeProps[]>([]);

  const onNodeDragEnded = (sourceContainerId?: string, nodeId?: string) => {
    let nodeContainer: ContainerProps | undefined;
    let nodeContainerIndex: number | undefined = undefined;
    let nodeListIndex: number | undefined = -1;
    let sourceNode: NodeProps | undefined;

    if (sourceContainerId) {
      nodeContainer = containerList.find((container, index) => {
        nodeContainerIndex = index;
        return container.id === sourceContainerId;
      });

      sourceNode = nodeContainer?.nodeList?.find((node, index) => {
        nodeListIndex = index;
        return node.id === nodeId;
      });
    } else {
      sourceNode = nodeList.find((node, index) => {
        nodeListIndex = index;
        return node.id === nodeId;
      });
    }

    const collision = isCollisionDetected(containerList, sourceNode);
    if (
      sourceNode &&
      nodeListIndex !== -1 &&
      collision &&
      collision.type !== Collision.MOVE_NOT_FOUND
    ) {
      moveNode(
        collision,
        sourceNode,
        nodeContainerIndex,
        nodeListIndex,
        nodeList
      );
    }
  };

  const moveNode = (
    collision: CollisionDectectionProps,
    sourceNode: NodeProps,
    nodeContainerIndex: number | undefined,
    nodeListIndex: number,
    nodeList: NodeProps[]
  ) => {
    if (
      collision?.type === Collision.CONTAINER &&
      sourceNode.containerId !== collision.destinatedContainer?.id
    ) {
      sourceNode.containerId = collision.destinatedContainer?.id;
      collision.destinatedContainer?.nodeList?.push(sourceNode);
      nodeContainerIndex
        ? containerList[nodeContainerIndex]?.nodeList?.splice(nodeListIndex, 1)
        : nodeList.splice(nodeListIndex, 1);
    } else if (collision?.type === Collision.OUTSIDE_CONTAINER) {
      sourceNode.containerId = undefined;
      nodeList?.push(sourceNode);
      collision.destinatedContainer?.nodeList?.splice(nodeListIndex, 1);
    }

    setContainerList(containerList.slice());
  };

  const handleContainerClick = () => {
    setContainerList([
      ...containerList,
      {
        position: {
          x: Math.random() * 100,
          y: Math.random() * 40,
        },
        id: `${Math.random()}`,
        nodeList: [],
      },
    ]);
  };
  const handleNodeClick = () => {
    const updatedNodeList = [...nodeList];

    for (let i = 0; i < 10; i++) {
      updatedNodeList.push({
        position: {
          x: Math.random() * 100,
          y: Math.random() * 2,
        },
        id: `${Math.random()}`,
      });
    }

    setNodeList(updatedNodeList);
  };

  type RenderNodeListProps = {
    nodeList?: NodeProps[];
    insideContainer?: boolean;
  };

  const RenderNodeList: FC<RenderNodeListProps> = ({
    nodeList,
    insideContainer,
  }) => {
    return (
      <>
        {nodeList &&
          nodeList.map((node, index) => (
            <Node
              key={node.id}
              containerId={node.containerId}
              id={node.id}
              initialPositionX={insideContainer ? 0 : node.position.x}
              initialPositionY={insideContainer ? 0 : node.position.y}
              onMove={(rect) => {
                nodeList[index].rect = rect;
                // isCollisionDetected(containerList, nodeList[index]);
              }}
              onMouseUp={() => {
                onNodeDragEnded(node.containerId, node.id);
              }}
            />
          ))}
      </>
    );
  };

  return (
    <div className="board-container">
      <header id="header">
        <Button text="Add a Container" handleOnClick={handleContainerClick} />
        <Button text="Add 10 Nodes" handleOnClick={handleNodeClick} />
      </header>
      {containerList &&
        containerList.map((container, index) => (
          <Container
            key={container.id}
            id={container.id}
            initialPositionX={container.position.x}
            initialPositionY={container.position.y}
            onMove={(rect) => {
              containerList[index].rect = rect;
            }}
          >
            <RenderNodeList nodeList={container.nodeList} insideContainer />
          </Container>
        ))}
      <RenderNodeList nodeList={nodeList} />
    </div>
  );
};

export default Board;
