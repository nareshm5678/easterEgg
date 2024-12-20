import React, { useState, useEffect } from "react";
import "./App.css"; // Add your CSS styling here

// Import all the images
import owlImage from "./assets/owl.png";
import egg1Image from "./assets/WhatsApp_Image_2024-12-01_at_6.33.19_PM-removebg-preview.png";
import egg2Image from "./assets/WhatsApp_Image_2024-12-01_at_6.33.49_PM-removebg-preview.png";
import egg3Image from "./assets/WhatsApp_Image_2024-12-01_at_6.35.26_PM-removebg-preview.png";
import backgroundImage from "./assets/yvns_xtdx_210511.jpg"; // Background image
import treeImage from "./assets/xxk3_avc4_190721-removebg-preview.png"; // Hiding object (Tree)
import bushImage from "./assets/od0a_ebuj_230706-removebg-preview.png"; // Hiding object (Bush)
import rockImage from "./assets/Cartoon_Pine_Tree_Clipart_PNG_Images__Tree_For_Cartoon_Isolated_On_White_Background__Tree__Bush__Cartoon_PNG_Image_For_Free_Download-removebg-preview.png"; // Hiding object (Rock)

function App() {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameStarted, setGameStarted] = useState(false);
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [hintUsed, setHintUsed] = useState(false); // To track if hint was used
  const [hintAvailable, setHintAvailable] = useState(false); // To track if hint can be used

  const definitionLines = [
    "Under the bush",
    "Under the Parrot",
  ];

  const [dialogueText, setDialogueText] = useState(
    "Identify the Easter egg locations! Click the owl for hints (1 hint = deduct 30 points)"
  );

  // Timer logic
  useEffect(() => {
    if (gameStarted && timeLeft > 0) {
      const timerInterval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timerInterval);
    }
    if (timeLeft === 0) {
      endGame();
    }
  }, [gameStarted, timeLeft]);

  const startGame = () => {
    setScore(0); // Reset score
    setTimeLeft(60); // Reset timer
    setGameStarted(true);
    setHintUsed(false); // Reset hint usage
    setHintAvailable(true); // Allow hint after the game starts
    
    // Change the dialogue when the game starts
    setDialogueText("Click on objects to find Easter Eggs!");
  };

  const displayLineByLine = () => {
    if (currentLineIndex < definitionLines.length) {
      const line = definitionLines[currentLineIndex];
      setDialogueText(line);
      setCurrentLineIndex((prev) => prev + 1);
      setTimeout(displayLineByLine, 3000); // Display next line after 3 seconds
    } else {
      setDialogueText("The owl has finished speaking!");
    }
  };

  const speak = (text) => {
    const speech = new SpeechSynthesisUtterance();
    speech.text = text;
    speech.lang = "en-US";
    speech.volume = 1;
    speech.rate = 1;
    speech.pitch = 1;
    window.speechSynthesis.speak(speech);
  };

  const findEgg = (points, event) => {
    if (event.target.style.display !== "none") {
      setScore((prev) => prev + points);
      event.target.style.display = "none"; // Hide the clicked egg
    }
  };

  const findHidingObject = (points, event) => {
    if (event.target.style.display !== "none") {
      setScore((prev) => prev + points);
      event.target.style.display = "none"; // Hide the clicked object
    }
  };

  const hintDeduction = () => {
    if (hintAvailable && score >= 30 && !hintUsed) {
      setScore((prev) => prev - 30);
      setHintUsed(true); // Mark hint as used
      setHintAvailable(false); // Disable further hint usage once one is used
  
      if (currentLineIndex < definitionLines.length) {
        const hint = definitionLines[currentLineIndex];
        setDialogueText(hint);
        speak(hint); // Speak the hint
        setCurrentLineIndex((prev) => prev + 1);
      } else {
        setDialogueText("No more hints!");
        speak("No more hints!");
      }
    } else if (score < 40) {
      setDialogueText("Not enough points for a hint!");
      speak("Not enough points for a hint!");
    } else {
      setDialogueText("You have already used a hint!");
      speak("You have already used a hint!");
    }
  };

  const endGame = () => {
    setGameStarted(false);
    alert(`Game Over! Final Score: ${score}`);
  };

  return (
    <div
      className="App"
      style={{
        height: "100vh",
        overflow: "hidden",
        backgroundImage: `url(${backgroundImage})`, // Use the imported background image
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Timer and Score at the sides */}
      <div id="timer">Time: {timeLeft}</div>
      <div id="scoreboard">Score: {score}</div>

      {/* Start button */}
      {!gameStarted && (
        <button id="start-btn" onClick={startGame}>
          Start Game
        </button>
      )}

      {/* Owl */}
      <img
        src={owlImage}
        id="owl"
        alt="Owl"
        style={{
          position: "absolute",
          top: "10%", // Adjust this value to change its vertical position
          left: "10%", // Adjust this value to change its horizontal position
          cursor: "pointer",
          zIndex: 20,
          width: "8%",
        }}
        onClick={hintDeduction} // Owl provides hints and deducts points
      />

      {/* Dialogue Box */}
      <div id="dialogue-container">
        <div id="dialogue-text">{dialogueText}</div>
      </div>

      {/* Hiding objects and Easter eggs */}
      <img
        src={treeImage}
        className="hiding-object"
        style={{
          top: "36%",
          left: "80%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        alt="Tree"
        onClick={(e) => gameStarted && findHidingObject(10, e)}
      />
      <img
        src={bushImage}
        className="hiding-object"
        style={{
          top: "40%",
          left: "60%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        alt="Bush"
        onClick={(e) => gameStarted && findHidingObject(15, e)}
      />
      <img
        src={rockImage}
        className="hiding-object"
        style={{
          top: "70%",
          left: "20%",
          width: "10%",
          height: "auto",
          cursor: gameStarted ? "pointer" : "not-allowed",
        }}
        alt="Rock"
        onClick={(e) => gameStarted && findHidingObject(20, e)}
      />
      <img
        src={egg1Image}
        className="object"
        id="egg1"
        style={{
          top: "37%",
          left: "81%",
          width: "3%",
          height: "auto",
        }}
        onClick={(e) => findEgg(10, e)}
        alt="Egg 1"
      />
      <img
        src={egg2Image}
        className="object"
        id="egg2"
        style={{
          top: "51%",
          left: "63%",
          width: "5%",
          height: "auto",
        }}
        onClick={(e) => findEgg(20, e)}
        alt="Egg 2"
      />
      <img
        src={egg3Image}
        className="object"
        id="egg3"
        style={{
          top: "75%",
          left: "22%",
          width: "5%",
          height: "auto",
        }}
        onClick={(e) => findEgg(15, e)}
        alt="Egg 3"
      />
    </div>
  );
}

export default App;
