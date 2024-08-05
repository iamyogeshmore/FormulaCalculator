import React, { useState } from "react";
import { evaluate } from "mathjs";
import "./App.css";

function App() {
  const [num1, setNum1] = useState("");
  const [num2, setNum2] = useState("");
  const [num3, setNum3] = useState("");
  const [formula, setFormula] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const formulas = ["(a + b)^2", "(a - b)^2", "(a + b + c)^2", "(a - b - c)^2"];

  const handleFormulaClick = (selectedFormula) => {
    setFormula(selectedFormula);
  };

  const expandFormula = (formula) => {
    return formula
      .replace(/\((\w+)\s*\+\s*(\w+)\)\s*\^2/g, "($1^2 + 2*$1*$2 + $2^2)")
      .replace(/\((\w+)\s*-\s*(\w+)\)\s*\^2/g, "($1^2 - 2*$1*$2 + $2^2)")
      .replace(
        /\((\w+)\s*\+\s*(\w+)\s*\+\s*(\w+)\)\s*\^2/g,
        "($1^2 + $2^2 + $3^2 + 2*$1*$2 + 2*$2*$3 + 2*$3*$1)"
      )
      .replace(
        /\((\w+)\s*-\s*(\w+)\s*-\s*(\w+)\)\s*\^2/g,
        "($1^2 + $2^2 + $3^2 - 2*$1*$2 - 2*$2*$3 - 2*$3*$1)"
      );
  };

  const calculateResult = () => {
    if (!num1 || !num2 || !formula) {
      setError("Fields a, b, and formula are required");
      return;
    }

    if (isNaN(num1) || isNaN(num2) || (num3 && isNaN(num3))) {
      setError("Inputs must be valid numbers");
      return;
    }

    if (!/^[0-9a-c+\-*/^() ]+$/g.test(formula)) {
      setError("Formula contains invalid characters");
      return;
    }

    try {
      let evalFormula = formula
        .replace(/a/g, num1)
        .replace(/b/g, num2)
        .replace(/c/g, num3);

      evalFormula = expandFormula(evalFormula);

      const computedResult = evaluate(evalFormula);
      setResult(computedResult);
      setError("");
    } catch (error) {
      setError("Invalid formula");
    }
  };

  return (
    <div className="container">
      <h1 className="title">Formula Calculator</h1>

      <div className="input-group">
        <input
          type="number"
          value={num1}
          onChange={(e) => setNum1(e.target.value)}
          placeholder="Enter number a"
          className="input"
        />
      </div>
      <div className="input-group">
        <input
          type="number"
          value={num2}
          onChange={(e) => setNum2(e.target.value)}
          placeholder="Enter number b"
          className="input"
        />
      </div>
      <div className="input-group">
        <input
          type="number"
          value={num3}
          onChange={(e) => setNum3(e.target.value)}
          placeholder="Enter number c (optional)"
          className="input"
        />
      </div>
      <div className="input-group">
        <input
          type="text"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
          placeholder="Enter formula (use a, b, c)"
          className="input"
        />
      </div>
      <div className="formulas">
        {formulas.map((formula, index) => (
          <button
            key={index}
            onClick={() => handleFormulaClick(formula)}
            className="formula-button"
          >
            {formula}
          </button>
        ))}
      </div>
      <button onClick={calculateResult} className="button">
        Calculate
      </button>
      {error && <div className="error">{error}</div>}
      {result !== null && (
        <div className="result">
          <h2>Result: {result}</h2>
        </div>
      )}
    </div>
  );
}

export default App;
