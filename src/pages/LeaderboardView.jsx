import { useEffect, useState } from "react";
import { ref, onValue } from "firebase/database";
import { db } from "../../firebase/firebaseConfig";

function LeaderboardView() {
  const usersRef = ref(db, "users");
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const unsubscribe = onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        let convertToArray = Object.keys(data).map((key) => {
          return { id: key, ...data[key] }; // Include the user ID in the object
        });
        convertToArray.sort((a, b) => b.score - a.score);
        setUsers(convertToArray);
      } else {
        setUsers([]); // Set users to an empty array if there's no data
      }
    });

    // Cleanup function
    return () => unsubscribe();
  }, []);

  return (
    <div className="bg-gradient-to-tr from-indigo-800 via-purple-500 to-pink-400 h-screen">
        <div className="md:container md:mx-auto flex flex-col h-screen justify-center">
          <div className="flex flex-col md:mb-10 sm1:mb-5">
            <h1 className=" text-white desktop:text-5xl laptop:text-5xl tablet:text-3xl lg:text-5xl md:text-1xl sm2:text-0xl sm1:text-xl font-display font-bold drop-shadow-3xl">TicTacToe AtomFight</h1>
            <h2 className=" text-white desktop:text-2xl laptop:text-2xl tablet:text-0xl lg:text-2xl md:text-xl sm2:text-xl sm1:text-base font-display drop-shadow-4xl">Leaderboard</h2>
          </div>
          <div className="flex overflow-y-scroll scrollbar-thin scrollbar-thumb scrollbar-track bg-zinc-950 rounded-[10px]">
            <div className="flex flex-col text-white gap-3 py-10 p-5 w-full">
              {users.map((user) => (
                // cardPlayer
                <div key={user.id} className="flex flex-row justify-between md:mx-10 sm1:mx-0 desktop:text-md laptop:text-md tablet:text-md lg:text-md md:text-sm sm2:text-sm sm1:text-sm">
                    <div className="desktop:text-md laptop:text-md tablet:text-md lg:text-md md:text-sm sm2:text-sm sm1:text-sm">{user.email}</div>
                    <div className="desktop:text-md laptop:text-md tablet:text-md lg:text-md md:text-sm sm2:text-sm sm1:text-sm">{user.score}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
    </div>
  );
}

export default LeaderboardView;
