import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  // Handle login submission
  async function handleLogin(e) {
    e.preventDefault();

    const loginData = {
      user_id: userId,
      password: password,
    };

    try {
      // API request to authenticate the user
      const response = await fetch("http://localhost:3000/user/loginuser", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        setAlertMessage("Login successful! Redirecting...");

        // Store JWT token in localStorage or state (adjust based on your implementation)
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        

        // Redirect to the appropriate page based on user role
        if (data.user.role === "manager") {
          navigate("/admin"); // Admin page
        } else {
          navigate("/user"); // User page
        }
      } else {
        setAlertMessage(data.error || "Login failed!");
      }
    } catch (error) {
      setAlertMessage("An error occurred during login");
      console.error(error);
    }
  }

  return (
    <div className="w-full h-screen bg-[url('/bg.jpg')] bg-center bg-cover bg-no-repeat flex">
      <div className="w-[50%] h-full flex justify-center items-center flex-col pb-[120px]">
        <h1 className="text-[50px] font-bold text-secondary">Track. Test. Trust</h1>
        <h2 className="text-[20px] italic font-bold mt-[20px] shadow-2xl">
          Your Complete Laboratory Sample Management Solution
        </h2>
      </div>
      <div className="w-[50%] h-full flex items-center justify-center">
        <div className="w-[500px] h-[650px] backdrop-blur shadow-2xl rounded-3xl flex items-center justify-center flex-col p-[45px] bg-white/30">
          <h1 className="font-bold text-[30px]">LOGIN</h1>
          <h2 className="mb-[20px] pb-[10px]">
            New user?{" "}
            <Link to="/register" className="italic text-accent">
              Sign up
            </Link>
          </h2>
          <input
            type="text"
            placeholder="User ID"
            className="w-full h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            className="h-[50px] w-full bg-accent rounded-lg font-bold text-primary text-[20px] hover:bg-transparent hover:text-secondary border-2 border-accent"
            onClick={handleLogin}
          >
            LOGIN
          </button>
          <p className="w-full text-left">
            <Link to="#" className="italic text-red-500">
              Forget password
            </Link>
          </p>
          {alertMessage && (
            <p
              className={`w-full mt-3 text-center ${
                alertMessage.includes("successful")
                  ? "text-green-500"
                  : "text-red-500"
              }`}
            >
              {alertMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
