const displayMain = document.getElementById('display-main');
const displayFormula = document.getElementById('display-formula');

let currentExpression = '';
let lastResult = '';
let memoryValue = 0;
let shouldReset = false;

function updateDisplay(text) {
    const displayText = text || '0';
    displayMain.innerText = displayText;
    
    if (displayText.length > 8) {
        displayMain.style.fontSize = '2.5rem';
    } else {
        displayMain.style.fontSize = '4.5rem';
    }
}

function addNumber(num) {
    if (shouldReset) {
        currentExpression = num === '.' ? '0.' : num;
        shouldReset = false;
    } else {
        const parts = currentExpression.split(/[\+\-x÷]/);
        const lastPart = parts[parts.length - 1];
        if (num === '.' && lastPart.includes('.')) return;
        currentExpression = currentExpression === '0' ? num : currentExpression + num;
    }
    updateDisplay(currentExpression);
}

function addOperator(op) {
    if (currentExpression === '' && lastResult !== '') {
        currentExpression = lastResult;
    }
    if (currentExpression === '') return;

    const lastChar = currentExpression.slice(-1);
    if (['+', '-', 'x', '÷'].includes(lastChar)) {
        currentExpression = currentExpression.slice(0, -1) + op;
    } else {
        currentExpression += op;
    }
    shouldReset = false;
    updateDisplay(currentExpression);
}

function handlePercentage() {
    if (currentExpression === '') return;
    
    const parts = currentExpression.split(/([\+\-x÷])/);
    let lastNumber = parts.pop();
    
    if (lastNumber === '' && parts.length > 0) {
        parts.pop();
        lastNumber = parts.pop();
    }

    const percentValue = (parseFloat(lastNumber) / 100).toString();
    currentExpression = parts.join('') + percentValue;
    updateDisplay(currentExpression);
}

function calculate() {
    if (currentExpression === '') return;

    let expressionToEval = currentExpression.replace(/x/g, '*').replace(/÷/g, '/');
    
    try {
        const result = eval(expressionToEval);
        const formattedResult = Number(parseFloat(result.toFixed(10))).toString();
        
        displayFormula.innerText = currentExpression + ' =';
        displayMain.innerText = formattedResult;
        
        lastResult = formattedResult;
        currentExpression = formattedResult;
        shouldReset = true;
    } catch (e) {
        displayMain.innerText = 'Erro';
        currentExpression = '';
    }
}

document.querySelectorAll('.btn-number').forEach(btn => {
    btn.addEventListener('click', () => addNumber(btn.dataset.value));
});

document.querySelectorAll('.btn-operator').forEach(btn => {
    btn.addEventListener('click', () => {
        const op = btn.dataset.operator;
        if (op) addOperator(op);
    });
});

document.getElementById('btn-equals').addEventListener('click', calculate);

document.getElementById('btn-ac').addEventListener('click', () => {
    currentExpression = '';
    lastResult = '';
    shouldReset = false;
    displayFormula.innerText = '';
    updateDisplay('0');
});

document.getElementById('btn-toggle').addEventListener('click', () => {
    if (currentExpression === '') return;
    const val = parseFloat(currentExpression) * -1;
    currentExpression = val.toString();
    updateDisplay(currentExpression);
});

document.getElementById('btn-percent').addEventListener('click', handlePercentage);

document.getElementById('btn-m-plus').addEventListener('click', () => {
    memoryValue += parseFloat(displayMain.innerText);
});

document.getElementById('btn-m-minus').addEventListener('click', () => {
    memoryValue -= parseFloat(displayMain.innerText);
});

document.getElementById('btn-mr').addEventListener('click', () => {
    currentExpression = memoryValue.toString();
    shouldReset = false;
    updateDisplay(currentExpression);
});

document.getElementById('btn-mc').addEventListener('click', () => {
    memoryValue = 0;
});