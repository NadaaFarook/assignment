"use client";
import React, { useState, useRef, useId, Fragment, useEffect } from "react";
import {
  Button,
  Download,
  EditorSt,
  Images,
  ImageComponent,
  Input,
  Label,
  StyleEditor,
  Modal,
} from "../components";
import { v4 as uuid } from "uuid";
import { Dialog, Transition } from "@headlessui/react";
import { Stage, Layer, Rect, Image, Group, Text } from "react-konva";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ImageProvider, useImages } from "@/context/imageContext";
import { useLayer } from "@/context/layerContext";
import { Html } from "react-konva-utils";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { getUser, updateUser } from "@/services/axiosService";
import useUserContext from "@/context/userContext";

export default function Home() {
  const { images, dragUrl, setImages, setDragUrl } = useImages();
  const [open, setOpen] = useState(true);
  const { userContext, setContextUser } = useUserContext();
  const cancelButtonRef = useRef(null);
  const {
    layers,
    setLayers,
    history,
    setHistory,
    selectedId,
    setSelected,
    UpdateState,
  } = useLayer();
  const checkDeselect = (e) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelected(null);
    }
  };
  const [historyIndex, setHistoryIndex] = useState(0);

  const stageRef = useRef();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getUser();
        if (res.status == 200) {
          console.log(res.data);
          setContextUser(res.data.data);
          setImages(res.data.data.imagesUploads);
          setLayers(res.data.data.layers);
        }
      } catch (error) {
        console.log(error, "errooor");
        // localStorage.removeItem("x-auth-token");
        // localStorage.removeItem("x-auth-email");
      }
    };
    fetchData();
  }, []);
  return (
    <GoogleOAuthProvider clientId="342222579547-ft07jlbd7o512lv9fpjhfulpon2aoirs.apps.googleusercontent.com">
      <main className="flex h-screen w-screen gap-4 bg-gray-950">
        <aside
          className="top-0 left-0  w-1/4 h-screen transition-transform -translate-x-full sm:translate-x-0"
          aria-label="Sidebar"
        >
          <div className="flex flex-col h-full px-4 py-4 gap-4 bg-gray-900">
            <p>Image Gallery</p>
            <Images />
            <p>Editor</p>
            <StyleEditor />
            <Download stageRef={stageRef} />
          </div>
        </aside>
        <div className="flex flex-col w-full py-4 gap-4 pr-4">
          <div className="flex gap-4">
            <Button
              disabled={historyIndex + 1 == history.length} // valid
              onClick={() => {
                setLayers(history[history.length - historyIndex - 2]);
                setHistoryIndex(historyIndex + 1);
                updateUser({
                  ...userContext,
                  layers: history[history.length - historyIndex - 2],
                });
              }}
            >
              Undo
            </Button>
            <Button
              disabled={historyIndex == 0}
              onClick={() => {
                setLayers(history[history.length - historyIndex]);
                setHistoryIndex(historyIndex - 1);
                updateUser({
                  ...userContext,
                  layers: history[history.length - historyIndex],
                });
              }}
            >
              Redo
            </Button>
            <Button
              onClick={() => {
                setLayers([
                  ...layers,
                  {
                    type: "text",
                    isDragging: false,
                    id: uuid(),
                    text: "Start typing here",
                    x: 150,
                    y: 150,
                    fontSize: 20,
                    fontColor: "#ffffff",
                    shadowColor: "#000000",
                    shadowBlur: 0,
                    shadowOffsetX: 0,
                    shadowOffsetY: 0,
                  },
                ]);
                updateUser({
                  ...userContext,
                  layers: [
                    ...layers,
                    {
                      type: "text",
                      isDragging: false,
                      id: uuid(),
                      text: "Start typing here",
                      x: 150,
                      y: 150,
                      fontSize: 20,
                      fontColor: "#ffffff",
                      shadowColor: "#000000",
                      shadowBlur: 0,
                      shadowOffsetX: 0,
                      shadowOffsetY: 0,
                    },
                  ],
                });
              }}
            >
              Add Text
            </Button>
          </div>
          <div className="flex flex-col h-full p-4 rounded gap-4 bg-gray-900 justify-center items-center">
            <div
              onDrop={(e) => {
                e.preventDefault();
                // register event position
                stageRef.current.setPointersPositions(e);
                // add image
                const id = uuid();
                setLayers([
                  ...layers,
                  {
                    ...stageRef.current.getPointerPosition(),
                    src: dragUrl,
                    type: "image",
                    isDragging: false,
                    id: id,
                  },
                ]);
                updateUser({
                  ...userContext,
                  layers: [
                    ...layers,
                    {
                      ...stageRef.current.getPointerPosition(),
                      src: dragUrl,
                      type: "image",
                      isDragging: false,
                      id: id,
                    },
                  ],
                });

                setHistory([
                  ...history,
                  [
                    ...layers,
                    {
                      ...stageRef.current.getPointerPosition(),
                      src: dragUrl,
                      type: "image",
                      isDragging: false,
                      id: id,
                    },
                  ],
                ]);
              }}
              onDragOver={(e) => e.preventDefault()}
            >
              <Stage
                style={{
                  border: "1px solid #334a77",
                }}
                width={600}
                height={600}
                ref={stageRef}
                onMouseDown={checkDeselect}
                onTouchStart={checkDeselect}
              >
                <Layer>
                  {layers.map((layer) => {
                    if (layer.type == "image")
                      return (
                        <ImageComponent
                          layer={layer}
                          key={layer.id}
                          isSelected={layer.id === selectedId}
                          onSelect={() => {
                            setSelected(layer.id);
                          }}
                        />
                      );
                    if (layer.type == "text")
                      return (
                        <EditorSt
                          layer={layer}
                          isSelected={layer.id === selectedId}
                          text={layer.text}
                          fontSize={layer.fontSize}
                          fontColor={layer.fontColor}
                          shadowColor={layer.shadowColor}
                          shadowBlur={layer.shadowBlur}
                          shadowOffsetX={layer.shadowOffsetX}
                          shadowOffsetY={layer.shadowOffsetY}
                          x={layer.x}
                          y={layer.y}
                          onSelect={() => {
                            setSelected(layer.id);
                          }}
                          onChange={(e) => {
                            UpdateState({
                              id: layer.id,
                              text: e,
                            });
                          }}
                        />
                      );
                  })}
                </Layer>
              </Stage>
            </div>
          </div>
        </div>
      </main>
      <Modal open={open} setOpen={setOpen} cancelButtonRef={cancelButtonRef} />
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </GoogleOAuthProvider>
  );
}
