const GRID_SIZE = 8;
const ANIMAL_TYPES = ['🥟', '🥮', '🥠', '🍡', '🍤'];
const gridElement = document.getElementById('grid');
const scoreElement = document.getElementById('score');
const timeElement = document.getElementById('time');
let grid = [];
let score = 0;
let timeLeft = 30;
let selectedCell = null;

function initializeGrid() {
    grid = Array.from({ length: GRID_SIZE }, () =>
        Array.from({ length: GRID_SIZE }, () => ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)])
    );
    while (hasMatches()) {
        eliminateMatches();
        dropAnimals();
    }
    renderGrid();
}

function renderGrid() {
    gridElement.innerHTML = '';
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.x = i;
            cell.dataset.y = j;
            cell.textContent = grid[i][j];
            cell.addEventListener('click', handleCellClick);
            gridElement.appendChild(cell);
        }
    }
}

function handleCellClick(event) {
    const x = parseInt(event.target.dataset.x);
    const y = parseInt(event.target.dataset.y);
    if (!selectedCell) {
        selectedCell = { x, y };
        event.target.style.border = '2px solid red';
    } else {
        const prevX = selectedCell.x;
        const prevY = selectedCell.y;
        if (isAdjacent(x, y, prevX, prevY) && swapAndCheck(x, y, prevX, prevY)) {
            eliminateMatches();
            dropAnimals();
            while (hasMatches()) {
                eliminateMatches();
                dropAnimals();
            }
        }
        document.querySelector(`.cell[data-x="${prevX}"][data-y="${prevY}"]`).style.border = '';
        selectedCell = null;
        renderGrid();
    }
}

function isAdjacent(x1, y1, x2, y2) {
    return (Math.abs(x1 - x2) === 1 && y1 === y2) || (Math.abs(y1 - y2) === 1 && x1 === x2);
}

function swapAndCheck(x1, y1, x2, y2) {
    [grid[x1][y1], grid[x2][y2]] = [grid[x2][y2], grid[x1][y1]];
    if (!hasMatches()) {
        [grid[x1][y1], grid[x2][y2]] = [grid[x2][y2], grid[x1][y1]];
        return false;
    }
    return true;
}

function hasMatches() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 2; j++) {
            if (grid[i][j] && grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
                return true;
            }
        }
    }
    for (let j = 0; j < GRID_SIZE; j++) {
        for (let i = 0; i < GRID_SIZE - 2; i++) {
            if (grid[i][j] && grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
                return true;
            }
        }
    }
    return false;
}

function eliminateMatches() {
    for (let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE - 2; j++) {
            if (grid[i][j] && grid[i][j] === grid[i][j + 1] && grid[i][j] === grid[i][j + 2]) {
                score += 10;
                grid[i][j] = grid[i][j + 1] = grid[i][j + 2] = null;
            }
        }
    }
    for (let j = 0; j < GRID_SIZE; j++) {
        for (let i = 0; i < GRID_SIZE - 2; i++) {
            if (grid[i][j] && grid[i][j] === grid[i + 1][j] && grid[i][j] === grid[i + 2][j]) {
                score += 10;
                grid[i][j] = grid[i + 1][j] = grid[i + 2][j] = null;
            }
        }
    }
    scoreElement.textContent = `Score: ${score}`;
}

function dropAnimals() {
    for (let j = 0; j < GRID_SIZE; j++) {
        let emptyRow = GRID_SIZE - 1;
        for (let i = GRID_SIZE - 1; i >= 0; i--) {
            if (grid[i][j]) {
                grid[emptyRow][j] = grid[i][j];
                if (i !== emptyRow) grid[i][j] = null;
                emptyRow--;
            }
        }
        for (let i = 0; i <= emptyRow; i++) {
            grid[i][j] = ANIMAL_TYPES[Math.floor(Math.random() * ANIMAL_TYPES.length)];
        }
    }
}

function gameLoop() {
    if (timeLeft <= 0) {
        alert(`Game Over! Final Score: ${score}`);
        return;
    }
    timeLeft--;
    timeElement.textContent = `Time: ${timeLeft}s`;
    setTimeout(gameLoop, 1000);
}

initializeGrid();
gameLoop();