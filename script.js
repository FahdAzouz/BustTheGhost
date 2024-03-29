document.addEventListener('DOMContentLoaded', () => {
    const gridContainer = document.getElementById('grid-container');
    const scoreElement = document.getElementById('score');
    const attemptsElement = document.getElementById('attempts');
    const peepToggle = document.getElementById('peep-toggle');
    const bustButton = document.getElementById('bust-ghost');

    let score = 20;
    let lastClickedCell = { row: null, col: null };
    let attempts = 2;
    const gridSize = { rows: 9, cols: 12 };
    let ghostPosition = { row: null, col: null };
    let isPeepOn = false;
    const sensorProbabilities = {
        0: { 'red': 1, 'orange': 0, 'yellow': 0, 'green': 0 },
        1: { 'red': 0.1, 'orange': 0.9, 'yellow': 0, 'green': 0 },
        2: { 'red': 0.1, 'orange': 0.9, 'yellow': 0, 'green': 0 },
        3: { 'red': 0.05, 'orange': 0.15, 'yellow': 0.7, 'green': 0.1 },
        4: { 'red': 0.05, 'orange': 0.15, 'yellow': 0.7, 'green': 0.1 },
        5: { 'red': 0.00, 'orange': 0.00, 'yellow': 0.05, 'green': 0.95 },
    };

    // Initialize the game
    function initGame() {
        createGrid();
        placeGhost();
    }

    // Create the game grid
    function createGrid() {
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                cell.dataset.row = row;
                cell.dataset.col = col;
                cell.onclick = () => handleCellClick(row, col);

                // Create a span element to display the probability
                const probabilityDisplay = document.createElement('span');
                probabilityDisplay.classList.add('probability-display');
                probabilityDisplay.style.display = 'none'; // Hide by default

                cell.appendChild(probabilityDisplay);
                gridContainer.appendChild(cell);
            }
        }
    }

    // Randomly place the ghost in one of the cells
    function placeGhost() {
        const row = Math.floor(Math.random() * gridSize.rows);
        const col = Math.floor(Math.random() * gridSize.cols);
        ghostPosition = { row, col };
        console.log(`Ghost at Row: ${row}, Col: ${col}`); // For debugging
    }
    // Add a global object to store the probabilities
    let probabilities = {};

    // Initialize or reset the probabilities for all cells
    function initProbabilities() {
        probabilities = {};
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                const key = `${row}-${col}`;
                probabilities[key] = 1 / (gridSize.rows * gridSize.cols); // Initial uniform distribution
            }
        }
    }

    // Update the display of probabilities on the grid (call this function when peep mode is toggled or probabilities are updated)
    function updateProbabilityDisplay() {
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
                const probabilityDisplay = cell.querySelector('.probability-display');
                if (isPeepOn) {
                    const key = `${row}-${col}`;
                    const probability = probabilities[key];
                    // Adjust display for probabilities less than 0.001
                    if (probability < 0.001 && probability > 0) {
                        probabilityDisplay.textContent = '< 0.001';
                    } else {
                        // Ensure probabilities are properly formatted and displayed, including when they increase
                        probabilityDisplay.textContent = probability.toFixed(3);
                    }
                    probabilityDisplay.style.display = 'block';
                } else {
                    probabilityDisplay.style.display = 'none';
                }
            }
        }
    }

    function updateProbabilities(clickedRow, clickedCol, sensorColor) {
        let totalProbability = 0;
        const newProbabilities = {};
    
        // Calculate new probabilities based on the sensor reading at the clicked location
        for (let row = 0; row < gridSize.rows; row++) {
            for (let col = 0; col < gridSize.cols; col++) {
                const key = `${row}-${col}`;
                const distance = computeDistance(row, col, clickedRow, clickedCol);
                const likelihood = sensorProbabilities[distance][sensorColor];
                const prior = probabilities[key];
                const unnormalizedPosterior = likelihood * prior;
                newProbabilities[key] = unnormalizedPosterior;
                totalProbability += unnormalizedPosterior;
            }
        }
    
        // Normalize the probabilities
        if (totalProbability === 0) {
            // Handle zero total probability if it occurs
            console.error('Total probability is zero. Normalization cannot proceed.');
            return; // Optionally, handle this case with a fallback mechanism
        }
    
        for (const key in newProbabilities) {
            probabilities[key] = newProbabilities[key] / totalProbability;
        }
    
        updateProbabilityDisplay(); // Make sure to update the display after changing the probabilities
    }

    // Handle clicking on a cell
    function handleCellClick(row, col) {

        lastClickedCell = { row, col };

        if (attempts > 0) {
            const distance = computeDistance(row, col, ghostPosition.row, ghostPosition.col);
            const color = getSensorColor(distance);
            updateProbabilities(row, col, color);
            console.log(`Distance: ${distance}, Color: ${color}`); // For debugging
            updateCellColor(row, col, color);
            updateScore(-1);

            if (isPeepOn) {
                // Additional logic for peeping (showing probabilities) can be added here
                updateProbabilityDisplay();
            }
        } else {
            alert("You're out of attempts!");
        }
    }

    // Compute the distance between two points
    function computeDistance(x1, y1, x2, y2) {
        return Math.max(Math.abs(x2 - x1), Math.abs(y2 - y1));
    }

    // Updated getSensorColor function to use conditional probability distributions
    function getSensorColor(distance) {
        // Example conditional probabilities for when the distance is 3
        const probabilities = {
            0: [
                { color: 'red', probability: 1.0 },
                { color: 'orange', probability: 0.0 },
                { color: 'yellow', probability: 0.0 },
                { color: 'green', probability: 0.0 }
            ],
            1: [
                { color: 'red', probability: 0.1 },
                { color: 'orange', probability: 0.9 },
                { color: 'yellow', probability: 0.0 },
                { color: 'green', probability: 0.0 }
            ],
            2: [
                { color: 'red', probability: 0.1 },
                { color: 'orange', probability: 0.9 },
                { color: 'yellow', probability: 0.0 },
                { color: 'green', probability: 0.0 }
            ],
            3: [
                { color: 'red', probability: 0.05 },
                { color: 'orange', probability: 0.15 },
                { color: 'yellow', probability: 0.7 },
                { color: 'green', probability: 0.1 }
            ],
            4: [
                { color: 'red', probability: 0.05 },
                { color: 'orange', probability: 0.15 },
                { color: 'yellow', probability: 0.7 },
                { color: 'green', probability: 0.1 }
            ],
            5: [
                { color: 'red', probability: 0.00 },
                { color: 'orange', probability: 0.00 },
                { color: 'yellow', probability: 0.05 },
                { color: 'green', probability: 0.95 }
            ]
            // Add additional distance keys and probability arrays as needed
        };

        // Default to maximum distance if no specific probabilities are defined for the current distance
        if (!probabilities[distance]) {
            return 'green'; // Assuming 'green' is the default for unknown or large distances
        }

        // Select a color based on the conditional probabilities for the given distance
        const randomNum = Math.random();
        let sum = 0;
        for (const { color, probability } of probabilities[distance]) {
            sum += probability;
            if (randomNum <= sum) {
                return color;
            }
        }

        // Fallback color if something goes wrong with the probabilities
        return 'green';
    }

    // Update the cell color based on sensor reading
    function updateCellColor(row, col, color) {
        const cell = document.querySelector(`.grid-cell[data-row="${row}"][data-col="${col}"]`);
        cell.style.backgroundColor = color;
    }

    // Update the score
    function updateScore(change) {
        score += change;
        scoreElement.innerText = score;
        if (score <= 0) {
            alert("Game over! You've run out of points!");
            location.reload();
            // Reset or end game logic here
        }
    }

    // Update attempts
    function updateAttempts() {
        attempts--;
        attemptsElement.innerText = attempts;
        if (attempts <= 0) {
            alert("Game over! You've run out of attempts!");
            location.reload();
            // Reset or end game logic here
        }
    }

    // Make sure to initialize the probabilities when the game starts
    function initGame() {
        createGrid();
        placeGhost();
        initProbabilities(); // Initialize probabilities
        updateProbabilityDisplay(); // Initial display update
    }

    // Toggle peep functionality
    peepToggle.addEventListener('click', () => {
        isPeepOn = !isPeepOn;
        peepToggle.textContent = isPeepOn ? "Peep: ON" : "Peep: OFF";
        updateProbabilityDisplay();
    });

    // Handling the bust action
    bustButton.addEventListener('click', () => {
        // This would be the action to attempt a bust
        // Logic to check if the ghost is in the selected cell and handle win/loss
        // Check if a cell has been selected
        if (lastClickedCell.row === null || lastClickedCell.col === null) {
            alert("Please select a cell to bust!");
            return;
        }

        // Decrease the attempts for busting
        updateAttempts();

        // Check if the ghost is in the selected cell
        if (lastClickedCell.row === ghostPosition.row && lastClickedCell.col === ghostPosition.col) {
            alert("Congratulations! You've busted the ghost!");
            location.reload();
            // Here, you can implement logic to restart the game or offer further options to the player
        } else if (attempts <= 0) {
            alert("Game over! You've run out of attempts!");
            location.reload();
            // Similar to winning, provide options for restarting the game or ending the session
        } else {
            alert("The bust was unsuccessful. Try again!");
            // Optionally, provide feedback on the remaining attempts or other game state information
        }

        // Reset last clicked cell to prevent repeated bust attempts on the same cell without a new selection
        lastClickedCell = { row: null, col: null };
    });

    initGame();
});
