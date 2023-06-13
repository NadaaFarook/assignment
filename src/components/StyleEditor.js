"use client";
import React from "react";
import { Input, Label } from "../components";

import { useLayer } from "@/context/layerContext";

const StyleEditor = () => {
  const { layers, selectedId, UpdateState } = useLayer();

  const currentLayer = layers.find((layer) => layer.id == selectedId);
  return (
    <div className="flex flex-col h-full w-full px-2 py-6 gap-6 bg-gray-800 rounded">
      {currentLayer?.type == "text" && (
        <div>
          <Label>Font Size</Label>
          <Input
            type="number"
            value={currentLayer.fontSize}
            onChange={(e) => {
              UpdateState({ id: currentLayer.id, fontSize: e.target.value });
            }}
          />
        </div>
      )}

      {currentLayer?.type == "text" && (
        <div>
          <Label>Font Color</Label>
          <Input
            type="color"
            value={currentLayer.fontColor}
            onChange={(e) => {
              UpdateState({
                id: currentLayer.id,
                fontColor: e.target.value,
              });
            }}
          />
        </div>
      )}

      {currentLayer?.type == "text" && (
        <div>
          <Label>Add Shadow</Label>
          <div className="grid grid-cols-2 grid-rows-2 gap-2">
            <div>
              <Label>Offset X</Label>
              <Input
                type="number"
                value={currentLayer.shadowOffsetX}
                onChange={(e) => {
                  UpdateState({
                    id: currentLayer.id,
                    shadowOffsetX: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label>Offset Y</Label>
              <Input
                type="number"
                value={currentLayer.shadowOffsetY}
                onChange={(e) => {
                  UpdateState({
                    id: currentLayer.id,
                    shadowOffsetY: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label>Shadow Blurr</Label>
              <Input
                type="number"
                value={currentLayer.shadowBlur}
                onChange={(e) => {
                  UpdateState({
                    id: currentLayer.id,
                    shadowBlur: e.target.value,
                  });
                }}
              />
            </div>
            <div>
              <Label>Shadow Color</Label>
              <Input
                type="color"
                value={currentLayer.shadowColor}
                onChange={(e) => {
                  UpdateState({
                    id: currentLayer.id,
                    shadowColor: e.target.value,
                  });
                }}
              />
            </div>
          </div>
        </div>
      )}

      {!currentLayer && <p className="px-2">Select a layer to start editing</p>}
    </div>
  );
};

export default StyleEditor;
