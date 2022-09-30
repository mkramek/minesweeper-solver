import './App.css';
import React, { useReducer, useRef } from 'react';
import styles from './Minesweeper.module.css';

const initialState = {
  cols: 2,
  rows: 2,
  solved: false
};

const reducer = (state, action) => {
  switch (action.type) {
    case 'reset':
      return initialState;
    case 'solve':
      return {
        ...state,
        solved: true
      }
    case 'unsolve':
      return {
        ...state,
        solved: false
      }
    case 'rows.increase':
      return {
        ...state,
        rows: state.rows + 1
      }
    case 'rows.decrease':
      return {
        ...state,
        rows: state.rows === 1 ? state.rows : state.rows - 1
      }
    case 'cols.increase':
      return {
        ...state,
        cols: state.cols + 1
      }
    case 'cols.decrease':
      return {
        ...state,
        cols: state.cols === 1 ? state.cols : state.cols - 1
      }
    default:
      throw new Error('Unexpected action type');
  }
}

function App() {
  
  const [state, dispatch] = useReducer(reducer, initialState);

  const results = useRef();

  const clear = () => {
    for (let row = 0; row < state.rows; row++) {
      for (let col = 0; col < state.cols; col++) {
        document.getElementById(`mines-${col}-${row}`).checked = false;
      }
    }
  }

  const reset = () => {
    clear();
    results.current.innerHTML = '';
    dispatch({ type: 'reset' })
  };

  const calculate = () => {
    const minesMatrix = createMatrixFromCheckboxes(state.cols, state.rows);
    const solution = calculateMines(minesMatrix);
    dispatch({ type: 'solve' });
    results.current.innerHTML = printMatrix(solution);
  };

  const createMatrixFromCheckboxes = (columns, rows) => {
    let matrix = [];
    for (let row = 0; row < rows; row++) {
      matrix.push([]);
      for (let col = 0; col < columns; col++) {
        if (document.getElementById(`mines-${col}-${row}`).checked) {
          matrix[row].push(true);
        } else {
          matrix[row].push(false);
        }
      }
    }
    return matrix;
  }

  const calculateMines = (matrix) => {
    let target = [];
    for (let i = 0; i < matrix.length; i++) {
      target.push([]);
      for (let j = 0; j < matrix[i].length; j++) {
        if (matrix[i][j] === false) {
          let count = 0;
          if (!!matrix[i - 1]) {
            if (matrix[i - 1][j - 1] === true) count++;
            if (matrix[i - 1][j] === true) count++;
            if (matrix[i - 1][j + 1] === true) count++;
          }
          if (matrix[i][j - 1] === true) count++;
          if (matrix[i][j + 1] === true) count++;
          if (!!matrix[i + 1]) {
            if (matrix[i + 1][j - 1] === true) count++;
            if (matrix[i + 1][j] === true) count++;
            if (matrix[i + 1][j + 1] === true) count++;
          }
          target[i][j] = count;
        } else {
          target[i][j] = '<span style="color: red">X</span>';
        }
      }
    }
    return target;
  }

  const printMatrix = (matrix) => {
    let string = '';
    for (const col of matrix) {
      for (const row of col) {
        string += `${row} `;
      }
      string += '<br/>';
    }
    return string;
  }

  let inputs = [];

  for (let i = 0; i < state.rows; i++) {
    for (let j = 0; j < state.cols; j++) {
      inputs.push(<input type="checkbox" key={`${j}-${i}`} id={`mines-${j}-${i}`} className={styles.input} />);
    }
    inputs.push(<br key={`br-${i}`} />);
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>Minesweeper Solver</h1>
        <div className={styles.buttons}>
          <button disabled={state.cols === 1} onClick={() => dispatch({ type: 'cols.decrease' })}>-</button>
          <span>Columns</span>
          <button onClick={() => dispatch({ type: 'cols.increase' })}>+</button>
        </div>
        <div className={styles.buttons}>
          <button disabled={state.rows === 1} onClick={() => dispatch({ type: 'rows.decrease' })}>-</button>
          <span>Rows</span>
          <button onClick={() => dispatch({ type: 'rows.increase' })}>+</button>
        </div>
        <div className={styles.container}>
          {inputs}
        </div>
        <button className={styles.summary_btn} onClick={calculate}>Solve the minesweeper!</button>
        <button className={styles.summary_btn} onClick={clear}>Clear the board</button>
        <button className={styles.summary_btn} onClick={reset}>Reset the solver</button>
        {!!state.solved && <h3>Solution:</h3>}
        <p ref={results} className={styles.results}></p>
      </header>
    </div>
  );
}

export default App;
