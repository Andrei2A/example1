class Calculator {
    constructor() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = null;
        this.shouldResetScreen = false;

        this.currentDisplay = document.querySelector('.current-operand');
        this.previousDisplay = document.querySelector('.previous-operand');

        this.init();
    }

    init() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', () => {
                const action = button.dataset.action;
                const value = button.dataset.value;

                switch (action) {
                    case 'number':
                        this.appendNumber(value);
                        break;
                    case 'operator':
                        this.setOperator(value);
                        break;
                    case 'calculate':
                        this.calculate();
                        break;
                    case 'clear':
                        this.clear();
                        break;
                    case 'delete':
                        this.delete();
                        break;
                    case 'decimal':
                        this.appendDecimal();
                        break;
                    case 'percent':
                        this.percent();
                        break;
                }

                this.updateDisplay();
            });
        });

        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    handleKeyboard(e) {
        if (e.key >= '0' && e.key <= '9') this.appendNumber(e.key);
        if (e.key === '.') this.appendDecimal();
        if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/') this.setOperator(e.key);
        if (e.key === 'Enter' || e.key === '=') this.calculate();
        if (e.key === 'Backspace') this.delete();
        if (e.key === 'Escape') this.clear();
        if (e.key === '%') this.percent();

        this.updateDisplay();
    }

    appendNumber(number) {
        if (this.shouldResetScreen) {
            this.currentOperand = '';
            this.shouldResetScreen = false;
        }

        if (this.currentOperand === '0' && number !== '.') {
            this.currentOperand = number;
        } else if (this.currentOperand.length < 15) {
            this.currentOperand += number;
        }
    }

    appendDecimal() {
        if (this.shouldResetScreen) {
            this.currentOperand = '0';
            this.shouldResetScreen = false;
        }

        if (!this.currentOperand.includes('.')) {
            this.currentOperand += '.';
        }
    }

    setOperator(op) {
        if (this.operator !== null && !this.shouldResetScreen) {
            this.calculate();
        }

        this.operator = op;
        this.previousOperand = this.currentOperand;
        this.shouldResetScreen = true;
    }

    calculate() {
        if (this.operator === null || this.shouldResetScreen) return;

        const prev = parseFloat(this.previousOperand);
        const current = parseFloat(this.currentOperand);
        let result;

        switch (this.operator) {
            case '+':
                result = prev + current;
                break;
            case '-':
                result = prev - current;
                break;
            case '*':
                result = prev * current;
                break;
            case '/':
                result = current === 0 ? 'Error' : prev / current;
                break;
            default:
                return;
        }

        this.currentOperand = result === 'Error' ? result : this.formatResult(result);
        this.operator = null;
        this.previousOperand = '';
        this.shouldResetScreen = true;
    }

    formatResult(result) {
        if (result.toString().length > 15) {
            return parseFloat(result.toPrecision(10)).toString();
        }
        return result.toString();
    }

    percent() {
        this.currentOperand = (parseFloat(this.currentOperand) / 100).toString();
    }

    delete() {
        if (this.currentOperand.length === 1 || this.currentOperand === 'Error') {
            this.currentOperand = '0';
        } else {
            this.currentOperand = this.currentOperand.slice(0, -1);
        }
    }

    clear() {
        this.currentOperand = '0';
        this.previousOperand = '';
        this.operator = null;
        this.shouldResetScreen = false;
    }

    getOperatorSymbol() {
        const symbols = { '+': '+', '-': '−', '*': '×', '/': '÷' };
        return symbols[this.operator] || '';
    }

    updateDisplay() {
        this.currentDisplay.textContent = this.currentOperand;
        this.previousDisplay.textContent = this.operator
            ? `${this.previousOperand} ${this.getOperatorSymbol()}`
            : '';
    }
}

new Calculator();
