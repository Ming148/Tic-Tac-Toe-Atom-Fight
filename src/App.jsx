import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeView from "./pages/HomeView";
import GameView from "./pages/GameView";
import LobbyView from "./pages/LobbyView";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<HomeView />} />
        <Route path="game/:id" element={<GameView />} />
        <Route path="lobby" element={<LobbyView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
