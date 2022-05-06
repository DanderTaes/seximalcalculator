
class Operate{
    constructor(){
        this.base = 6;
    }
    conversor_to_decimal(num){
        var digits = num.toString().split('');
        var arrayS = digits.map(Number);
        arrayS = arrayS.reverse();
        let result = 0;
        for (let i = 0; i < arrayS.length; i++) {
            result += arrayS[i] * (6**i);
        }
        return result;
    }
    conversor_to_seximal(num){
        let temp_number = "";
        if (num >= 6){
            while (num >= 6){
                temp_number = (`${num%6}${temp_number}`);
                num = (num / 6) >> 0;
            }
            num = parseInt(`${num}${temp_number}`);
        }
        return num;
    }
    seximal_manager_to_decimal(num){
        var neg;
        if (num < 0){
            num = Math.abs(num);
            neg = true;
        } 
        else {
            neg = false;
        }
        let num_float = parseFloat(num);
        if (Number.isInteger(num_float)){
            var units = num;
        }
        else {
            var seximal_numbers = num.toString().split('.');
            var units = parseInt(seximal_numbers[0]);
            let digits = seximal_numbers[1].toString().length;
            seximal_numbers[1] = this.conversor_to_decimal(seximal_numbers[1]);
            var decimals = Math.round((seximal_numbers[1]/6**digits)*1000000)/1000000;
        }
        units = this.conversor_to_decimal(units)
        if (typeof decimals == 'undefined') {
            num = units;
        }
        else{
            num = units + decimals;
        }
        if (neg == true) {
            num *= -1;            
        }
        return num;
    }
    decimal_manager_to_seximal(num){
        var neg;
        if (num < 0){
            num = Math.abs(num);
            neg = true;
        } 
        else {
            neg = false;
        }
        let num_float = parseFloat(num);
        if (Number.isInteger(num_float)){
            num = parseInt(num);
            var units = num;

        }
        else {
            var decimal_numbers = num.toString().split('.');
            var units = parseInt(decimal_numbers[0]);
            if (decimal_numbers[0] == undefined || decimal_numbers[1] == undefined){
                return undefined;
            }
            let digits = decimal_numbers[1].toString().length;
            var decimals = Math.round(parseFloat((`.${decimal_numbers[1]}`)*6**digits)*1000)/1000;
            console.log(decimals + " decimals");
            if (!Number.isInteger(decimals)){
                let decimal_decimals_array = num.toString().split('.');
                console.log(decimal_decimals_array + " decimals array");
                let decimal_decimals = decimal_decimals_array[1];
                digits += decimal_decimals.toString().length;
                decimals = decimal_decimals;
                console.log(decimals + " decimals " + digits);
            }
            while (decimals.toString().slice(-1) == "0"){
                decimals = decimals.toString().slice(0, -1);
                console.log(decimals)
            }
            console.log(decimals)
            decimals = parseInt(decimals);
            decimals = this.conversor_to_seximal(decimals);
            decimals = parseFloat(`.${decimals}`);
        }
        
        units = this.conversor_to_seximal(units);
        if (typeof decimals == 'undefined') {
            num = units;
        }
        else{
            num = units + decimals;
        }
        if (neg == true) {
            num *= -1;            
        }
        return num;
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
                return "mE"
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

prueba = op.decimal_manager_to_seximal(0.1);
console.log(prueba);


// else {
//     var decimal_numbers = num.toString().split('.');
//     var units = parseInt(decimal_numbers[0]);
//     if (decimal_numbers[0] == undefined || decimal_numbers[1] == undefined){
//         return undefined;
//     }
//     let digits = decimal_numbers[1].toString().length;
//     var decimals = Math.round(parseFloat((`.${decimal_numbers[1]}`)*6**digits));
//     while (decimals.toString().slice(-1) == "0"){
//         decimals = decimals.toString().slice(0, -1);
//     }
//     decimals = parseInt(decimals);
//     decimals = this.conversor_to_seximal(decimals);
//     decimals = parseFloat(`.${decimals}`);
// }



