import React from "react";

const Download = ({ stageRef }) => {
  function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
  const handleExport = () => {
    const uri = stageRef.current.toDataURL();
    downloadURI(uri, "edit.png");
  };
  return (
    <button className="h-16 w-full bg-gray-800 rounded" onClick={handleExport}>
      Download Image
    </button>
  );
};

export default Download;
