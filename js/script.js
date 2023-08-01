
class Operate{
    constructor(){
        this.base = 6;
        this.max_decimals = 10;
    }
    conversor_to_decimal(num, decimals=false){ // convert whole number in base 6 to decimal
        var digits = num.toString().split('');
        var arrayS = digits.map(Number); //converts the numbers from str to int
        let result = 0;
        if (decimals){
            for (let i = 0; i < arrayS.length; i++) { // iterate through all decimals and multiply it by 1/6^n
                result += arrayS[i] * (1/(this.base**(i+1)))
            }
        } else{
            arrayS = arrayS.reverse();
            for (let i = 0; i < arrayS.length; i++) { // iterate through all whole numbers, inversly,  and multiply it by 6^n
                result += arrayS[i] * (this.base**i)
            }
        }
        
        return result;
    }
    conversor_to_seximal(num){ // convert whole number in base 10 to seximal
        let temp_number = "";
        if (num >= this.base){
            while (num >= this.base){
                temp_number = (`${num%this.base}${temp_number}`);
                num = (num / this.base) >> 0; // the bit operator just makes the result an int
            }
            num = parseInt(`${num}${temp_number}`);
        }
        return num;
    }
    seximal_manager_to_decimal(num){ // convert from base 6 to base 10, distinguishing between whole numbers and decimals
        var neg;
        let result;
        if (num < 0){
            num = Math.abs(num);
            neg = true;
        } 
        else {
            neg = false;
        }
        if (num % 1 != 0){
            let seximal_numbers = num.toString().split('.');
            console.log(seximal_numbers);
            let units = this.conversor_to_decimal(parseInt(seximal_numbers[0]));
            let decimals = this.conversor_to_decimal(seximal_numbers[1], true); // we pass it a string so the 0's to the left stay
            result = units + decimals;
            result = Math.round(result*(10**this.max_decimals))/(10**this.max_decimals);
        } else {
            result = this.conversor_to_decimal(num);
        }
        if (neg == true) {
            result *= -1;            
        }
        return result;
    }
    decimal_manager_to_seximal(num){ // function to manage the decimals and digits to convert them to seximal
        var neg;
        let result = num;
        if (num < 0){
            num = Math.abs(num);
            neg = true;
        } else {
            neg = false;
        }
        
        //manage floating point numbers
        if (num % 1 != 0){ //if the number has decimals (x.0 doesn't count)´
            let decimal_numbers = num.toString().split('.');
            let units = parseInt(decimal_numbers[0]);
            units = this.conversor_to_seximal(units);

            let processing_seximal = decimal_numbers[1];
            let whole_decimals = "";
            while (whole_decimals.length < this.max_decimals) { // we loop until we have 10 decimals
                processing_seximal = Math.round(parseFloat((`.${processing_seximal}`)*this.base)*(10**this.max_decimals))/(10**this.max_decimals);
                let processing_list = processing_seximal.toString().split('.'); // processing_list[0] is the whole number and processing_list[1] is the decimals
                whole_decimals = whole_decimals + processing_list[0];
                processing_seximal = processing_list[1];

                if (processing_seximal == "0"){
                    break;
                }                
            }
            result = parseFloat(`${units}.${whole_decimals}`);

        } else{ //if there's no decimals
            result = this.conversor_to_seximal(num);
        }

        if (neg == true) {
            result *= -1;            
        }
        return result;
    }
    is_int(num){
        if (Number.isInteger(num)){
            return parseInt(num);
        }
        else{
            return num
        }
    }
    operator(num1, num2, sign){
        const operations = ["+", "-", "*", "/", "^"]
        if (sign == operations[0]){
            var result = num1 + num2;
        }
        else if (sign == operations[1]){
            var result = num1 - num2;
        }
        else if (sign == operations[2]){
            var result = Math.round(num1 * num2*1000)/1000;
            result = this.is_int(result);
        }
        else if (sign == operations[3]){
            var result = Math.round((num1/num2)*1000)/1000;
            result = this.is_int(result);
        }
        else if (sign == operations[4]){
            var result = Math.round((num1**num2)*1000)/1000;
        }
        else{
            result = undefined;
        }
        if (result.toString().includes("e")){
            result = "mE"
        }
        return result;
    }
    action(num1, num2, sign){
        let str_num1 = num1.toString().split('');
        let str_num2 = num2.toString().split('');
        var filtered1 = str_num1.filter(function(value, index, arr){ 
            return value !== ".";
        });
        var filtered2 = str_num2.filter(function(value, index, arr){ 
            return value !== ".";
        });
        var lists = [filtered1, filtered2];
        for (let i = 0; i < 2; i++)
            for (let j = 0; j < lists[i].length; j++){
                if (lists[i][j] >= 6){
                    return undefined;
                }
            }

        var num1_decimal = this.seximal_manager_to_decimal(num1);
        var num2_decimal = this.seximal_manager_to_decimal(num2);
        try {
            var result_decimal = this.operator(num1_decimal, num2_decimal, sign);
            if (typeof result_decimal == "string"){
                return "mE";
            }
        } catch (e){
            return undefined;
        }
        var result_seximal = this.decimal_manager_to_seximal(result_decimal);
        return result_seximal;
    }
}

