
const display = document.getElementById('display');
let calculationDone = false;
let decimal = false;
const operators = ["+", "-", "*", "/"];

function appendToDisplay(input){
    var lastChar = display.value[display.value.length - 1];

    // Cannot add operators after "Error"
    if(display.value === "Error"){
        operatorAfterError(input);
        return;
    }

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
        checkDecimalAtFirst(input);
        return;
    }

    // Can't put multiple dots (.) 
    if (lastChar === "." && input === "."){
        return;
    }
    
    // Prevent multiple operators and handle replacement of the last operator
    if (operators.includes(input)) {
        if (display.value !== "" || input === "-") {
            if (operators.includes(lastChar)) {
                display.value = display.value.slice(0, -1) + input;
            } else {
                display.value += input;
            }
            decimal = false;
        }
        return;
    }

    // if (operators.includes(lastChar) && operators.includes(input)) {
    //     display.value = display.value.slice(0, -1) + input;
    //     return;
    // }

    if (display.value === "0" && !operators.includes(input) && input !== ".") {
        if (input === "0") {
            return;
        }
        else{
            display.value = input;
            return;
        }
    }

    // Checking leading 0 (i.e. 000001)
    if(display.value.length == 1 && display.value === "0"){
        checkLeadingZero(input);
        return;
    }

    if (input === ".") {
        if (!decimal) {
            display.value += input;
            decimal = true;
        }
    } else {
        display.value += input;
    }

    decimal = display.value.includes(".");

}

function checkDecimalAtFirst(input){
        if (input === "."){
            display.value = "0.";      
            decimal = true;
        }
        // if it's -, allow it
        else if (input === "-"){
            display.value = "-";    
        }
        else if(!operators.includes(input)){
            display.value += input;
        }
}

function checkDecimalAfterOperators(input){
    if (input === "." && !operators.includes(lastChar)) {
        display.value += "0.";
        decimal = true;
    } else if (!operators.includes(input)) {
        display.value += input;
    }
}

function checkLeadingZero(input){
    if (input === "0"){
        display.value = "0";
        return;
    }
    else if(!operators.includes(input)){
        display.value += input;
        return;
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

function operatorAfterError(input){
    if (operators.includes(input)){
        return;
    }
}

function calculate(){
    try{
        const result = safeEvaluate(display.value);

        if (result === Infinity || result === -Infinity){
            display.value = "Error";
        }
        else{
            display.value =  parseFloat(safeEvaluate(display.value).toPrecision(9));   
             calculationDone = true;
        }
    }
    catch(e){
        display.value = "Error";
    }
    
}

function reverseSign(){
    const firstChar = display.value[0];
    if (firstChar === "-"){
        display.value = display.value.substring(1);
    }
    else{
        if (display.value[0] === "0" && display.value.length == 1){
            return;
        }
        display.value = "-" + display.value;
    }
}

function calculatePercentage(){
    var result = parseFloat(safeEvaluate(display.value[0]/100.0).toPrecision(9));
    display.value = result;
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
