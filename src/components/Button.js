"use client";
import React from "react";
const Button = (props) => {
  return (
    <button
      type="button"
      className="text-white font-medium rounded-lg text-sm px-5 py-2.5 bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed focus:ring-gray-700 border-gray-700"
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};

export default Button;
