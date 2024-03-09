import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase/firebaseConfig.js";
import { ref, set } from "firebase/database";
import { onValue, update } from "firebase/database";
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
    })
      .then((docRef) => {
        console.log("Document written with ID: ", docRef);
        navigate("/game/" + auth.currentUser.uid);
      })
      .catch((error) => {
        console.error("Error adding document: ", error);
      });

    navigate("/game");
  };
  

  return (
    <div>
      <div>LobbyView</div>
      <button onClick={() => createRoom()}>Create Room</button>
      <div>
        JoinGameView
        <input
          type="text"
          value={roomID}
          placeholder="Enter Room ID"
          onChange={(e) => setRoomID(e.target.value)}
        />
        <button onClick={joinGame}>Join Game</button>
      </div>
    </div>
  );
}

export default LobbyView;