var operationArray = [];
var resultData = false;
const op = new Operate();
function dis(val){
    const operations = ["+", "-", "*", "/", "^"]
    if (val == "." && document.getElementById("result").value.includes(".")){}
    else if (!isNaN(document.getElementById("result").value)|| document.getElementById("result").value == ""){
        document.getElementById("result").value+=val;
    }
    else if (operations.includes(document.getElementById("result").value)){
        document.getElementById("result").value=val;
    }
}
function solve(){
    if (operationArray.length == 2 && !isNaN(document.getElementById("result").value)){
        operationArray.push(document.getElementById("result").value);
        document.getElementById("processLabel").innerHTML = operationArray.join(" ");
        result = op.action(operationArray[0], operationArray[2], operationArray[1]);
        if (result == undefined){
            document.getElementById("result").placeholder = "Input Error";
            document.getElementById("result").value = "";
        }
        else if (result == "mE"){
            document.getElementById("result").placeholder = "Math Error";
            document.getElementById("result").value = "";
            operationArray.length = 0;
        }
        else{document.getElementById("result").value = result;}
        operationArray.length = 0;
    }
}
function oper(val){
    const operations = ["+", "-", "*", "/", "^"]
    if (document.getElementById("result").value == ""){}
    else if (operations.includes(document.getElementById("result").value)){
        operationArray[1] = val;
        document.getElementById("result").value = val;
    }
    else if (!isNaN(document.getElementById("result").value)){
        let len = operationArray.length;
        operationArray.push(document.getElementById("result").value);
        if (len == 0){
            operationArray.push(val);
        }
        else if (operationArray.length == 3){
            result = op.action(operationArray[0], operationArray[2], operationArray[1]);
            if (result == undefined){
                document.getElementById("result").placeholder = "Input Error";
                document.getElementById("result").value = "";
                operationArray.length = 0;
            }
            else if (result == "mE"){
                document.getElementById("result").placeholder = "Math Error";
                document.getElementById("result").value = "";
                operationArray.length = 0;
            }
            else{
                operationArray.length = 0;
                operationArray.push(result.toString());
                operationArray.push(val);                
            }
            
        }
        document.getElementById("processLabel").innerHTML = operationArray.join(" ")
        document.getElementById("result").value = val
    }
}
function clr(){
    document.getElementById("processLabel").innerHTML = " "
    document.getElementById("result").value="";
    operationArray.length = 0;
    document.getElementById("result").placeholder = "Calculations";
}
function remove(){
    if (!isNaN(document.getElementById("result").value)){
        document.getElementById("result").value = document.getElementById("result").value.slice(0, -1);
    }
    if (document.getElementById("result").value == ""){
        document.getElementById("result").placeholder = "Calculations";
    }
}
function change_sign(){
    if (!isNaN(document.getElementById("result").value) && document.getElementById("result").value !== ""){
        document.getElementById("result").value = parseFloat(document.getElementById("result").value)*-1
    }

}
function convert(to){
    if (document.getElementById("decimal").value !== "" && !isNaN(document.getElementById("decimal").value )&& to == "seximal"){
        document.getElementById("seximal").value = op.decimal_manager_to_seximal(document.getElementById("decimal").value)
    }
    if (document.getElementById("seximal").value !== "" && !isNaN(document.getElementById("seximal").value) && to == "decimal"){
        document.getElementById("decimal").value = op.seximal_manager_to_decimal(document.getElementById("seximal").value)
    }
}

let value = 10
prueba = op.conversor_to_decimal(value);
// console.log(value);
// console.log(prueba);

//TODO: Fix calculator function and add sqrt






