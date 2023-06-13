import React from "react";

const Input = ({ value, onChange, type }) => {
  return (
    <input
      type={type}
      className={`border text-xs rounded-sm w-full ${
        type == "color" ? "p-0" : "p-2"
      } bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500`}
      value={value}
      onChange={(e) => onChange(e)}
    />
  );
};

export default Input;
