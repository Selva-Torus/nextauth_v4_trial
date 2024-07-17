"use client";
import { signIn } from "next-auth/react";
import React, { useState } from "react";

const Login = () => {
  const [state, setState] = useState({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault(); // Prevent the default form submission behavior
    try {
      const result = await signIn("credentials", {
        ...state,
        redirect: false, // Prevent automatic redirection
        callbackUrl: "/torus"
      });
      
      if (result?.error) {
        alert("Invalid credentials. Please try again.");
      } else {
        // Redirect to the callback URL if sign-in is successful
        window.location.href = "/torus";
      }
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    }
  };

  const handleSocial = async(social : "github"|"google") => {
    const result = await signIn(social, {
      redirect: false,
      callbackUrl: "/torus"
    })
    console.log(result);
    
    // if (result?.error) {
    //   alert("Error occured during login. Please try again.");
    // } else {
    //   // Redirect to the callback URL if sign-in is successful
    //   window.location.href = "/torus";
    // }
  }

  return (
    <div className="w-full h-screen flex justify-center items-center">
      <div className="flex flex-col gap-3">
        <input
          className="p-2 border focus:outline-none"
          type="text"
          name="username"
          onChange={handleChange}
        />
        <input
          className="p-2 border focus:outline-none"
          type="password"
          name="password"
          onChange={handleChange}
        />
        <button
          className="p-2 border focus:outline-none"
          type="submit"
          onClick={handleSubmit}
        >
          login
        </button>
        <div className="w-full flex gap-2">
        <button
          className="p-2 border focus:outline-none w-1/2"
          type="submit"
          onClick={()=> handleSocial("google")}
        >
          Google
        </button>
        <button
          className="p-2 border focus:outline-none w-1/2"
          type="submit"
          onClick={()=>handleSocial("github")}
        >
          Github
        </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
