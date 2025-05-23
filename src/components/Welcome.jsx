import CME from "../assets/challenge me - gray.png";
import axios from "axios";
import logo from "../assets/logo.png";
import { useState } from "react";
import { useNavigate } from "react-router";
import { BounceLoader } from "react-spinners";
import { toast } from "react-toastify";

function Welcome() {
  const [email, setEmail] = useState("");
  const [emailExist, setEmailExist] = useState(null);
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

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
        toast.info(`Hello ${email}. Please enter your password.`);
        setEmailExist(true);
      } else {
        setEmailExist(false);
      }
    } catch (error) {
      // console.error("Error by checking email", error);
      toast.error("Server error. Please try again later");
      setEmailExist(false);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginOrSignup = async (e) => {
    // console.log(e.target.value);

    if (password.trim() === "") {
      toast.warning("Password field is empty");
      return;
    }
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(password)) {
      toast.warning(
        "Password must be at least 8 characters, include one uppercase letter and one number"
      );
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
        const userId = res.data?.user?._id;
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("userId", userId);
        toast.success("Logged in successfully!");
        setTimeout(() => {
          navigate("/start/home");
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
        // console.log(res.data);
        const userId = res.data?.userObject?._id;
        localStorage.setItem("userId", userId);
        toast.success("Account created successfully!");
        setTimeout(() => {
          navigate("/start/home");
        }, 1500);
      }
    } catch (error) {
      // console.error(error);
      // Проверяем статус ошибки
      if (error.response?.status === 500) {
        toast.error("Wrong Password - please try again.");
      } else {
        toast.error(
          error.response?.data?.message ||
            "Server error. Please try again later."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const validatePassword = (e) => {
    const value = e.target.value;
    setPassword(value);
    const passwordRegex = /^(?=.*[A-Z]).{8,}$/;
    if (passwordRegex.test(value)) {
      setIsPasswordValid(true);
    } else {
      setIsPasswordValid(false);
    }
  };

  return (
    <>
      <div className="bg-[#292929] flex flex-col min-h-screen items-center-safe justify-center-safe gap-5 m-auto">
        <img src={logo} alt="logo" className="w-50" />
        <img src={CME} alt="challengeME" className="w-[10rem]" />
        {emailExist === false && (
          <p className="text-center text-white max-w-xs">
            Hey, looks like you're new here. Let's create an account...
          </p>
        )}
        <span className="bg-white rounded-md">
          {emailExist && email ? null : (
            <input
              type="email"
              placeholder="Your E-Mail"
              className="placeholder-gray-500 p-2 text-black inset-shadow-sm/30"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={emailExist !== null}
            />
          )}
        </span>
        {emailExist !== null && (
          <>
            <span className="bg-white rounded-md">
              <input
                type="password"
                placeholder={`${
                  emailExist ? "Enter your password" : "Create new password"
                }`}
                className="placeholder-gray-500 p-2 text-black "
                // value={password}
                onChange={validatePassword}
              />
            </span>
            <span className="text-center">
              {isPasswordValid || emailExist ? null : (
                <span>
                  Password must contain at least 8 characters. <br />
                  Password must contain at least one uppercase letter.
                </span>
              )}
            </span>
          </>
        )}
        {loading ? (
          <BounceLoader color="green" />
        ) : (
          <>
            <button
              className="bg-[#42A200] px-4 py-2 rounded-md cursor-pointer active:inset-ring-2 "
              onClick={emailExist === null ? handleNext : handleLoginOrSignup}
            >
              {emailExist === null ? "Next" : emailExist ? "Login" : "Signup"}
            </button>
          </>
        )}
      </div>
    </>
  );
}

export default Welcome;
