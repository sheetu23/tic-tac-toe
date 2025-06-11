document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let gameActive = true;
    let currentPlayer = 'x';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let scores = {
        x: 0,
        o: 0,
        ties: 0
    };

    // DOM elements
    const status = document.getElementById('status');
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const resetButton = document.getElementById('resetBtn');
    const newGameButton = document.getElementById('newGameBtn');
    const scoreX = document.getElementById('scoreX');
    const scoreO = document.getElementById('scoreO');
    const scoreTies = document.getElementById('scoreTies');
    const winLine = document.getElementById('winLine');
    const themeToggle = document.getElementById('themeToggle');

    // Winning conditions
    const winningConditions = [
        [0, 1, 2], // top row
        [3, 4, 5], // middle row
        [6, 7, 8], // bottom row
        [0, 3, 6], // left column
        [1, 4, 7], // middle column
        [2, 5, 8], // right column
        [0, 4, 8], // diagonal top-left to bottom-right
        [2, 4, 6]  // diagonal top-right to bottom-left
    ];

    // Functions
    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-cell-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        handleCellPlayed(clickedCell, clickedCellIndex);
        handleResultValidation();
    }

    function handleCellPlayed(clickedCell, clickedCellIndex) {
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.classList.add(currentPlayer);
        
        // Add animation to the placed mark
        clickedCell.classList.add('win-animation');
        setTimeout(() => {
            clickedCell.classList.remove('win-animation');
        }, 500);
    }

    function handleResultValidation() {
        let roundWon = false;
        let winningLine = null;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] === gameState[b] && 
                            gameState[b] === gameState[c] && 
                            gameState[a] !== '';
            
            if (condition) {
                roundWon = true;
                winningLine = i;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer.toUpperCase()} has won!`;
            gameActive = false;
            updateScore(currentPlayer);
            drawWinLine(winningLine);
            createConfetti();
            return;
        }

        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            status.textContent = "It's a tie!";
            gameActive = false;
            updateScore('ties');
            return;
        }

        changePlayer();
    }

    function drawWinLine(lineIndex) {
        const lineStyles = [
            { top: '16.7%', height: '10px', width: '100%', transform: 'none' }, // top row
            { top: '50%', height: '10px', width: '100%', transform: 'translateY(-50%)' }, // middle row
            { top: '83.3%', height: '10px', width: '100%', transform: 'none' }, // bottom row
            { left: '16.7%', width: '10px', height: '100%', transform: 'none' }, // left column
            { left: '50%', width: '10px', height: '100%', transform: 'translateX(-50%)' }, // middle column
            { left: '83.3%', width: '10px', height: '100%', transform: 'none' }, // right column
            { top: '50%', height: '10px', width: '100%', transform: 'translateY(-50%) rotate(45deg)' }, // diagonal 1
            { top: '50%', height: '10px', width: '100%', transform: 'translateY(-50%) rotate(-45deg)' } // diagonal 2
        ];
       
        const style = lineStyles[lineIndex];
        
        for (const [key, value] of Object.entries(style)) {
            winLine.style[key] = value;
        }
        
        // Set the color based on the current player
        winLine.style.background = currentPlayer === 'x' ? 'var(--x-color)' : 'var(--o-color)';
        winLine.style.opacity = '1';
    }

    function changePlayer() {
        currentPlayer = currentPlayer === 'x' ? 'o' : 'x';
        status.textContent = `${currentPlayer.toUpperCase()}'s turn`;
    }

    function updateScore(winner) {
        scores[winner] += 1;
        scoreX.textContent = scores.x;
        scoreO.textContent = scores.o;
        scoreTies.textContent = scores.ties;
    }

    function resetBoard() {
        gameActive = true;
        currentPlayer = 'x';
        gameState = ['', '', '', '', '', '', '', '', ''];
        status.textContent = `X's turn`;
        winLine.style.opacity = '0';
        
        cells.forEach(cell => {
            cell.classList.remove('x', 'o');
        });
    }

    function newGame() {
        resetBoard();
        scores = { x: 0, o: 0, ties: 0 };
        scoreX.textContent = '0';
        scoreO.textContent = '0';
        scoreTies.textContent = '0';
    }

    function toggleTheme() {
        document.body.classList.toggle('dark-mode');
        const isDarkMode = document.body.classList.contains('dark-mode');
        
        themeToggle.innerHTML = isDarkMode ? 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>' :
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
    }

    function createConfetti() {
        const confettiCount = 100;
        const colors = ['#ff6b6b', '#4facfe', '#8a2be2', '#00f2fe', '#ffd166'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.classList.add('confetti');
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            document.body.appendChild(confetti);
            
            // Remove confetti after animation completes
            setTimeout(() => {
                confetti.remove();
            }, 5000);
        }
    }

    // Event listeners
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });

    resetButton.addEventListener('click', resetBoard);
    newGameButton.addEventListener('click', newGame);
    themeToggle.addEventListener('click', toggleTheme);
});