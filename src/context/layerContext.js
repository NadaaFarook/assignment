"use client";
import React, { useState, createContext, useContext, useRef } from "react";
import { v4 as uuid } from "uuid";
import useUserContext from "./userContext";
import { updateUser } from "@/services/axiosService";

const LayerContext = createContext();

export const LayerProvider = ({ children }) => {
  const { userContext, setContextUser } = useUserContext();
  const [layers, setLayers] = useState([]);
  const [history, setHistory] = useState([[]]);

  const [selectedId, setSelected] = useState(null);
  const UpdateState = (props) => {
    const { id, ...updatedValues } = props;
    setLayers(
      layers.map((layer) =>
        layer.id == id ? { ...layer, ...updatedValues } : layer
      )
    );

    updateUser({
      ...userContext,
      layers: layers.map((layer) =>
        layer.id == id ? { ...layer, ...updatedValues } : layer
      ),
    });
    setHistory([
      ...history,
      layers.map((layer) =>
        layer.id == id ? { ...layer, ...updatedValues } : layer
      ),
    ]);
  };

  return (
    <LayerContext.Provider
      value={{
        layers,
        setLayers,
        history,
        selectedId,
        setSelected,
        setHistory,
        UpdateState,
      }}
    >
      {children}
    </LayerContext.Provider>
  );
};

export const useLayer = () => {
  return useContext(LayerContext);
};
