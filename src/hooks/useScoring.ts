import { useState, useEffect, useCallback } from 'react';
import { MatchState, BallEvent, InningsData } from '@/types';

export const useScoring = () => {
  const [match, setMatch] = useState<MatchState | null>(null);
  const [historyStack, setHistoryStack] = useState<MatchState[]>([]);
  const [futureStack, setFutureStack] = useState<MatchState[]>([]);

  // ... (Keep existing Load/Save useEffects) ...
  useEffect(() => {
    const saved = localStorage.getItem('sandhu_cricket_match');
    if (saved) setMatch(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (match) localStorage.setItem('sandhu_cricket_match', JSON.stringify(match));
  }, [match]);

  // ... (Keep pushToHistory) ...
  const pushToHistory = (currentState: MatchState) => {
    setHistoryStack((prev) => [...prev, currentState]);
    setFutureStack([]); 
  };

  // --- UPDATED SCORE FUNCTION ---
  // Now accepts isWicket flag for extras
  const scoreBall = useCallback((
    type: 'legal' | 'wide' | 'no-ball' | 'wicket', 
    runsOffBat: number = 0,
    isExtraWicket: boolean = false // <--- NEW PARAMETER
  ) => {
    setMatch((prevMatch) => {
      if (!prevMatch) return null;

      const currentInningsKey = prevMatch.currentInnings === 1 ? 'inningsOne' : 'inningsTwo';
      const innings = prevMatch[currentInningsKey]!; // Force unwrap
      const config = prevMatch.config;

      // 1. OVERS LIMIT CHECK
      // If the match is defined as 5 overs, stop at 30 balls.
      const maxBalls = config.totalOvers * 6;
      if (innings.ballsBowled >= maxBalls) {
        // Allow ONLY Undo (which doesn't call this function) or End Innings
        return prevMatch; 
      }

      // 2. TARGET CHECK (2nd Innings)
      if (prevMatch.currentInnings === 2 && prevMatch.inningsOne) {
          const target = prevMatch.inningsOne.totalRuns + 1;
          if (innings.totalRuns >= target) return prevMatch; // Match Won already
      }

      // WICKETS CHECK
      if (innings.wickets >= 10) return prevMatch; // All out

      // --- START SCORING ---
      pushToHistory(prevMatch);
      const nextMatch = JSON.parse(JSON.stringify(prevMatch));
      const nextInnings: InningsData = nextMatch[currentInningsKey];

      let runsToAdd = runsOffBat;
      let isLegalBall = false;
      let isWicket = (type === 'wicket') || isExtraWicket;
      let displaySymbol = "";

      // LOGIC ENGINE
      if (type === 'legal') {
        isLegalBall = true;
        displaySymbol = runsOffBat.toString();
        if (isWicket) displaySymbol = 'W'; // Bowled/Catch
      } 
      else if (type === 'wide') {
        const isReball = config.wideRule !== 'run'; 
        runsToAdd += 1; // Base Wide
        isLegalBall = !isReball;
        
        // Symbol construction: WD + Runs + W
        // e.g. "WD", "WD+1", "WD+W", "WD+1+W"
        displaySymbol = "WD";
        if (runsOffBat > 0) displaySymbol += `+${runsOffBat}`;
        if (isWicket) displaySymbol += "+W";
        
        nextInnings.extras.wides += 1;
      } 
      else if (type === 'no-ball') {
        const isReball = config.noBallRule !== 'run';
        runsToAdd += 1; // Base NB
        isLegalBall = !isReball;

        displaySymbol = "NB";
        if (runsOffBat > 0) displaySymbol += `+${runsOffBat}`;
        if (isWicket) displaySymbol += "+W";

        nextInnings.extras.noBalls += 1;
      }
      else if (type === 'wicket') {
         isLegalBall = true;
         isWicket = true;
         displaySymbol = 'W';
      }

      // UPDATE STATS
      nextInnings.totalRuns += runsToAdd;
      if (isLegalBall) nextInnings.ballsBowled += 1;
      if (isWicket) nextInnings.wickets += 1;
      nextInnings.history.push(displaySymbol as BallEvent);

      return nextMatch;
    });
  }, []);

  // ... (Keep undo/redo/endInnings exactly as before) ...
  const endInnings = useCallback(() => {
    setMatch((prev) => {
      if (!prev) return null;
      pushToHistory(prev);
      const next = JSON.parse(JSON.stringify(prev));

      if (next.currentInnings === 1) {
        next.currentInnings = 2;
        if (!next.inningsTwo) {
             next.inningsTwo = {
                battingTeam: next.config.teamTwoName,
                bowlingTeam: next.config.teamOneName,
                totalRuns: 0,
                wickets: 0,
                ballsBowled: 0,
                history: [],
                extras: { wides: 0, noBalls: 0 },
             };
        }
      } else {
        next.status = 'completed';
      }
      return next;
    });
  }, []);

  const undo = useCallback(() => {
    if (historyStack.length === 0 || !match) return;
    const previousState = historyStack[historyStack.length - 1];
    setFutureStack((prev) => [match, ...prev]);
    setMatch(previousState);
    setHistoryStack((prev) => prev.slice(0, -1));
  }, [historyStack, match]);

  const redo = useCallback(() => {
    if (futureStack.length === 0 || !match) return;
    const nextState = futureStack[0];
    setHistoryStack((prev) => [...prev, match]);
    setMatch(nextState);
    setFutureStack((prev) => prev.slice(1));
  }, [futureStack, match]);

  return { 
    match, scoreBall, undo, redo, endInnings, 
    canUndo: historyStack.length > 0, 
    canRedo: futureStack.length > 0 
  };
};