import React, { forwardRef, useRef, useState } from "react";
import { Group, Text, Transformer } from "react-konva";
import { TextEditor } from "./index";
import { useLayer } from "@/context/layerContext";

const EditorSt = forwardRef((props) => {
  const {
    text,
    onChange,
    x,
    y,
    fontSize,
    fontColor,
    isSelected,
    layer,
    onSelect,
    shadowColor,
    shadowBlur,
    shadowOffsetX,
    shadowOffsetY,
  } = props;
  const { layers, setLayers, history, setHistory, UpdateState } = useLayer();
  const [editorEnabled, setEditorEnabled] = useState(false);
  const textRef = useRef(null);
  const textWrapperRef = useRef(null);
  const trRef = React.useRef();
  React.useEffect(() => {
    if (isSelected) {
      // we need to attach transformer manually
      trRef.current.nodes([textRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);
  return (
    <>
      <Group
        x={x}
        y={y}
        draggable
        ref={textWrapperRef}
        onDragStart={() => {
          setLayers(
            layers.map((text) =>
              text.id == layer.id ? { ...text, isDragging: true } : text
            )
          );
        }}
        onDragEnd={(e) => {
          UpdateState({
            id: layer.id,
            isDragging: false,
            x: e.target.x(),
            y: e.target.y(),
          });
        }}
      >
        <Text
          fontSize={fontSize}
          fill={fontColor}
          text={text}
          shadowColor={shadowColor}
          shadowBlur={shadowBlur}
          shadowOffsetX={shadowOffsetX}
          shadowOffset={shadowOffsetY}
          ref={textRef}
          onClick={() => {
            onSelect();
            setEditorEnabled(true);
          }}
          visible={!editorEnabled}
          onTransformEnd={(e) => {
            const grpNode = textWrapperRef.current;
            const node = textRef.current;
            const scaleX = node.scaleX();
            const scaleY = node.scaleY();
            // we will reset it back
            node.scaleX(1);
            node.scaleY(1);
            console.log(scaleX, "scaleX");

            UpdateState({
              id: layer.id,
              x: grpNode.x(),
              y: grpNode.y(),
              fontSize: Math.max(5, node.fontSize() * scaleX),
            });
          }}
        />
        {editorEnabled && (
          <Group>
            <TextEditor
              value={text}
              textNodeRef={textRef}
              onChange={onChange}
              onBlur={() => {
                setEditorEnabled(false);
              }}
            />
          </Group>
        )}
      </Group>
      {isSelected && (
        <Transformer
          rotateEnabled={false}
          ref={trRef}
          enabledAnchors={["middle-left", "middle-right"]}
          boundBoxFunc={(oldBox, newBox) => {
            newBox.width = Math.max(30, newBox.width);
            return newBox;
          }}
          // boundBoxFunc={(oldBox, newBox) => {
          //   // limit resize
          //   if (newBox.width < 5 || newBox.height < 5) {
          //     return oldBox;
          //   }
          //   return newBox;
          // }}
        />
      )}
    </>
  );
});

export default EditorSt;
