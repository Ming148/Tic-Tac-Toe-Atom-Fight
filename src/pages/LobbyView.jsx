import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { ref, onValue, update, set } from "firebase/database";
import { useState } from "react";

function LobbyView() {
  const navigate = useNavigate();
  const [roomID, setRoomID] = useState("");
  const joinGame = () => {
    console.log("roomID", roomID);
    const roomListRef = ref(db, "Rooms/" + roomID);
    return onValue(roomListRef, (snapshot) => {
      const data = snapshot.val();
      if (snapshot.exists() && data !== null) {
        if (data.player2 === "") {
          update(roomListRef, {
            player2: auth.currentUser.email,
            uidPlayer2: auth.currentUser.uid,
          }).then(() => {
            navigate("/game/" + roomID);
          });
        } else {
          alert("Room is full");
        }
      } else {
        alert("Room not found");
      }
    });
  };

  const createRoom = () => {
    const roomListRefUID = ref(db, "Rooms/" + auth.currentUser.uid); // อ้างถึง Rooms ใน Database
    set(roomListRefUID, {
      name: "Room 1",
      player1: auth.currentUser.email,
      player2: "",
      board: Array(9).fill({
        name: "",
        color: "gray-200",
      }),
      status: "Player 1's turn",
      currentPlay: "Player 1",
      uidPlayer1: auth.currentUser.uid,
      uidPlayer2: "",
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        navigate("/game/" + auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });
  };

  return (
    <div className="flex flex-col bg-gradient-to-tr from-indigo-800 via-purple-500 to-pink-400 h-screen">
        <nav className="bg-zinc-950 opacity-90 p-3 flex flex-row justify-end gap-5">
          <buttton className="text-white text-base"
            onClick={() => {
              navigate("/leaderboard");
            }}
          >
            Leaderboard
          </buttton>
          <buttton className="text-white opacity-75 text-base"
            onClick={() => {
              auth.signOut();
              navigate("/");
            }}
          >
            Logout
          </buttton>
        </nav>
      <div className="md:container md:mx-auto flex flex-col h-screen items-center justify-center">
        <div className="flex flex-col">
          <h1 className="text-white tracking-widest tablet:text-3xl md:text-2xl sm2:text-1xl sm1:text-0xl font-display font-bold drop-shadow-3xl">
            TicTacToe AtomFight
          </h1>
          <div className="flex flex-row justify-between mb-3 text-white font-display">
            <div className="tracking-widest text-0xl tablet:text-xl md:text-xl sm2:text-xl">Lobby</div>
            <button className="tracking-widest text-xl tablet:text-base md:text-sm sm2:text-sm hover:underline" onClick={() => createRoom()}>Create Room</button>
          </div>
          <div className="w-full h-px mt-5 bg-white"></div>
          <div className="flex flex-row mt-5 items-center gap-8">
            <h2 className="text-white text-xl font-display tablet:text-base md:text-base sm2:text-base">JoinGame</h2>
            <div className="flex flex-row gap-3">
              <input type="text" value={roomID} placeholder="Enter Room ID"
              className="rounded-[5px] font-display px-3 text-base tablet:text-sm md:text-sm sm2:text-sm"
              onChange={(e) => setRoomID(e.target.value)}/>
              <button onClick={joinGame} className="text-white text-base tablet:text-sm md:text-sm sm2:text-sm bg-black rounded-[5px] font-display px-8 py-2">Join</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LobbyView;
