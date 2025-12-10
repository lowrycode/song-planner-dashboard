import React from "react";

function LoginForm() {
  return (
    <>
      <h1 className="text-4xl font-bold text-purple-950 text-center">
        Welcome
      </h1>
      <p className="text-gray-600 text-center text-sm">
        Login with your credentials
      </p>
      <form className="flex flex-col mt-5">
        <label htmlFor="username" className="text-purple-950 font-semibold">
          Username
        </label>
        <input
          type="text"
          name="username"
          id="username"
          className="py-1 px-2 border border-purple-950"
        />
        <label
          htmlFor="password"
          className="text-purple-950 font-semibold mt-2"
        >
          Password
        </label>
        <input
          type="password"
          name="password"
          id="password"
          className="py-1 px-2 border border-purple-950"
        />
        <button
          type="submit"
          className="bg-purple-900 mt-3 px-3 py-1 text-gray-50"
        >
          Log In
        </button>
        <p className="mt-3 text-end">Don't have an account? <a href="#" className="font-semibold text-purple-950">Sign up now</a></p>
      </form>
    </>
  );
}

export default LoginForm;
