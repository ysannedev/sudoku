import { useState, useEffect, useRef } from 'react'
import _ from 'lodash';
import './App.css'

// create a 2D array and fill with zeros
function generateEmptyBoard() {
	return Array(9).fill(null).map(() => Array(9).fill(0));
}

// create an array filled with numbers from 1 to 9
function numbers1To9() {
	return [...Array(9).keys().map(x => x + 1)];
}

// use empty board to create a solved sudoku puzzle then remove numbers
function generateNewBoard(numberOfEmpties) {
	const completedBoard = _.cloneDeep(generateEmptyBoard());
	initialiseBoard(completedBoard);
	populateBoard(completedBoard);
	emptyCells(completedBoard, numberOfEmpties);
	return completedBoard;
}

// to speed up creation of sudoku puzzle, fill in numbers in diagonal boxes
function initialiseBoard(board) {
	const boxStartIndexes = [0, 3, 6];
	for (let x = 0; x < boxStartIndexes.length; x++) {
		let numbers = numbers1To9();
		numbers = _.shuffle(numbers);
		let numberIndex = 0;
		for (let i = 0; i < 3; i++) {
			for (let j = 0; j < 3; j++) {
				board[boxStartIndexes[x] + i][boxStartIndexes[x] + j] = numbers[numberIndex];
				numberIndex++;
			}
		}
	}
}

// fill in board with numbers, keeping the sudoku board valid
function populateBoard(board) {
	// loop through rows and cells in row to fill in numbers
	for (let row = 0; row < 9; row++) {
		for (let col = 0; col < 9; col++) {
			// check if a number is already assigned at this cell
			if (board[row][col] === 0) {
				// add a random number at this cell
				let numbers = numbers1To9();
				numbers = _.shuffle(numbers);
				for (let number of numbers) {
					if (isNumberAllowed(board, row, col, number).length < 1) {
						// assign number to cell
						board[row][col] = number;

						// populate remaining board cells
						if (populateBoard(board)) {
							return true;
						}

						// undo assignment
						board[row][col] = 0;
					}
				}
				return false;
			}
		}
	}
	return true;
}

// check if a number in cell is valid in row, column and box
function isNumberAllowed(board, row, col, number) {
	const conflictingCells = [];

	if (typeof number !== 'number' || (number > 9 && number < 0)) {
		conflictingCells.push({row, col, debug: 1});
	}

	// check row
	for (let i = 0; i < 9; i++) {
		if (i !== col && board[row][i] === number) {
			// number is present somewhere else on this row
			conflictingCells.push({row, col: i, debug: 2});
			// return false;
		}
	}

	// check column
	for (let i = 0; i < 9; i++) {
		if (i !== row && board[i][col] === number) {
			// number is present somewhere else on this column
			conflictingCells.push({row: i, col, debug: 3});
			// return false;
		}
	}

	// check box
	// first get starting index of box
	const boxRowStart = row - (row % 3);
	const boxColStart = col - (col % 3);

	for (let i = boxRowStart; i < boxRowStart + 3; i++) {
		for (let j = boxColStart; j < boxColStart + 3; j++) {
			if (i !== row && j !== col && board[i][j] === number) {
				// number is present somewhere else in this box
				conflictingCells.push({row: i, col: j, debug: 4});
				// return false;
			}
		}
	}

	// number is valid, as no duplicate in row, column or box
	// return true;
	return conflictingCells;
}

// remove random numbers from board
function emptyCells(board, numberOfEmpties) {
	while (numberOfEmpties) {
		const randomRow = Math.floor(Math.random() * 9);
		const randomCol = Math.floor(Math.random() * 9);
		if (board[randomRow][randomCol] !== 0) {
			board[randomRow][randomCol] = 0;
			numberOfEmpties--;
		}
	}
}

