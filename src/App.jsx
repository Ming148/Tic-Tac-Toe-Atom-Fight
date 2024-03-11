import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from "./pages/HomeView";
import GameView from "./pages/GameView";
import LobbyView from "./pages/LobbyView";
import JoinGameView from "./pages/JoinGameView";
import LeaderboardView from "./pages/LeaderboardView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomeView />} />
        <Route path="game/:id" element={<GameView />} />
        <Route path="lobby" element={<LobbyView />} />
        <Route path="join" element={<JoinGameView />} />
        <Route path="leaderboard" element={<LeaderboardView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
