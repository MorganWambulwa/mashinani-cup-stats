import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Players from "./pages/Players";
import Payments from "./pages/Payments";
import LeaderboardPage from "./pages/LeaderboardPage";
import Admin from "./pages/Admin";
import NotFound from "./pages/NotFound";
import { usePlayerData } from "./hooks/usePlayerData";
import { useState } from "react";

const queryClient = new QueryClient();

const AppContent = () => {
  const { players, loading, updateGameweekData, updatePayment, deleteManager } = usePlayerData();
  const [currentGameweek, setCurrentGameweek] = useState(1);

  const getCurrentGameweekWinner = () => {
    let maxNetPoints = -Infinity;
    let winner = null;

    players.forEach(player => {
      const currentGWData = player.gameweekHistory.find(gw => gw.gameweek === currentGameweek);
      if (currentGWData && currentGWData.netPoints > maxNetPoints) {
        maxNetPoints = currentGWData.netPoints;
        winner = player;
      }
    });

    return winner;
  };

  const winner = getCurrentGameweekWinner();

  if (loading) {
    return null; // Loading handled in Index
  }

  return (
    <Routes>
      <Route path="/" element={<Index players={players} currentGameweek={currentGameweek} winner={winner} updatePayment={updatePayment} updateGameweekData={updateGameweekData} deleteManager={deleteManager} onGameweekChange={setCurrentGameweek} />} />
      <Route path="/payments" element={<Index players={players} currentGameweek={currentGameweek} winner={winner} updatePayment={updatePayment} updateGameweekData={updateGameweekData} deleteManager={deleteManager} onGameweekChange={setCurrentGameweek} />} />
      <Route path="/leaderboard" element={<Index players={players} currentGameweek={currentGameweek} winner={winner} updatePayment={updatePayment} updateGameweekData={updateGameweekData} deleteManager={deleteManager} onGameweekChange={setCurrentGameweek} />} />
      <Route path="/admin" element={<Index players={players} currentGameweek={currentGameweek} winner={winner} updatePayment={updatePayment} updateGameweekData={updateGameweekData} deleteManager={deleteManager} onGameweekChange={setCurrentGameweek} />} />
      {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
