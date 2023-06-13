import React from "react";
const Label = ({ children }) => {
  return (
    <label className="block mb-2 text-sm font-medium text-white">
      {children}
    </label>
  );
};

export default Label;
