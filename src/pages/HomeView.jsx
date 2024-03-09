import React, { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";



function HomeView() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();
  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        localStorage.setItem("mail", JSON.stringify(user.email));
        navigate("/lobby");
      } else {
        console.log("no user");
      }
    });
  }, []);

  const login = (event) => {
    event.preventDefault(); // ป้องกันการส่งแบบฟอร์ม

    setPersistence(auth, browserSessionPersistence)
      .then(() => {
        return signInWithEmailAndPassword(auth, email, password);
      })
      .then((userCredential) => {
        // ลงชื่อเข้าใช้เรียบร้อย
        const user = userCredential.user;
        localStorage.setItem("mail", JSON.stringify(user.email));
        navigate("/lobby");

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  return (
    <div className="bg-gradient-to-tr from-indigo-500 via-purple-500 to-pink-500 h-screen w-full flex justify-center items-center">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
        <div className="col-span-1 flex-col justify-center items-center">
          <div className="card-header mt-5">
            <h1 className="text-white text-center  shadow-white">
              ELEMENTAL XO
            </h1>
          </div>
          <div className="col-span-1 md:col-span-2 flex justify-center items-center">
            <img src="../assets/line_left.svg" alt="" />
            <h2 className="mt-5 mb-5 text-white text-5xl">L O G I N</h2>
            <img src="../assets/line_right.svg" alt="" />
          </div>
        </div>

        <div className="col-span-1  flex justify-center  w-full">
          <form id="login-form">
            <div className="mb-3">
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                className="form-input border-white border-[3px] bg-transparent text-white placeholder-slate-400 p-2 rounded-[10px] shadow-white"
                id="email"
                placeholder=" email"
              />
            </div>
            <div className="mb-5">
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
                className="form-input border-white border-[3px] bg-transparent text-white placeholder-slate-400 p-2 rounded-[10px] shadow-white"
                id="password"
                placeholder=" password"
              />
            </div>
            <div className="mb-3">
              <button
                className="btn bg-black text-white px-4 py-2 rounded "
                id="login"
                onClick={login}
              >
                Login
              </button>
            </div>
            <div className="mb-3">
              <span className="text-white">Not have an account?</span>
              <a
                href="/register"
                className="btn btn-link text-white btnRegister"
              >
                Register
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
