import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { db } from "../../firebase/firebaseConfig";
import { ref, onValue, update, set, get } from "firebase/database";
import "./GameView.css";
import elemental from "../../firebase/elemental";

function GameView() {
  const cardStyle =
    "flex md:p-6 sm2:p-4 sm1:p-4 justify-center items-center cursor-pointer rounded-[5px] text-base md:text-sm  sm2:text-sm1 sm1:text-sm1 font-display";
  const { id } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const identity = JSON.parse(localStorage.getItem("mail"));

  const [board, setBoard] = useState(null);

  const [cardPlayer1, setCardPlayer1] = useState(null);
  const [cardPlayer2, setCardPlayer2] = useState(null);
  const [playerInRoom, setPlayerInRoom] = useState(null);
  const [uidPlayerInRoom, setUidPlayerInRoom] = useState(null);
  const [status, setStatus] = useState(null);
  const [currentCard, setCurrentCard] = useState(null);
  const [player, setPlayer] = useState("");
  const [win, setWin] = useState(false);

  // สร้างการ์ด
  const createCard = async () => {
    const shuffledElemental = [...elemental].sort(() => Math.random() - 0.5);
    const roomListRefUID = ref(db, "Rooms/" + id);
    //แบ่งการ์ดให้ 2 คน

    const card1 = shuffledElemental.slice(0, 6);
    const card2 = shuffledElemental.slice(6, 12);

    card1.forEach((card) => {
      card.owner = "Player 1";
      card.disabled = false;
    });
    card2.forEach((card) => {
      card.owner = "Player 2";
      card.disabled = false;
    });
    // console.log("card1", card1);
    // console.log("card2", card2);
    await setCardPlayer1([...card1]);
    await setCardPlayer2([...card2]);
    update(roomListRefUID, {
      cardPlayer1: card1,
      cardPlayer2: card2,
    });
  };
  useEffect(() => {
    const roomListRefUID = ref(db, "Rooms/" + id);
    return onValue(roomListRefUID, (snapshot) => {
      const data = snapshot.val();

      if (snapshot.exists() && data !== null) {
        setIsLoading(false);
        setPlayerInRoom([data.player1, data.player2]);
        setUidPlayerInRoom([data.uidPlayer1, data.uidPlayer2]);
        setStatus(data.status);
        setPlayer(data.currentPlay);
        setBoard(Array.from(data.board));
        if (data.cardPlayer1 === undefined || data.cardPlayer2 === undefined) {
          createCard();
        } else {
          setCardPlayer1(data.cardPlayer1);
          setCardPlayer2(data.cardPlayer2);
        }
      }
    });
  }, [id, cardPlayer1, cardPlayer2, board]);

  // อัพเดทสถานะเกม
  useEffect(() => {
    // ตรวจสอบว่ามีผู้ชนะหรือยัง
    if (board !== null) {
      if (checkWinner()) {
        // Swal.fire("You win!", "", "success");

        setStatus(player + " win!");
        setWin(true);
      } else {
        if (player === "Player 1") {
          setStatus("Player 2's turn");
          setPlayer("Player 2");
        } else {
          setStatus("Player 1's turn");
          setPlayer("Player 1");
        }
      }
    }
  }, [board, cardPlayer1, cardPlayer2]);

  useEffect(() => {
    if (win) {
      console.log(" บวกคะแนน");
      let uidWin =
        player === "Player 1" ? uidPlayerInRoom[0] : uidPlayerInRoom[1];
      let mailWin = player === "Player 1" ? playerInRoom[0] : playerInRoom[1];
      const usersRef = ref(db, "users/" + uidWin);
      get(usersRef)
        .then((snapshot) => {
          const data = snapshot.val();
          if (data.score == null) {
            let score = 0;
            set(usersRef, {
              email: mailWin,
              score: score + 1,
            });
          }
          set(usersRef, {
            email: mailWin,
            score: data.score + 1,
          });
        })
        .catch((error) => {
          console.error("Error updating document: ", error);
        });
    }
  }, [win]);

  const updateGame = async (
    board,
    player,
    status,
    cardPlayer1,
    cardPlayer2
  ) => {
    const roomListRefUID = ref(db, "Rooms/" + id);
    try {
      await update(roomListRefUID, {
        board: board,
        currentPlay: player,
        status: status,
        cardPlayer1: cardPlayer1,
        cardPlayer2: cardPlayer2,
      });

      //   console.log("Game state reset successfully!");
    } catch (error) {
      console.error("Error resetting game state: ", error);
    }
  };

  //เลือกการ์ด
  const selectedCard = (card) => {
    // ตรวจสอบว่าเป็นการเล่นของผู้เล่นที่เป็นคิวของผู้ใช้หรือไม่

    //ใช้เพื่อเช็คว่าการ์ดนั้นๆถูก disable หรือยัง
    if (card.disabled) {
      Swal.fire({
        title: "This card is already used",
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://sweetalert2.github.io/images/nyan-cat.gif")
                      left top
                      no-repeat
                      `,
      });
      return;
    }

    //set ค่าเพื่อเอาเขียนบน board
    setCurrentCard(card);
  };
  // //เลือก cell บน board
  const handleCellClick = (index) => {
    // เช็คว่ามีการ์ดที่ถูกเลือกไว้หรือยัง
    if (currentCard === null) {
      Swal.fire({
        title: "Please select a card first!",
        width: 600,
        padding: "3em",
        color: "#716add",
        backdrop: `
                      rgba(0,0,123,0.4)
                      url("https://sweetalert2.github.io/images/nyan-cat.gif")
                      left top
                      no-repeat
                      `,
      });
      return;
    }
    //////////////////////////////////////////////////////////////////////////////////////////////////////////
    //เช็คว่ามีการ์ดอยู่บน board หรือยัง
    if (board[index] !== null && board[index].name !== "") {
      Swal.fire({
        title:
          board[index].name +
          " มีค่าatomมากกว่า " +
          currentCard.name +
          " หรือไม่", // ชื่อการ์ดที่ถูกเลือก
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "ใช่",
        denyButtonText: `ไม่`,
      }).then((result) => {
        if (result.isConfirmed) {
          if (board[index].atomicNumber > currentCard.atomicNumber) {
            Swal.fire("You are right!", "", "success");
            board[index] = currentCard;
            disabledCard(player, currentCard);
            setCurrentCard(null);
            updateGame(board, player, status, cardPlayer1, cardPlayer2);
          } else {
            Swal.fire("You are wrong!", "", "error");
            disabledCard(player, currentCard);
            setCurrentCard(null);
            updateGame(board, player, status, cardPlayer1, cardPlayer2);
          }
        } else if (result.isDenied) {
          if (board[index].atomicNumber < currentCard.atomicNumber) {
            Swal.fire("You are right!", "", "success");
            board[index] = currentCard;
            disabledCard(player, currentCard);
            setCurrentCard(null);
            updateGame(board, player, status, cardPlayer1, cardPlayer2);
          } else {
            Swal.fire("You are wrong!", "", "error");
            disabledCard(player, currentCard);
            setCurrentCard(null);
            updateGame(board, player, status, cardPlayer1, cardPlayer2);
          }
        }
      });
    } else {
      //เขียนการ์ดลงบน board
      board[index] = currentCard;
      //disable การ์ดที่ใช้แล้ว
      disabledCard(player, currentCard);
      //set การเลือกการ์ดเป็น null
      setCurrentCard(null);
    }

    updateGame(board, player, status, cardPlayer1, cardPlayer2);
  };
  // //reset เกม
  const resetGame = () => {
    setWin(false);
    updateGame(
      Array(9).fill({ name: "" }),
      "Player 2",
      "Player 2's turn",
      null,
      null
    );
  };

  // //fucntion ย่อย

  const disabledCard = (player, card) => {
    console.log("disabledCard ทำงาน");
    for (let i = 0; i < cardPlayer1.length; i++) {
      if (player === "Player 1") {
        if (cardPlayer1[i].name === card.name) {
          cardPlayer1[i].disabled = true;
        }
      } else {
        if (cardPlayer2[i].name === card.name) {
          cardPlayer2[i].disabled = true;
        }
      }
    }
    card.disabled = true;
  };

  const checkWinner = () => {
    // Winning combinations
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];
    for (let line of lines) {
      const [a, b, c] = line;

      if (board[a].owner && board[b].owner && board[c].owner) {
        if (
          board[a].owner === board[b].owner &&
          board[a].owner === board[c].owner
        ) {
          return true;
        }
      }
    }

    return false;
  };

  return (
    <div className="bg-gradient-to-tr from-indigo-800 via-purple-500 to-pink-400">
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="flex flex-col h-screen justify-center gap-5">
          <div className="flex flex-col justify-center items-center">
            <h1 className="text-white  md:text-5xl  sm2:text-3xl font-display font-bold drop-shadow-3xl">
              Elemental XO
            </h1>
            <div className="flex gap-3">
              <h2 className="text-white md:text-base  sm2:text-sm font-display drop-shadow-3xl font-bold">
                ROOM ID
              </h2>
              <h2 className="text-white md:text-base  sm2:text-sm font-display ">{id}</h2>
            </div>
          </div>
          <div className="flex">
            <div className="flex flex-col flex-1 justify-center items-center gap-3">
              <h2 className="text-white   md:text-xl  sm2:text-md font-display font-bold drop-shadow-3xl">
                {status}
              </h2>
              <div className="flex flex-col">
                <div className="flex gap-3">
                  <h2 className="text-white text-base md:text-base  sm2:text-sm1 font-display">
                    Player 1
                  </h2>
                  <h2 className="text-white text-base md:text-base  sm2:text-sm1 font-display">
                    {playerInRoom[0]}
                  </h2>
                </div>
                <div className="flex gap-3">
                  <h2 className="text-white text-base md:text-base sm2:text-sm1 font-display">
                    Player 2
                  </h2>
                  <h2 className="text-white text-base md:text-base  sm2:text-sm1 font-display">
                    {playerInRoom[1] == ""
                      ? "waiting for someone"
                      : playerInRoom[1]}
                  </h2>
                </div>
              </div>
            </div>
            {/* board tic tac toe */}
            <div className="board shrink-0 ">
              {board.map((card, index) => {
                return (
                  <div
                    key={index}
                    className={`${cardStyle} ${
                      card.owner === "Player 1"
                        ? "bg-black text-white"
                        : "bg-white text-black"
                    }`}
                    onClick={() => handleCellClick(index)}
                  >
                    {card.name}
                  </div>
                );
              })}
            </div>
            <div className="flex-1"></div>
          </div>

          {/* /////////////////////////////// */}
          <div className="flex justify-center">
            <h2 className="flex flex-1 justify-center items-center text-white text-xl md:text-base  sm2:text-base font-display">
              Yor are {identity == playerInRoom[0] ? "Player 1" : "Player 2"}
            </h2>
            {identity == playerInRoom[0] ? (
              <div className="board shrink-0">
                {cardPlayer1.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className={`${cardStyle} ${
                        card.owner === "Player 1"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } ${card.disabled ? " bg-black opacity-75" : ""} `}
                      //disable on click ถ้าไม่ใช่ตาของผู้เล่น
                      onClick={
                        player == "Player 1"
                          ? () => selectedCard(card)
                          : () => {
                              alert("Not your turn");
                            }
                      }
                    >
                      {card.name}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="board shrink-0">
                {cardPlayer2.map((card, index) => {
                  return (
                    <div
                      key={index}
                      className={`${cardStyle} ${
                        card.owner === "Player 1"
                          ? "bg-black text-white"
                          : "bg-white text-black"
                      } ${card.disabled ? " bg-black opacity-75" : ""} `}
                      //disable on click ถ้าไม่ใช่ตาของผู้เล่น
                      onClick={
                        player == "Player 2"
                          ? () => selectedCard(card)
                          : () => {
                              alert("Not your turn");
                            }
                      }
                    >
                      {card.name}
                    </div>
                  );
                })}
              </div>
            )}
            <div className="flex-1 flex justify-center items-center">
              <button
                className="bg-purple-950 text-white p-3 md:px-10 sm2:px-8 md:text-sm  sm2:text-sm1 font-display rounded-[20px] "
                onClick={resetGame}
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default GameView;
