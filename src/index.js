import React from "react";
import ReactDOM from "react-dom/client";
import { useState } from "react";
import "./index.css";

function Square({ value, onSquareClick, isWinningSquare }) {
	return (
		<button 
			className={`square ${isWinningSquare ? "winning" : ""}`}
			onClick={onSquareClick}
		>
			{value}
		</button>
	);
}

function calculateWinner(squares) {
	const lines = [
		[0, 1, 2],
		[3, 4, 5],
		[6, 7, 8],
		[0, 3, 6],
		[1, 4, 7],
		[2, 5, 8],
		[0, 4, 8],
		[2, 4, 6],
	];
	for (let i = 0; i < lines.length; i++) {
		const [a, b, c] = lines[i];
		if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
			return { winner: squares[a], winningSquares: [a, b, c] };
		}
	}
	return { winner: null, winningSquares: [] };
}

function Board({ xIsNext, squares, onPlay }) {
	const { winner, winningSquares } = calculateWinner(squares);
	let status;
	if (winner) {
		status = "Winner: " + winner;
	} else if (squares.every(square => square !== null)) {
		status = "It's a draw!";
	} else {
		status = "Next player: " + (xIsNext ? "X" : "O");
	}

	function handleClick(i) {
		if (squares[i] || winner) {
			return;
		}
		const nextSquares = squares.slice();
		if (xIsNext) {
			nextSquares[i] = "X";
		} else {
			nextSquares[i] = "O";
		}
		onPlay(nextSquares);
	}

	const boardRows = [];
	for (let row = 0; row < 3; row++) {
		const boardSquares = [];
		for (let col = 0; col < 3; col++) {
			const index = row * 3 + col;
			const isWinningSquare = winningSquares.includes(index);
			boardSquares.push(
				<Square 
					key={index}
					value={squares[index]}
					onSquareClick={() => handleClick(index)}
					isWinningSquare={isWinningSquare}
				/>
			);
		}
		boardRows.push(
			<div key={row} className="board-row">
				{boardSquares}
			</div>
		);
	}

	return (
		<>
			<div className="status">{status}</div>
			{boardRows}
		</>
	);
}

function Game() {
	const [history, setHistory] = useState([Array(9).fill(null)]);
	const [currentMove, setCurrentMove] = useState(0);
	const [isAscending, setIsAscending] = useState(true);
	const xIsNext = currentMove % 2 === 0;
	const currentSquares = history[currentMove];

	function handlePlay(nextSquares) {
		const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
		setHistory(nextHistory);
		setCurrentMove(nextHistory.length - 1);
	}

	function jumpTo(nextMove) {
		setCurrentMove(nextMove);
	}

	function toggleSortOrder() {
		setIsAscending(!isAscending); // Toggle the sorting order
	}

	const moves = history.map((squares, move) => {
		let description;
		if (move > 0) {
			const row = Math.floor((move - 1) / 3);
			const col = (move - 1) % 3;
			description = `Go to move #${move} (row: ${row}, col: ${col})`;
		} else {
			description = 'Go to game start';
		}
		if (move === currentMove) {
			return (
				<li key={move}>
					<span>You are at move #{move}</span>
				</li>
			);
		} else {
			return (
				<li key={move}>
					<button onClick={() => jumpTo(move)}>{description}</button>
				</li>
			);
		}
	});

	const sortedMoves = isAscending ? moves : moves.slice().reverse();

	return (
		<div className="game">
			<div className="game-board">
				<Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
			</div>
			<div className="game-info">
				<div>
					<button onClick={toggleSortOrder}>
						{isAscending ? "Sort Descending" : "Sort Ascending"}
					</button>
				</div>
				<ol>{sortedMoves}</ol>
			</div>
		</div>
	);
}

const rootElement = document.getElementById("root");
const root = ReactDOM.createRoot(rootElement);
root.render(<Game />);
