import { useState } from "react";
import { RotateCcw, RotateCw, X } from "lucide-react";

interface Props {
  onScore: (type: 'legal' | 'wide' | 'no-ball' | 'wicket', runs: number, isWicket?: boolean) => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isDisabled?: boolean;
}

export default function Keypad({ onScore, onUndo, onRedo, canUndo, canRedo, isDisabled = false }: Props) {
  // We track what "Type" of ball is pending to show the correct modal
  const [pendingMode, setPendingMode] = useState<'wide' | 'no-ball' | 'wicket' | null>(null);
  
  // For Extras: Track if a wicket also fell (toggle state)
  const [isExtraWicket, setIsExtraWicket] = useState(false);

  // --- LOCKED STATE (Overs Done / All Out) ---
  if (isDisabled) {
    return (
        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-2xl text-center space-y-4">
            <p className="text-gray-500 font-bold">Innings Closed</p>
            <div className="flex gap-3 justify-center">
                <button 
                    onClick={onUndo} 
                    disabled={!canUndo}
                    className="px-6 py-3 bg-white dark:bg-gray-700 rounded-xl font-bold shadow-sm flex items-center gap-2"
                >
                    <RotateCcw size={16} /> Undo
                </button>
            </div>
        </div>
    );
  }

  // --- 1. STANDARD VIEW (Main Grid) ---
  if (!pendingMode) {
    return (
      <div className="space-y-3">
        {/* Undo / Redo Row */}
        <div className="flex gap-3 mb-2">
          <button 
            onClick={onUndo} 
            disabled={!canUndo}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-30 transition-opacity hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            <RotateCcw size={16} /> Undo
          </button>
          <button 
            onClick={onRedo} 
            disabled={!canRedo}
            className="flex-1 py-3 bg-gray-200 dark:bg-gray-800 rounded-xl flex items-center justify-center gap-2 text-sm font-bold disabled:opacity-30 transition-opacity hover:bg-gray-300 dark:hover:bg-gray-700"
          >
            Redo <RotateCw size={16} />
          </button>
        </div>

        {/* Scoring Grid */}
        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 6, 0].map((runs) => (
            <button
              key={runs}
              onClick={() => onScore('legal', runs)}
              className={`h-16 text-2xl font-bold rounded-xl shadow-sm active:scale-95 transition-transform border border-gray-100 dark:border-gray-700
                ${runs === 4 ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' : ''}
                ${runs === 6 ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100' : ''}
                ${![4,6].includes(runs) ? 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-700' : ''}
              `}
            >
              {runs}
            </button>
          ))}

          <button 
            onClick={() => { setPendingMode('wide'); setIsExtraWicket(false); }}
            className="h-16 text-lg font-bold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 rounded-xl active:scale-95 hover:bg-orange-200 dark:hover:bg-orange-800"
          >
            WD
          </button>
          <button 
            onClick={() => { setPendingMode('no-ball'); setIsExtraWicket(false); }}
            className="h-16 text-lg font-bold bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-100 rounded-xl active:scale-95 hover:bg-orange-200 dark:hover:bg-orange-800"
          >
            NB
          </button>
          <button 
            onClick={() => setPendingMode('wicket')} // Open Wicket Modal
            className="h-16 text-lg font-bold bg-red-500 text-white rounded-xl active:scale-95 hover:bg-red-600 shadow-md shadow-red-200 dark:shadow-none"
          >
            OUT
          </button>
        </div>
      </div>
    );
  }

  // --- 2. WICKET MODAL (Run Out Logic) ---
  if (pendingMode === 'wicket') {
      return (
        <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-4 border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-red-600 dark:text-red-400 flex items-center gap-2">
                    Wicket Fall 
                </h3>
                <button onClick={() => setPendingMode(null)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300">
                    <X size={16} />
                </button>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 font-medium">
                Runs completed before getting out?
            </p>

            <div className="grid grid-cols-4 gap-2">
                <button
                    onClick={() => { onScore('wicket', 0); setPendingMode(null); }}
                    className="col-span-2 py-4 bg-red-500 text-white rounded-lg font-bold shadow-sm active:scale-95 hover:bg-red-600"
                >
                    0 (Catch/Bowled)
                </button>
                {[1, 2, 3].map((runs) => (
                    <button
                        key={runs}
                        onClick={() => { 
                            // Run Out: Legal ball + Runs + Wicket flag
                            // We use 'legal' type but pass isWicket=true to the hook
                            onScore('legal', runs, true); 
                            setPendingMode(null); 
                        }}
                        className="py-4 bg-white dark:bg-gray-700 rounded-lg font-bold shadow-sm active:scale-95 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
                    >
                        {runs} Run{runs > 1 ? 's' : ''}
                    </button>
                ))}
            </div>
             <p className="text-xs text-gray-400 mt-2 text-center">
                Select runs for Run Out (e.g., 1 Run = Ran 1, out on 2nd)
            </p>
        </div>
      );
  }

  // --- 3. EXTRAS MODAL (Wide/No-Ball) ---
  return (
    <div className="bg-gray-100 dark:bg-gray-800 p-5 rounded-2xl animate-in fade-in slide-in-from-bottom-4 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
          {pendingMode === 'wide' ? 'Wide Ball' : 'No Ball'} 
          <span className="text-sm font-normal text-gray-500">(+1 Run)</span>
        </h3>
        <button onClick={() => setPendingMode(null)} className="p-2 bg-gray-200 dark:bg-gray-700 rounded-full hover:bg-gray-300">
          <X size={16} />
        </button>
      </div>
      
      {/* WICKET TOGGLE FOR EXTRAS */}
      <div 
        onClick={() => setIsExtraWicket(!isExtraWicket)}
        className={`flex items-center justify-between p-3 rounded-xl mb-4 cursor-pointer transition-colors border ${
            isExtraWicket 
            ? 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800' 
            : 'bg-white border-transparent dark:bg-gray-700'
        }`}
      >
        <span className={`font-bold text-sm ${isExtraWicket ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-300'}`}>
            Wicket also fell?
        </span>
        <div className={`w-5 h-5 rounded flex items-center justify-center border ${isExtraWicket ? 'bg-red-500 border-red-500' : 'border-gray-400'}`}>
            {isExtraWicket && <X size={14} className="text-white" />}
        </div>
      </div>

      <p className="text-sm text-gray-500 mb-2 font-semibold">Additional runs off bat/legs:</p>
      
      <div className="grid grid-cols-4 gap-2">
        {[0, 1, 2, 3, 4, 6].map((runs) => (
          <button
            key={runs}
            onClick={() => {
              onScore(pendingMode, runs, isExtraWicket); 
              setPendingMode(null);
            }}
            className="py-3 bg-white dark:bg-gray-700 rounded-lg font-bold shadow-sm active:scale-95 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600"
          >
            +{runs}
          </button>
        ))}
      </div>
    </div>
  );
}