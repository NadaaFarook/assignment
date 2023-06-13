import React, { useRef } from "react";
import { Html } from "react-konva-utils";

export const TextEditor = ({ textNodeRef, value, onBlur, onChange }) => {
  const [style, setStyle] = React.useState();
  const textareaRef = useRef();
  const cursorPosition = 0;
  React.useLayoutEffect(() => {
    const textNode = textNodeRef.current;
    // apply many styles to match text on canvas as close as possible
    // remember that text rendering on canvas and on the textarea can be different
    // and sometimes it is hard to make it 100% the same. But we will try...
    const newStyle = {};
    newStyle.width = textNode.width() - textNode.padding() * 2 + "px";
    newStyle.height = textNode.height() - textNode.padding() * 2 + 10 + "px";
    newStyle.fontSize = textNode.fontSize() + "px";
    newStyle.border = textNode.strokeWidth() + "px solid " + textNode.stroke();
    newStyle.padding = "0px";
    newStyle.overflow = "hidden";
    newStyle.background = "none";
    newStyle.outline = "none";
    newStyle.resize = "none";
    newStyle.lineHeight = textNode.lineHeight() + 0.01;
    newStyle.fontFamily = '"' + textNode.fontFamily() + '"';
    newStyle.transformOrigin = "left top";
    newStyle.textAlign = textNode.align();
    newStyle.overflowWrap = "break-word";
    newStyle.whiteSpace = "normal";
    newStyle.userSelect = "text";
    newStyle.wordBreak = "normal";
    newStyle.color = textNode.fill();

    if (JSON.stringify(newStyle) !== JSON.stringify(style)) {
      setStyle(newStyle);
    }
  });

  return (
    <Html>
      <textarea
        ref={textareaRef}
        autoFocus
        className="polotno-input"
        style={{
          ...style,
        }}
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
        }}
        onBlur={onBlur}
      />
    </Html>
  );
};
export default TextEditor;
