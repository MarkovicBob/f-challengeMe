import axios from "axios";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";
import { BounceLoader } from "react-spinners";

function Welcome() {
  const [email, setEmail] = useState("");
  const [emailExist, setEmailExist] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    const emailRegex =
      /^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/;

    if (email.trim() === "") {
      toast.warning("The email field is empty !");
      return;
    } else if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email !");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.get(
        "https://challengeme-server-ra24.onrender.com/api/v1/users"
      );

      const users = response.data.data;
      const emails = users.map((element) => {
        return element.email;
      });
      if (emails.includes(email)) {
        toast.info("Email exist. Please enter your password.");
        setEmailExist(true);
      } else {
        setEmailExist(false);
      }
    } catch (error) {
      console.error("Error by checking email", error);
      toast.error("Server error. Please try again later");
      setEmailExist(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOrSignup = async () => {
    if (password.trim() === "") {
      toast.warning("Password field is empty");
      return;
    }
    setLoading(true);
    try {
      if (emailExist) {
        const res = await axios.post(
          "https://challengeme-server-ra24.onrender.com/api/v1/users/auth/login",
          {
            email,
            password,
          }
        );
        localStorage.setItem("token", res.data.token);
        toast.success("Logged in successfully!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        const res = await axios.post(
          "https://challengeme-server-ra24.onrender.com/api/v1/users/auth/signup",
          {
            email,
            password,
          }
        );
        localStorage.setItem("token", res.data.token);

        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      }
    } catch (error) {
      console.error(error);
      toast.error(
        error.response?.data?.message || "Error during authentication."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col min-h-screen items-center-safe justify-center-safe gap-5 m-auto">
        <img src={logo} alt="logo" className="w-50" />
        <h1>Welcome to Challenge ME</h1>
        <span className="bg-white rounded-md">
          <input
            type="email"
            placeholder="Your E-mail"
            className="placeholder-gray-500 p-2 text-black"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </span>
        {emailExist !== null && (
          <span className="bg-white rounded-md">
            <input
              type="password"
              placeholder={`${
                emailExist ? "Enter your password" : "Create new password"
              }`}
              className="placeholder-gray-500 p-2 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        )}
        {loading ? (<BounceLoader color="green" />) : (<><button
          className="bg-green-700 px-4 py-2 rounded-md cursor-pointer"
          onClick={emailExist === null ? handleNext : handleLoginOrSignup}
        >
          {emailExist === null
            ? "Next"
            : emailExist
            ? "Login"
            : "Signup"}
        </button></>) }
        <ToastContainer position="top-center" />
      </div>
    </>
  );
}

export default Welcome;
