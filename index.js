import entradaDados, { question } from 'readline-sync';


// DATABASE
const emojis = ["🐱", "🐶", "🍎", "🍌", "⚽", "🏀", "🌟", "✨"]


// MIX THE EMOJIS
function shuffle(array) {
  array.sort(() => Math.random() - 0.5)
  return array;
}


// ASSEMBLE THE BOARD
const emojisBoard = shuffle([...emojis, ...emojis]);
let boardState = emojisBoard.map((emoji, index) => ({
  id: String(index + 1).padStart(2, "0"),
  emoji,
  revealed: false,
  matched: false
}));


// SHOW BOARD
function showBoard() {
  const columns = 4;
  let board = "\nTABULEIRO:\n";
  for (let i = 0; i < boardState.length; i += columns) {
    const row = boardState
      .slice(i, i + columns)
      .map(cell => (cell.revealed || cell.matched) ? `[ ${cell.emoji} ]` : `[ ${cell.id} ]`)
      .join(" ");

    board += "  " + row + "\n";
  }
  console.log(board);
}


// MAIN FUNCTION OF THE GAME
async function playGame() {
  let matchedPairs = 0;
  let remainingAttempts = 5
  const totalPairs = emojis.length;

  while (matchedPairs < totalPairs && remainingAttempts > 0) {
    showBoard();
    const pick1 = entradaDados.question("Escolha o primeiro numero:");
    const pick2 = entradaDados.question("Escolha o segundo numero:");

    const card1 = boardState.find(c => c.id === pick1);
    const card2 = boardState.find(c => c.id === pick2);

    if (!card1 || !card2 || card1.matched || card2.matched || pick1 === pick2) {
      console.log("Escolha inválida! Tente novamente.");
      continue;
    }

    // Temporarily reveals
    card1.revealed = true;
    card2.revealed = true;
    showBoard();

    if (card1.emoji === card2.emoji) {
      console.log("Par encontrado!");
      card1.matched = true;
      card2.matched = true;
      matchedPairs++;
    } else {
      remainingAttempts--
      console.log("Não foi dessa vez!");
      console.log(`Você ainda tem ${remainingAttempts} tentativa(s)`)
      // Short pause before hiding again
      await new Promise(r => setTimeout(r, 1000));
      card1.revealed = false;
      card2.revealed = false;
    }
  }
    
  if (matchedPairs == totalPairs) {
    console.log("Parabéns! Você encontrou todos os pares!");
  } else if (remainingAttempts == 0) {
    console.log("Suas tentativas acabaram. Você perdeu o jogo!!!");
  }
}


// START THE GAME
playGame();