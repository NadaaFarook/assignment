import { updateUser } from "@/services/axiosService";
import { useImages } from "../context/imageContext";
import React, { useRef, useState } from "react";
import useUserContext from "@/context/userContext";
const Images = () => {
  const { images, setImages, dragUrl, setDragUrl } = useImages();
  const [loading, setLoading] = useState(false);
  const { userContext, setContextUser } = useUserContext();
  const handleSelectImage = (image) => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "ml_default");
    data.append("cloud_name", "cloudimageapi");
    fetch("https://api.cloudinary.com/v1_1/cloudimageapi/image/upload", {
      method: "post",
      body: data,
    })
      .then((resp) => resp.json())
      .then((data) => {
        setImages([...images, data.url]);
        setContextUser({
          ...userContext,
          imagesUploads: [...userContext.imagesUploads, data.url],
        });

        updateUser({
          ...userContext,
          imagesUploads: [...userContext.imagesUploads, data.url],
        });
      })

      .then((data) => {})
      .catch((err) => console.log(err));
    setLoading(false);
  };
  const fileUploadInput = useRef(null);
  return (
    <>
      <div className="p-2 gap-2 min-h-60 h-60 max-h-60 grid grid-cols-4 grid-rows-2 w-full bg-gray-800 rounded">
        {images.map((img) => (
          <img
            className="flex justify-center object-cover items-center h-full rounded border border-white border-dashed"
            src={img}
            draggable="true"
            onDragStart={(e) => {
              setDragUrl(img);
            }}
          />
        ))}
        <input
          type="file"
          accept="image/*"
          onChange={(e) => handleSelectImage(e.target.files[0])}
          className="hidden"
          ref={fileUploadInput}
        />
        <div
          onClick={() => fileUploadInput.current.click()}
          className="flex justify-center items-center rounded border border-white border-dashed"
        >
          {loading ? "loading..." : "Add Image"}
        </div>
      </div>
    </>
  );
};

export default Images;
