/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
"use client";
import { useSession } from "next-auth/react";
import React, { useEffect, useRef, useState } from "react";
import { HiOutlinePhotograph } from "react-icons/hi";
import { app } from "../firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import {
  addDoc,
  collection,
  getFirestore,
  serverTimestamp,
} from "firebase/firestore";

export default function Input() {
  const { data: session } = useSession();
  const imagePickRef = useRef(null);
  const db = getFirestore(app);

  const [imageFileUrl, setImageFileUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageFileUploading, setImageFileUploading] = useState(false);
  const [text, setText] = useState("");
  const [postLoading, setPostLoading] = useState(false);

  const addImageToPost = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setImageFileUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    setPostLoading(true);
    const docRef = await addDoc(collection(db, "posts"), {
      uid: session.user.uid,
      name: session.user.name,
      username: session.user.username,
      text,
      profileImg: session.user.image,
      timestamp: serverTimestamp(),
      image: imageFileUrl,
    });
    setPostLoading(false);
    setText("");
    setImageFileUrl(null);
    setSelectedFile(null);
    location.reload();
  };
  useEffect(() => {
    if (selectedFile) {
      uploadImageToStorage();
    }
  }, [selectedFile]);

  const uploadImageToStorage = () => {
    setImageFileUploading(true);
    const storage = getStorage(app);
    const fileName = new Date().getTime() + "-" + selectedFile.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, selectedFile);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
      },
      (error) => {
        console.log(error);
        setImageFileUploading(false);
        setImageFileUrl(null);
        setSelectedFile(null);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setImageFileUrl(downloadURL);
          setImageFileUploading(false);
        });
      }
    );
  };

  if (!session) return null;
  return (
    <div className="flex border-b border-gray-200 p-3 space-x-2 w-full">
      <img
        src={session.user.image}
        className="rounded-full w-11 h-11 cursor-pointer hover:brightness-95"
        alt="user-image"
      />
      <div className="w-full divide-y divide-gray-200">
        <textarea
          className="w-full border-none outline-none tracking-wide min-h-[50px] text-gray-500"
          rows="2"
          placeholder="Whats happening"
          value={text}
          onChange={(e) => {
            setText(e.target.value);
          }}
        ></textarea>
        {selectedFile && (
          <img
            src={imageFileUrl}
            alt="image"
            className={`w-full max-h-[250px] object-cover cursor-pointer ${
              imageFileUploading ? "animate-pulse" : ""
            }`}
          />
        )}
        <div className="flex items-center justify-between pt-2.5">
          <HiOutlinePhotograph
            onClick={() => imagePickRef.current.click()}
            className="h-10 w-10 p-2 text-sky-500 hover:bg-sky-100 rounded-full cursor-pointer"
          />
          <input
            type="file"
            ref={imagePickRef}
            accept="image/.*"
            onChange={addImageToPost}
            hidden
          />
          <button
            disabled={text.trim() === "" || postLoading || imageFileUploading}
            className="bg-blue-400 text-white px-4 py-1.5 rounded-full font-bold shadow-md hover:brightness-95 disabled:opacity-50"
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}
