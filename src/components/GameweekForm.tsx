import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, Download } from 'lucide-react';
import { Player } from '@/types';
import { toast } from 'sonner';

interface GameweekFormProps {
  players: Player[];
  onUpdatePlayers: (players: Player[]) => void;
  onDeleteManager: (manager: string) => void;
  currentGameweek: number;
  onGameweekChange: (gameweek: number) => void;
}

export const GameweekForm = ({ players, onUpdatePlayers, onDeleteManager, currentGameweek, onGameweekChange }: GameweekFormProps) => {
  const [gameweekData, setGameweekData] = useState<Record<string, { points: number; transferPoints: number }>>({});

  const handleGameweekChange = (gameweek: string) => {
    const gwNumber = parseInt(gameweek);
    onGameweekChange(gwNumber);
    // Initialize form data for selected gameweek
    const initialData: Record<string, { points: number; transferPoints: number }> = {};
    players.forEach(player => {
      const existingData = player.gameweekHistory.find(gw => gw.gameweek === gwNumber);
      initialData[player.manager] = {
        points: existingData?.points || 0,
        transferPoints: existingData?.transferPoints || 0
      };
    });
    setGameweekData(initialData);
  };

  const handleInputChange = (manager: string, field: 'points' | 'transferPoints', value: string) => {
    setGameweekData(prev => ({
      ...prev,
      [manager]: {
        ...prev[manager],
        [field]: parseInt(value) || 0
      }
    }));
  };

  const handleSubmit = () => {
    const updatedPlayers = players.map(player => {
      const data = gameweekData[player.manager];
      if (!data) return player;

      // Remove existing data for this gameweek
      const filteredHistory = player.gameweekHistory.filter(gw => gw.gameweek !== currentGameweek);
      
      // Add new gameweek data
      const newGameweekData = {
        gameweek: currentGameweek,
        points: data.points,
        transferPoints: data.transferPoints,
        netPoints: data.points - data.transferPoints
      };

      const newHistory = [...filteredHistory, newGameweekData].sort((a, b) => a.gameweek - b.gameweek);

      // Recalculate totals
      const totalPoints = newHistory.reduce((sum, gw) => sum + gw.points, 0);
      const totalTransferPoints = newHistory.reduce((sum, gw) => sum + gw.transferPoints, 0);
      const netPoints = totalPoints - totalTransferPoints;

      return {
        ...player,
        gameweekHistory: newHistory,
        totalPoints,
        transferPoints: totalTransferPoints,
        netPoints
      };
    });

    // Calculate wins
    const playersWithWins = updatedPlayers.map(player => {
      const wins = player.gameweekHistory.length; // This should be calculated properly by checking who won each gameweek
      return { ...player, wins };
    });

    onUpdatePlayers(playersWithWins);
    toast.success(`Gameweek ${currentGameweek} updated successfully!`);
  };

  const exportToCSV = () => {
    const headers = ['Manager', 'Total Points', 'Transfer Points', 'Net Points', 'Wins'];
    const rows = players.map(player => [
      player.manager,
      player.totalPoints,
      player.transferPoints,
      player.netPoints,
      player.wins
    ]);

    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `mashinani-league-cup-gw${currentGameweek}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    toast.success('Data exported successfully!');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="font-orbitron">Update Gameweek Scores</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <Label htmlFor="gameweek">Select Gameweek</Label>
            <Select onValueChange={handleGameweekChange} value={currentGameweek.toString()}>
              <SelectTrigger id="gameweek">
                <SelectValue placeholder="Select gameweek" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 38 }, (_, i) => i + 1).map(gw => (
                  <SelectItem key={gw} value={gw.toString()}>
                    Gameweek {gw}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button onClick={exportToCSV} variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export CSV
          </Button>
        </div>

        <div className="grid gap-4">
          {players.map(player => (
            <div key={player.manager} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted rounded-lg">
              <div className="font-semibold">{player.manager}</div>
              <div>
                <Label>Points</Label>
                <Input
                  type="number"
                  placeholder="Points"
                  value={gameweekData[player.manager]?.points || ''}
                  onChange={(e) => handleInputChange(player.manager, 'points', e.target.value)}
                />
              </div>
              <div>
                <Label>Transfer Points</Label>
                <Input
                  type="number"
                  placeholder="Transfer Points"
                  value={gameweekData[player.manager]?.transferPoints || ''}
                  onChange={(e) => handleInputChange(player.manager, 'transferPoints', e.target.value)}
                />
              </div>
            </div>
          ))}
        </div>

        <Button onClick={handleSubmit} className="w-full gap-2">
          <Save className="w-4 h-4" />
          Update Gameweek {currentGameweek}
        </Button>
      </CardContent>
    </Card>
  );
};