function App() {
	const [board, setBoard] = useState([]);
	const [originalBoard, setOriginalBoard] = useState([]);
	const [selectedCell, setSelectedCell] = useState(null);
	const [conflictedBoard, setConflictedBoard] = useState({});
	const [gameWon, setGameWon] = useState(false);
	const [hintCell, setHintCell] = useState(null);
	const inputRef = useRef(null);
	const difficultyLevels = [
		{color: 'emerald', numberOfEmpties: 20, text: 'Easy'},
		{color: 'amber', numberOfEmpties: 35, text: 'Medium'},
		{color: 'red', numberOfEmpties: 50, text: 'Hard'},
	];

	// focus on input when a cell is clicked
	useEffect(() => {
		if (inputRef.current) {
			inputRef.current.focus();
		}
	}, [selectedCell]);

	// show a sudoku puzzle on load
	useEffect(() => {
		const newBoard = generateNewBoard(35);
		setOriginalBoard(_.cloneDeep(newBoard));
		setBoard(newBoard);
	}, []);

	// create a new sudoku puzzle
	function createPuzzle(numberOfEmpties) {
		const newBoard = generateNewBoard(numberOfEmpties);
		setOriginalBoard(_.cloneDeep(newBoard));
		setBoard(newBoard);
		setConflictedBoard({});
	}

	// handle when cell is clicked
	function handleCellClick(row, col) {
		if (originalBoard[row][col] === 0) {
			setSelectedCell({row, col});
		}
		setConflictedBoard({});
		setHintCell(null);
	}

	// handle when cell number has changed
	function handleCellChange(e) {
		setBoard(currBoard => {
			const inputValue = +e.target.value;
			const newBoard = _.cloneDeep(currBoard);
			newBoard[selectedCell.row][selectedCell.col] = inputValue;
			return newBoard;
		})
		setSelectedCell(null);
	}

	// check if the board is complete and valid
	function checkBoard() {
		let boardValid = true;
		let newConflictedBoard = {};
		for (let i = 0; i < 9; i++) {
			newConflictedBoard[i] = {};
			for (let j = 0; j < 9; j++) {
				if (originalBoard[i][j] === 0) {
					if (board[i][j] > 0) {
						if (isNumberAllowed(board, i, j, board[i][j]).length > 0) {
							boardValid = false;
							newConflictedBoard[i][j] = true;
						}
					} else {
						boardValid = false;
						newConflictedBoard[i][j] = true;
					}
				}
			}
		}
		setConflictedBoard(newConflictedBoard);
		setGameWon(boardValid);
		return boardValid;
	}

	function getHint() {
		console.log('getHint');
		let emptyCell = null;
		while (!emptyCell) {
			const row = Math.floor(Math.random() * 9);
			const col = Math.floor(Math.random() * 9);
			if (board[row][col] === 0) {
				emptyCell = {row, col};
			}
		}
		let numbers = numbers1To9();
		numbers = _.shuffle(numbers);
		for (let number of numbers) {
			if (isNumberAllowed(board, emptyCell.row, emptyCell.col, number).length < 1) {
				setHintCell({row: emptyCell.row, col: emptyCell.col, number});
			}
		}
	}

	return (
		<div className='flex flex-col items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-3xl text-white font-bold'>Sudoku</h1>
			</div>
			{ board.length && (
				<>
					{ gameWon &&
						<div className='text-white text-center w-110 mt-2 p-2 bg-emerald-500 rounded'>You won!</div> }
					<div className='my-4'>
						<button onClick={ checkBoard }
								className='bg-blue-500 text-white py-2 px-4 mx-2 rounded cursor-pointer hover:bg-blue-600'>Check
							puzzle
						</button>
						<button onClick={ getHint }
								className='bg-blue-500 text-white py-2 px-4 mx-2 rounded cursor-pointer hover:bg-blue-600'>Hint
						</button>
					</div>
					<div
						className='border-l-3 border-t-3 border-r-1 border-b-1 border-slate-500 text-white'>
						<div className='flex flex-col items-center'>
							{ board.map((row, i) => (
								<div key={ i }
									 className='border-y-1 nth-[3n]:border-b-3 border-slate-500 flex flex-row'>
									{ row.map((col, j) => (
										<div key={ `${ i }${ j }` }
											 className={ `border-x-1 nth-[3n]:border-r-3 border-slate-500 size-12 flex items-center justify-center ${ originalBoard[i][j] ? 'cursor-not-allowed' : 'bg-slate-700 cursor-pointer hover:bg-slate-500' } ${ conflictedBoard[i]?.[j] ? 'bg-red-500!' : '' }` }
											 onClick={ () => {
												 handleCellClick(i, j)
											 } }
										>
											{ selectedCell && selectedCell.row === i && selectedCell.col === j ? (
												<input ref={ inputRef } type='number' min='1' max='9'
													   name={ `cell-${ i }-${ j }` }
													   className='bg-slate-400 h-full w-full text-center focus:outline-0'
													   onChange={ handleCellChange }/>
											) : (col !== 0 ? col : <span
												className={ hintCell?.row === i && hintCell?.col === j ? 'flex size-full items-center justify-center bg-slate-400 text-bold' : '' }>{ hintCell?.row === i && hintCell?.col === j ? hintCell.number : '' }</span>) }
										</div>
									)) }
								</div>
							)) }
						</div>
					</div>
				</>
			) }
			<div className='text-white'>
				<span>Select difficulty</span>
				{ difficultyLevels.map(level => <button
					key={ level.text }
					onClick={ () => {
						createPuzzle(level.numberOfEmpties)
					} }
					className={ `bg-${ level.color }-500 text-white py-2 px-4 m-2 my-4 rounded cursor-pointer hover:bg-${ level.color }-600` }>{ level.text }
				</button>) }
			</div>
		</div>
	)
}

export default App