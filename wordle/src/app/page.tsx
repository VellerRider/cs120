'use client'
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const WordleGame = () => {
  const [answer, setAnswer] = useState("");
  const [guesses, setGuesses] = useState<{ word: string; results: number[]}[]>([]);
  const [currentGuess, setCurrentGuess] = useState("");
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [usedLetters, setUsedLetters] = useState<{ [key: string]: number }>({});
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [wordBank, setWordBank] = useState<string[]>([]);

  const [TotalWonTries, setTotalWonTries] = useState(0);
  const [thisTries, setThisTries] = useState(0);
  const [wonCount, setWonCount] = useState(0);
  const [avgTries, setAvgTries] = useState(0);

  useEffect(() => {
    startNewGame();
    const savedWonCount = parseInt(Cookies.get("wonCount") || "0");
    const savedTotalTries = parseInt(Cookies.get("TotalWonTries") || "0");
    setWonCount(savedWonCount);
    setTotalWonTries(savedTotalTries);
    setAvgTries(savedWonCount > 0 ? Math.round(savedTotalTries / savedWonCount) : 0);
  }, []);


  const startNewGame = async () => {
    try {
      setIsLoading(true);
      const response = await fetch ('https://random-word-api.vercel.app/api?words=30&length=5');
      const words = await response.json().then((words) => words.map((word: string) => word.toUpperCase()));
      nextRound(words[0]);
      words.shift();
      setWordBank(words);
    } catch (error) {
      setErrorMessage("Failed to fetch words.");
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  function nextRound (initialWord: string) {
    console.log("initialWord:", initialWord);
    console.log("wordBank:", wordBank);
    if (initialWord) {
      setAnswer(initialWord);
      wordBank.splice(wordBank.indexOf(initialWord), 1);
      console.log("Answer:", initialWord); // For debugging
    } else if (wordBank.length > 0) {
      const nxtAnswer = wordBank[Math.floor(Math.random() * wordBank.length)]
      setAnswer(nxtAnswer);
      wordBank.splice(wordBank.indexOf(nxtAnswer), 1);
      console.log("Answer:", nxtAnswer); // For debugging
    } else {
      if (confirm("WOW! You crashed all 30 words! You beat some more?")) {
        startNewGame();
      }
    }
    setGuesses([]);
    setCurrentGuess("");
    setGameOver(false);
    setWon(false);
    setUsedLetters({});
    setShowError(false);
    setThisTries(0);
  };

  const checkGuess = (guess: string) => {
    const ansArr = answer.split("");
    const guessArr = guess.split("");
    const result = new Array(5).fill(-1);
    // 1:green 0:gold -1:gray
    // First check for correct positions
    guessArr.forEach((letter, i) => {
      if (letter === ansArr[i]) {
        result[i] = 1;
        ansArr[i] = "used";
      }
    });
    
    // Then check for wrong positions
    guessArr.forEach((letter, i) => {
      if (result[i] === -1) {
        const index = ansArr.indexOf(letter);
        if (index !== -1) {
          result[i] = 0;
          ansArr[index] = "used";
        }
      }
    });
    return result;
  };

  const updateUsedLetters = (guess: string, results: number[]) => {
    const newUsedLetters = { ...usedLetters };
    guess.split("").forEach((letter, index) => {
      const currentStatus = newUsedLetters[letter];
      const nxtStatus = results[index];
      
      if (!currentStatus || (currentStatus === -1 && nxtStatus !== -1) || 
          (currentStatus === 0 && nxtStatus === 1)) {
        newUsedLetters[letter] = nxtStatus;
      }
    });
    setUsedLetters(newUsedLetters);
  };

  const handleKeyPress = (e: { key: string; }) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const handleSubmit = () => {
    if (currentGuess.length !== 5) {
      setErrorMessage("Please enter a 5-letter word");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    } else if (!/^[a-zA-Z]+$/.test(currentGuess)) {
      setErrorMessage("Please only enter English letters");
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
      return;
    }

    const guess = currentGuess.toUpperCase();
    const results = checkGuess(guess);
    updateUsedLetters(guess, results);
    
    const newGuesses = [...guesses, { word: guess, results }];
    setGuesses(newGuesses);
    setCurrentGuess("");
    setThisTries((thisTries) => thisTries + 1);
    if (guess === answer) {
      const newWonCount = wonCount + 1;
      const newTotalTries = TotalWonTries + thisTries + 1;
      setWon(true);
      setWonCount(newWonCount);
      setTotalWonTries(newTotalTries);
      setAvgTries(Math.round(newTotalTries / newWonCount));
      Cookies.set("wonCount", newWonCount.toString());
      Cookies.set("TotalWonTries", newTotalTries.toString());
      setGameOver(true);
    } else if (newGuesses.length >= 6) {
      setGameOver(true);
      if (confirm(`Game Over! The word was ${answer}. You wanna start a new game?`)) {
        startNewGame();
      }
    }

  };

  const eraseCookies = () => {
    Cookies.remove("wonCount");
    Cookies.remove("TotalWonTries");
    setWonCount(0);
    setTotalWonTries(0);
    setAvgTries(0);
  };


  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-4"></div>
        <p>Loading words...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center p-4 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-4 ">Wordle</h1>

      {wonCount > 0 && (
        <button 
          className="absolute top-4 right-8 bg-red-200 text-white px-2 py-1 rounded-lg hover:bg-red-300" 
          onClick={eraseCookies}
          title="Clear History">
          🧹
        </button>
      )}

      <div className="flex flex-row gap-8 mb-2">
        <p>Total wins: {wonCount}</p>
        <p>Average winning tries: {avgTries}</p>
      </div>
      
      {showError && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <div className="flex items-center">
            <span className="mr-2">⚠️</span>
            <p>{errorMessage}</p>
          </div>
        </div>
      )}

      <div className="grid gap-2 mb-4">
        {[...Array(6)].map((_, rowIndex) => (
          <div key={rowIndex} className="flex gap-2">
            {[...Array(5)].map((_, colIndex) => {
              const guess = guesses[rowIndex];
              return (
                <div
                  key={colIndex}
                  className={`w-12 h-12 border-2 flex items-center justify-center text-xl font-bold
                    ${!guess ? 'bg-white' :
                    guess.results[colIndex] === 1 ? 'bg-green-500 text-white' :
                    guess.results[colIndex] === 0 ? 'bg-yellow-500 text-white' :
                    'bg-gray-500 text-white'}`}
                >
                  {guess ? guess.word[colIndex] : ''}
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="mb-2">
        <input
          type="text"
          value={currentGuess}
          onChange={(e) => setCurrentGuess(e.target.value.toUpperCase())}
          onKeyDown={handleKeyPress}
          maxLength={5}
          disabled={gameOver}
          className="border-2 p-2 text-xl w-32 rounded-lg"
          placeholder="Guess"
        />
        <button
          onClick={handleSubmit}
          disabled={gameOver}
          className="bg-blue-500 text-white text-md px-4 py-2 ml-2 rounded-lg disabled:bg-gray-300 hover:bg-blue-600"
        >
          Submit
        </button>
        <div className="my-2">You tried: {thisTries} times in this game</div>
      </div>

      {gameOver && (
        <>
        <div className="mb-4">
          <p>Correct! Next round?</p>
        </div>
        <button
          onClick={() => nextRound()}
          className="bg-green-500 text-white px-4 py-2 rounded-lg mb-4 hover:bg-green-600"
        >
          Next Round
        </button>
        </>
      )}


      <h2 className="text-xl font-bold">Used Letters</h2>
      {Object.keys(usedLetters).length > 0 ?
      (
        <div className="mt-2 p-4 bg-white rounded shadow">
          <div className="grid grid-cols-7 gap-2">
          {Object.entries(usedLetters).map(([letter, status]) => (
            <div
              key={letter}
              className={`w-8 h-8 flex items-center justify-center font-bold rounded
                ${status === 1 ? 'bg-green-500 text-white' :
                status === 0 ? 'bg-yellow-500 text-white' :
                'bg-gray-500 text-white'}`}
            >
              {letter}
            </div>
          ))}
          </div>
        </div>
      ) : (
        <div className="mt-2 p-4 bg-white rounded shadow truncate text-xs italic">
          <p>Nothing used yet...</p>
        </div>
      )}
    </div>
  );
};

export default WordleGame;