import { useState } from "react";
import { auth, db } from "../../firebase/firebaseConfig";
import { useNavigate } from "react-router-dom";
import { ref, onValue, update } from "firebase/database";

function JoinGameView() {
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
  return (
    <div>
      JoinGameView
      <input
        type="text"
        value={roomID}
        placeholder="Enter Room ID"
        onChange={e => setRoomID(e.target.value)}
      />
      <button onClick={joinGame}>Join Game</button>
    </div>
  );
}

export default JoinGameView;
