import React, { FC, memo } from "react";
import Draggable, { DraggableType, nodeID } from "../draggable";

const onDragStart = (e: any) => {
  e.dataTransfer.setData(nodeID, e.target.id);
};

const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.stopPropagation();
};

type NodeViewProps = {
  onMove?: (e: DOMRect) => void;
  onMouseUp?: () => void;
  id?: string;
  containerId?: string;
  initialPositionX: number;
  initialPositionY: number;
};

const Node: FC<NodeViewProps> = ({
  onMove,
  onMouseUp,
  id,
  initialPositionX,
  initialPositionY,
  containerId,
}) => {
  return (
    <Draggable
      id={id}
      disablePosition={containerId}
      initialPositionX={initialPositionX}
      initialPositionY={initialPositionY}
      draggableType={DraggableType.NODE}
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onMove={onMove}
      onMouseUp={onMouseUp}
    >
      Node
    </Draggable>
  );
};

export default memo(Node);
