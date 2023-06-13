"use client";
import React, { useState, useRef, useId, Fragment } from "react";
import {
  Button,
  Download,
  EditorSt,
  Images,
  ImageComponent,
  Input,
  Label,
  StyleEditor,
} from "../components";
import { v4 as uuid } from "uuid";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { Dialog, Transition } from "@headlessui/react";
import { toast } from "react-toastify";
import {
  updateUser,
  login as authLogin,
  register,
} from "@/services/axiosService";
import useUserContext from "@/context/userContext";
const Modal = ({ open, setOpen, cancelButtonRef }) => {
  const { userContext, setContextUser } = useUserContext();
  const login = useGoogleLogin({
    onSuccess: async (response) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${response.access_token}`,
            },
          }
        );

        try {
          const resp = await register({
            email: res.data.email,
            name: res.data.name,
            picture: res.data.picture,
            token: response.access_token,
          });
          console.log(resp);
          if (resp.status == 200) {
            setContextUser(resp.data.data);
            localStorage.setItem("x-auth-token", resp.data.session);
            localStorage.setItem("x-auth-email", resp.data.data.email);

            toast(resp.data.message, { type: "success" });
          }
        } catch (error) {
          console.log(error);
          toast(error?.response?.data?.message, { type: "error" });
          setContextUser({});
        }
      } catch (err) {
        console.log(err);
        toast("Error fetching google credentials. Please try again.", {
          type: "error",
        });
      }
    },
  });
  return (
    <Transition.Root
      show={!localStorage.getItem("x-auth-token") && open}
      as={Fragment}
    >
      <Dialog
        as="div"
        className="relative z-100"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative transform overflow-hidden rounded-lg p-6 flex flex-col gap-6 bg-gray-800 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                <Dialog.Title
                  as="h2"
                  className="text-lg font-semibold leading-6 text-white "
                >
                  Signup/Login to start editing images
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">
                    Login so you can start using the project
                  </p>
                </div>
                <button
                  type="button"
                  className="inline-flex w-full m-0 justify-center rounded-md bg-gray-600 py-4 px-3  text-sm font-semibold text-white shadow-sm"
                  onClick={() => login()}
                >
                  Login with google
                </button>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default Modal;
