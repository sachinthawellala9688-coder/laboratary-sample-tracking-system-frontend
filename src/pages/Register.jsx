import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const [firstname, setfirstname] = useState();
  const [lastname, setlastname] = useState();
  const [userid, setuserid] = useState();
  const [email, setemail] = useState();
  const [position, setposition] = useState();
  const [password, setpassword] = useState();
  const [confirmpassword, setconfirmpassword] = useState();
  const [message, setmessage] = useState();
  const [alert, setAlert] = useState(""); // New state for alert
  const navigate = useNavigate(); // useNavigate hook for redirecting

  // Password match check
  function checkpassword(e) {
    const value = e.target.value;
    setconfirmpassword(value);
    if (password !== value) {
      setmessage("Passwords do not match");
    } else {
      setmessage("");
    }
  }

  // Handle form submission (register logic)
  async function handleRegister(e) {
    e.preventDefault();

    // Example request payload (adjust as needed)
    const newUser = {
      user_id: userid,
      first_name: firstname,
      last_name: lastname,
      email: email,
      password: password,
      role: position,
    };

    try {
      // Make API request to register user (adjust URL)
      const response = await fetch("http://localhost:3000/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newUser),
      });

      const data = await response.json();

      if (response.ok) {
        setAlert("Registration successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/"); // Navigate to the login page
        }, 2000); // Wait for 2 seconds before navigating
      } else {
        setAlert(data.error || "Something went wrong!");
      }
    } catch (error) {
      setAlert("An error occurred during registration");
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
        <div className="w-[500px] h-[650px] backdrop-blur shadow-2xl rounded-3xl flex items-center justify-center flex-wrap py-[45px] gap-x-[30px] bg-white/30">
          <div className="w-full flex items-center flex-col">
            <h1 className="font-bold text-[30px]">REGISTER</h1>
            <h2 className="mb-[5px]">
              already have an account?{" "}
              <Link to="/" className="italic text-accent">
                log in
              </Link>
            </h2>
          </div>

          <input
            type="text"
            placeholder="First name"
            value={firstname}
            className="w-[42%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
              setfirstname(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="Last name"
            value={lastname}
            className="w-[42%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
              setlastname(e.target.value);
            }}
          />

          <input
            type="text"
            placeholder="User ID"
            value={userid}
            className="w-[42%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
              setuserid(e.target.value);
            }}
          />

                    <select
            className="w-[42%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
                setposition(e.target.value);
            }}
            value={position}
            >
            <option value="" disabled selected>
                Select Position
            </option>
            <option value="Lab Technician">Lab Technician</option>
            <option value="Manager">Manager</option>
            </select>

          <input
            type="email"
            placeholder="Email"
            value={email}
            className="w-[88%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
              setemail(e.target.value);
            }}
          />

          <input
            type="password"
            placeholder="password"
            value={password}
            className="w-[42%] h-[50px] p-[10px] text-[20px] mb-[20px] border-2 border-secondary rounded-lg"
            onChange={(e) => {
              setpassword(e.target.value);
            }}
          />
          <div className="w-[42%]">
            <input
              type="password"
              placeholder="confirm password"
              value={confirmpassword}
              className="w-full h-[50px] p-[10px] text-[20px] border-2 border-secondary rounded-lg"
              onChange={checkpassword}
            />
            <p className="w-full h-[20px] text-red-500">{message}</p>
          </div>

          {alert && <p className="text-green-500">{alert}</p>} {/* Display alert */}

          <button
            className="h-[50px] w-full bg-accent rounded-lg font-bold text-primary text-[20px] hover:bg-transparent hover:text-secondary border-2 border-accent mx-6"
            onClick={handleRegister}
          >
            SIGN UP
          </button>
        </div>
      </div>
    </div>
  );
}
