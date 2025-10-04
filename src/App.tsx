import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
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
      <Route path="/auth" element={<Auth />} />
      <Route path="/*" element={<Index players={players} currentGameweek={currentGameweek} winner={winner} updatePayment={updatePayment} updateGameweekData={updateGameweekData} deleteManager={deleteManager} onGameweekChange={setCurrentGameweek} />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
