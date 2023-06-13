"use client";
import React from "react";
import { Stage, Layer, Rect, Transformer, Image } from "react-konva";
import { useLayer } from "@/context/layerContext";
import useImage from "use-image";

const ImageComponent = ({ layer, isSelected, onSelect }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();
  const { layers, setLayers, history, setHistory, UpdateState } = useLayer();
  const [img] = useImage(layer.src, "anonymous");
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <>
      <Image
        draggable // props spread
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        image={img} // img component
        x={layer.x} // props spread
        y={layer.y} // props spread /2
        offsetX={layer.width ? layer.width / 2 : img?.width / 2} // img component
        offsetY={layer.width ? layer.height / 2 : img?.height / 2} // img component
        height={layer.width ? layer.height : img?.height}
        width={layer.width ? layer.width : img?.width}
        rotation={layer.rotation || 0}
        onDragStart={() => {
          setLayers(
            layers.map((img) =>
              img.id == layer.id ? { ...img, isDragging: true } : img
            )
          );
        }} // props spread
        onDragEnd={(e) => {
          UpdateState({
            id: layer.id,
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });
        }} // props spread
        onTransformEnd={(e) => {
          // transformer is changing scale of the node
          // and NOT its width or height
          // but in the store we have only width and height
          // to match the data better we will reset scale on transform end
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();

          // we will reset it back
          node.scaleX(1);
          node.scaleY(1);
          UpdateState({
            id: layer.id,
            x: node.x(),
            y: node.y(),
            rotation: node.rotation(),
            // set minimal value
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(node.height() * scaleY),
          });
        }}
      />

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (newBox.width < 5 || newBox.height < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </>
  );
};

export default ImageComponent;
