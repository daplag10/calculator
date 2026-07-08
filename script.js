const currentEl = document.getElementById('current');
const historyEl = document.getElementById('history');

let current = '0';
let previous = null;
let operator = null;
let justCalculated = false;

function updateDisplay() {
  currentEl.textContent = current;
  historyEl.textContent = previous !== null
    ? `${previous} ${operator}`
    : '\u00A0';
}

function inputDigit(d) {
  if (current === '0' || justCalculated) {
    current = d;
    justCalculated = false;
  } else {
    current += d;
  }
  updateDisplay();
}

function inputDecimal() {
  if (justCalculated) {
    current = '0';
    justCalculated = false;
  }
  if (!current.includes('.')) {
    current += '.';
  }
  updateDisplay();
}

function toggleSign() {
  current = (parseFloat(current) * -1).toString();
  updateDisplay();
}

function percent() {
  current = (parseFloat(current) / 100).toString();
  updateDisplay();
}

function clearAll() {
  current = '0';
  previous = null;
  operator = null;
  justCalculated = false;
  updateDisplay();
}

function chooseOperator(op) {
  if (operator !== null && !justCalculated) {
    calculate();
  }
  previous = current;
  operator = op;
  justCalculated = true;
  updateDisplay();
}

function calculate() {
  if (operator === null || previous === null) return;

  const a = parseFloat(previous);
  const b = parseFloat(current);
  let result;

  switch (operator) {
    case '+': result = a + b; break;
    case '−': result = a - b; break;
    case '×': result = a * b; break;
    case '÷': result = b === 0 ? NaN : a / b; break;
    default: return;
  }

  current = Number.isNaN(result) ? 'Error' : trimResult(result);
  previous = null;
  operator = null;
  justCalculated = true;
  updateDisplay();
}

function trimResult(num) {
  return Math.round(num * 1e10) / 1e10 + '';
}

// keyboard support
document.addEventListener('keydown', (e) => {
  if (e.key >= '0' && e.key <= '9') inputDigit(e.key);
  else if (e.key === '.') inputDecimal();
  else if (e.key === '+') chooseOperator('+');
  else if (e.key === '-') chooseOperator('−');
  else if (e.key === '*') chooseOperator('×');
  else if (e.key === '/') { e.preventDefault(); chooseOperator('÷'); }
  else if (e.key === 'Enter' || e.key === '=') calculate();
  else if (e.key === 'Escape') clearAll();
  else if (e.key === 'Backspace') {
    current = current.length > 1 ? current.slice(0, -1) : '0';
    updateDisplay();
  }
});

updateDisplay();
