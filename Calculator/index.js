
const display = document.getElementById('display');
let calculationDone = false;
let decimal = false;

function appendToDisplay(input){
    var operators = ["+", "-", "*", "/"];
    var lastChar = display.value[display.value.length - 1];

    // Checking calculation if it's done
    if (calculationDone){
        if(operators.includes(input)){
            calculationDone = false;
            decimal = false;
        }
        else if (input !== 'C'){
            return;
        }
    }

    // Check the decimal at length 0
    if(display.value === ""){
        if (input === "."){
            display.value = "";            
            return;
        }
        else if(!operators.includes(input)){
            display.value += input;
            return;
        }
    }

    // Check the decimal after operators
    if (operators.includes(lastChar)){
        if (input === "."){
            return;
        }
        else if(!operators.includes(input)){
            display.value += input;
            return;
        }
    }

    // Checking leading 0 (i.e. 000001)
    if(display.value.length == 1 && display.value === "0"){
        if (input === "0"){
            display.value = "0";
            return;
        }
        else if(!operators.includes(input)){
            display.value += input;
            return;
        }
    }

    if (operators.includes(input)){
        if (display.value !== "" || input === "-"){
            if (operators.includes(lastChar)){
                if (input != lastChar){
                    display.value = display.value.slice(0, -1) + input;
                }
            }
            else{
                display.value += input;
            }
            decimal = false;
        }
    }
    else{
        if (input === "."){
            if (!decimal) {
                display.value += input;
                decimal = true;
            }
        } else { 
            display.value += input;
        }
        decimal = display.value.includes(".");
    }        
}

function clearDisplay(){
    display.value = "";
    calculationDone = false;
    decimal = false;
}

function safeEvaluate(expression) {
    if (/^[0-9+\-*/.\s]+$/.test(expression)) {
        return new Function('return ' + expression)();
    } else {
        throw new Error('Invalid expression');
    }
}

function calculate(){
    display.value =  parseFloat(safeEvaluate(display.value).toPrecision(9));
    safeEvaluate(display.value);
    calculationDone = true;
}

document.addEventListener("keydown", function(event) {
    const key = event.key;
    if ((key >= "0" && key <= "9") || (key === ".") || (key === "+" || key === "-" || key === "*" || key === "/")){
        appendToDisplay(key);
    }
    else if (key === "Enter"){
        calculate();
    }
    else if (key === "Backspace"){
        clearDisplay();
    }
    else if (key === "c" || key === "C"){
        clearDisplay();
    }
})