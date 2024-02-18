import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [warning, setWarning] = useState(false);
  const [valid, setValid] = useState(false);

  const navigate = useNavigate();

  const login = async (e) => {
    e.preventDefault();
    try {
      if (email !== "" && password !== "") {
        await axios
          .post(`${process.env.REACT_APP_API_URL}/api/v1/user/login`, {
            email,
            password,
          })
          .then((res) => {
            if (res.data.status === 200) {
              navigate("/");
              localStorage.setItem("user", JSON.stringify(res.data.userData));
              setEmail("");
              setPassword("");
            } else if (res.data.status === 404) {
              setWarning(true);
              setTimeout(() => {
                setWarning(false);
              }, 2500);
            }
          });
      } else {
        setValid(true);
        setTimeout(() => {
          setValid(false);
        }, 2000);
      }
    } catch (error) {
      setError(true);
      setTimeout(() => {
        setError(false);
      }, 2000);
    }
  };
  return (
    <>
      {warning ? (
        <div
          className="alert alert-danger fixed top-0 text-center"
          role="alert"
        >
          User doesn't Exist
        </div>
      ) : null}
      {error ? (
        <div
          className="alert alert-danger fixed top-0 text-center"
          role="alert"
        >
          Server problem
        </div>
      ) : null}
      {valid ? (
        <div
          className="alert alert-warning fixed top-0 text-center"
          role="alert"
        >
          Something is missing. Try again
        </div>
      ) : null}
      <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={login}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autocomplete="email"
                  required
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autocomplete="current-password"
                  required
                  className="pl-2 block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>

            <div>
              <button className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                Sign in
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
