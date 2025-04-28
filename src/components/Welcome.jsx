import axios from "axios";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import { ToastContainer, toast } from "react-toastify";

function Welcome() {
  const [email, setEmail] = useState("");
  const [emailExist, setEmailExist] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("No token found. Please log in or sign up.");
      return;
    }

    try {
      const response = await axios.get(
        "http://localhost:8000/api/v1/users/me",
        {
          headers: {
            Authorization: `Bearer ${token}`, // Добавляем токен в заголовок
          },
          withCredentials: true,
        }
      );

      console.log("User data:", response.data);
      toast.info("Email exist. Please enter your password.");
      setEmailExist(true);
    } catch (error) {
      console.error("Error by checking email", error);
      toast.error("Server error. Please try again later");
      setEmailExist(false);
    }
  };

  const handleLoginOrSignup = async () => {
    if (password.trim() === "") {
      toast.warning("Password field is empty");
      return;
    }
    try {
      if (emailExist) {
        const res = await axios.post(
          "http://localhost:8000/api/v1/users/auth/login",
          {
            email,
            password,
          }
        );
        localStorage.setItem("token", res.data.token); // Сохраняем токен
        toast.success("Logged in successfully!");
        setTimeout(() => {
          navigate("/home");
        }, 1500);
      } else {
        const res = await axios.post(
          "http://localhost:8000/api/v1/users/auth/signup",
          {
            email,
            password,
          }
        );
        localStorage.setItem("token", res.data.token); // Сохраняем токен
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
              placeholder="Your Password"
              className="placeholder-gray-500 p-2 text-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </span>
        )}
        <button
          className="bg-green-700 px-4 py-2 rounded-md cursor-pointer"
          onClick={emailExist === null ? handleNext : handleLoginOrSignup}
        >
          {emailExist === null ? "Next" : emailExist ? "Login" : "Signup"}
        </button>
        <ToastContainer position="top-center" />
      </div>
    </>
  );
}

export default Welcome;
