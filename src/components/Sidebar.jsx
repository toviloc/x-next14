"use client";
import Link from "next/link";
import { FaXTwitter } from "react-icons/fa6";
import { HiHome } from "react-icons/hi";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Sidebar() {
  const { data: session } = useSession();
  return (
    <div className="flex flex-col gap-4 p-3">
      <Link href="/">
        <FaXTwitter className="w-16 h-16 cursor-pointer p-3 hover:bg-gray-100 rounded-full transition-all duration-200" />
      </Link>
      <Link
        href="/"
        className="flex items-center p-3 hover:bg-gray-100 rounded-full transition-all duration-200 gap-2 w-fit"
      >
        <HiHome className="w-7 h-7 " />{" "}
        <span className="font-bold hidden xl:inline">Home</span>
      </Link>
      {session ? (
        <button
          onClick={() => signOut()}
          className="font-semibold bg-blue-400 text-white rounded-full hover:brightness-95 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={() => signIn()}
          className="font-semibold bg-blue-400 text-white rounded-full hover:brightness-95 transition-all duration-200 w-48 h-9 shadow-md hidden xl:inline"
        >
          Sign In
        </button>
      )}
    </div>
  );
}
