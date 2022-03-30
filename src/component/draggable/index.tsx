import React, { FC, memo, useRef, useState, useEffect, ReactNode } from "react";
import "./styles.scss";

export const nodeID = "node-data";

export enum DraggableType {
  CONTAINER = "container",
  NODE = "node",
}

type DraggableProps = {
  initialPositionX: number;
  initialPositionY: number;
  draggableType: DraggableType;
  onDragOver?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDrop?: (e: React.DragEvent<HTMLDivElement>) => void;
  onDragStart?: (e: React.DragEvent<HTMLDivElement>) => void;
  onMove?: (e: DOMRect) => void;
  onMouseUp?: () => void;
  id?: string;
  disablePosition?: string;
  draggable?: boolean;
  children?: ReactNode;
};

const Draggable: FC<DraggableProps> = ({
  initialPositionX,
  initialPositionY,
  draggableType,
  children,
  id,
  onDragOver,
  onDrop,
  onDragStart,
  onMove,
  onMouseUp,
}) => {
  const [pressed, setPressed] = useState(false);
  const [position, setPosition] = useState({
    x: initialPositionX,
    y: initialPositionY,
  });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (ref.current) {
      ref.current.style.transform = `translate(${position.x}px, ${position.y}px)`;
      onMove && onMove(ref.current.getBoundingClientRect());
    }
  }, [onMove, position]);

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (pressed) {
      setPosition({
        x: position.x + event.movementX,
        y: position.y + event.movementY,
      });
    }
  };

  return (
    <div
      id={id}
      className={`draggable-base ${draggableType}`}
      ref={ref}
      onDragOver={onDragOver}
      onDrop={onDrop}
      onMouseMove={onMouseMove}
      onDragStart={onDragStart}
      onMouseLeave={() => setPressed(false)}
      onMouseDown={(e) => {
        e.stopPropagation();
        setPressed(true);
      }}
      onMouseUp={() => {
        setPressed(false);
        onMouseUp && onMouseUp();
      }}
    >
      {children}
    </div>
  );
};

export default memo(Draggable);
