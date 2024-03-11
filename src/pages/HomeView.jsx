import { useEffect, useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig.js";
import {
  setPersistence,
  signInWithEmailAndPassword,
  browserSessionPersistence,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { ref, set } from "firebase/database";
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
        localStorage.setItem("uid", JSON.stringify(user.uid));
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
        localStorage.setItem("uid", JSON.stringify(user.uid));
        navigate("/lobby");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  };

  const create = (event) => {
    event.preventDefault(); // ป้องกันการส่งแบบฟอร์ม

    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // ลงชื่อเข้าใช้เรียบร้อย
        const user = userCredential.user;
        localStorage.setItem("mail", JSON.stringify(user.email));
        localStorage.setItem("uid", JSON.stringify(user.uid));
        console.log(user.email);
        const usersRef = ref(db, "users/" + user.uid);
        set(usersRef, {
          email: user.email,
          score: 0,
        });
        
        navigate("/lobby");
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorCode, errorMessage);
      });
  

  };



  return (
    <div className="bg-gradient-to-tr from-indigo-800 via-purple-500 to-pink-400 h-screen">
      <div className="md:container md:mx-auto flex flex-col justify-center items-center h-screen">
        <h1 className="mb-3 text-white text-center tablet:text-5xl md:text-4xl sm2:text-1xl sm1:text-0xl font-display font-bold drop-shadow-3xl">
          TicTacToe AtomFight
        </h1>
        <div className="mb-3 text-white text-center tablet:text-1xl md:text-0xl sm2:text-xl sm1:text-xl font-display drop-shadow-3xl">
          <h2 className="">L O G I N</h2>

        </div>

        <div className="flex w-full justify-center item-center" >
          <form id="login-form" className="flex flex-col desktop:basis-3/6 laptop:basis-3/5 lg:basis-3/5 tablet:basis-5/6 md:basis-5/6 sm2:basis-3/5 mb-5 mt-5">
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              className="font-display tablet:text-base md:text-base sm2:text-sm sm1:text-sm mb-3 form-input border-white border-[3px] bg-transparent text-white placeholder-gray-100 p-2 rounded-[10px] shadow-white drop-shadow-3xl" 
              id="email"
              placeholder=" email"
            />
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              className="font-display tablet:text-base md:text-base sm2:text-sm sm1:text-sm mb-3 form-input border-white border-[3px] bg-transparent text-white placeholder-gray-100 p-2 rounded-[10px] shadow-white drop-shadow-3xl"
              id="password"
              placeholder=" password"
            />
            <div className="flex flex-row gap-3">
              <button
                className="mb-3 bg-black tablet:text-md text-white rounded-[10px] basis-2/4"
                id="login"
                onClick={login}
              >
                Login
              </button>
              <button
                className="mb-3 bg-black tablet:text-md  text-white py-3 rounded-[10px] basis-2/4"
                id="login"
                onClick={create}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default HomeView;
