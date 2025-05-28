# Sudoku React App

A web-based Sudoku puzzle game built with React and Tailwind CSS.

## Features

•⁠ ⁠Generates a new Sudoku puzzle on page load
•⁠ ⁠Selectable difficulty levels: Easy, Medium, Hard
•⁠ ⁠Click a cell to input a number (input auto-focuses)
•⁠ ⁠Validates the board for conflicts

## Getting Started

### Prerequisites

•⁠ ⁠Node.js (v16 or higher recommended)
•⁠ ⁠npm or yarn

### Installation

1.⁠ ⁠Clone the repository:
⁠ bash
git clone <your-repo-url>
cd sudoku ⁠
2.⁠ ⁠Install dependencies:
⁠ bash
npm install

or

yarn install ⁠

### Running the App

Start the development server:
⁠ bash
npm run dev

or

yarn dev ⁠
Open your browser and go to ⁠http://localhost:5173⁠ (or the port shown in your terminal).

## Build for Production

To build the project for production (output will be in the ⁠ dist ⁠ folder):
⁠ bash
npm run build

or

yarn build ⁠
You can then preview the production build locally with:
⁠ bash
npm run preview

or

yarn preview ⁠

## Usage

•⁠ ⁠A Sudoku puzzle appears by default.
•⁠ ⁠Click any empty cell to enter a number (1-9).
•⁠ ⁠Use the "Check puzzle" button to validate your solution.
•⁠ ⁠Select a different difficulty to generate a new puzzle.

## Customization

•⁠ ⁠Change the default difficulty by editing the ⁠ generateNewBoard(35)⁠ call in ⁠ src/App.jsx ⁠.
•⁠ ⁠Styles are managed with Tailwind CSS and can be customized in ⁠ src/App.css ⁠ and ⁠ src/index.css ⁠.

## Tech Stack

•⁠ ⁠React
•⁠ ⁠Tailwind CSS
•⁠ ⁠Vite
•⁠ ⁠Lodash

## License

MIT