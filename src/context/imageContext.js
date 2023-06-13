"use client";
import React, { useState, createContext, useContext, useRef } from "react";

const ImageContext = createContext();

export const ImageProvider = ({ children }) => {
  const [images, setImages] = useState([]);
  const [dragUrl, setDragUrl] = useState(null);

  return (
    <ImageContext.Provider value={{ images, setImages, dragUrl, setDragUrl }}>
      {children}
    </ImageContext.Provider>
  );
};

export const useImages = () => {
  return useContext(ImageContext);
};
