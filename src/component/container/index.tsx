import React, { FC, memo, ReactChild } from "react";
import Draggable, { DraggableType, nodeID } from "../draggable";

const onDrop = (e: any) => {
  e.preventDefault();
  const node_id = e.dataTransfer.getData(nodeID);
  const node = document.getElementById(node_id);
  e.target.appendChild(node);
};
const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
};

type ContainerViewProps = {
  onMove?: (e: DOMRect) => void;
  id: string;
  initialPositionX: number;
  initialPositionY: number;
  children?: ReactChild | Element[];
};

const Container: FC<ContainerViewProps> = ({
  onMove,
  children,
  id,
  initialPositionX,
  initialPositionY,
}) => {
  return (
    <Draggable
      id={id}
      initialPositionX={initialPositionX}
      initialPositionY={initialPositionY}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMove={onMove}
      draggableType={DraggableType.CONTAINER}
    >
      {children}
    </Draggable>
  );
};

export default memo(Container);
