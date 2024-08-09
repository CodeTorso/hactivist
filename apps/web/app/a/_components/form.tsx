"use client";

import { Button } from "@repo/ui/src/button";
import React, { useState } from "react";
import { motion } from "framer-motion";
import Icon from "./icon";
import { serveAdmin } from "../../server/actions";

function Form({userId}: {userId: string}) {
  const [formSubmit, setFormSubmit] = useState(false);
  const [error, setError] = useState("");

  return (
    <>
      {formSubmit && (
        <motion.div
          className="text-center w-full h-full z-10 flex -top-8 left-0 bg-white justify-center items-center absolute"
          initial={{ y: "-100%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 0.2, bounce: 0, type: "spring" }}
        >
          <div className="flex flex-col items-center">
            <Icon />
            <p>Admin creating...</p>
          </div>
        </motion.div>
      )}
      <form
        action={async (formData: FormData) => {
          setError((await serveAdmin({key: formData.get("key") as string, userId})).message)
          setFormSubmit(true);
        }}
        className="space-y-2"
      >
        <input
          name="key"
          className="w-full border-[1px] border-gray-400 px-2 py-1 outline-none"
          type="text"
          placeholder="admin key"
        />
        <div className="bg-red-400">Error : {error}</div>
        <div className="flex justify-end">
          <Button className="bg-[#F6F2EB] text-black hover:bg-[#F6F2EB]">
            Create
          </Button>
        </div>
      </form>
    </>
  );
}

export default Form;
