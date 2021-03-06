import React from 'react';
import './index.css';
import ReactDOM from "react-dom";

const Square = ({value, onClick}) =>
  <button className="square" onClick={onClick}>
    {value}
  </button>

class Board extends React.Component {
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {squares: Array(9).fill(null)}
      ],
      isXNext: true,
    }
  }

  handleClick = i => {
    const history = this.state.history;
    const squares = [...history.at(-1).squares];
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.isXNext ? 'X' : 'O';
    this.setState({
      history: [...history, {squares}],
      isXNext: !this.state.isXNext,
    });
  }

  getStatus() {
    const winner = calculateWinner(this.state.history.at(-1).squares);
    const nextPlayer = (this.state.isXNext ? 'X' : 'O');
    return winner ? `${winner} won!` : `Next player: ${nextPlayer}`;
  }

  jumpTo(stepIdx) {
    this.setState({
      history: this.state.history.slice(0, stepIdx + 1),
      isXNext: stepIdx % 2 === 0,
    });
  }

  getMoves() {
    return this.state.history.map((_, idx) => {
      const desc = idx ? `Перейти к ходу ${idx}` : 'К началу игры';
      return (
        <li key={idx}>
          <button onClick={() => this.jumpTo(idx)}>{desc}</button>
        </li>
      );
    });
  }

  render() {
    const squares = this.state.history.at(-1).squares;
    const isXNext = this.state.isXNext;
    const onClick = this.handleClick;

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={squares}
            isXNext={isXNext}
            onClick={onClick}
          />
        </div>
        <div className="game-info">
          <div>{this.getStatus()}</div>
          <ol>{this.getMoves()}</ol>
        </div>
      </div>
    );
  }
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
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById('root'));
