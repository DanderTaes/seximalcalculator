import math
class Operate:
    def __init__(self): 
        self.base = 6

    def decimal_manager_to_seximal(self, num): #:)
        c_number = num
        if c_number < 0:
            c_number= abs(c_number)
            neg = True 
        else:
            neg = False
        if type(c_number) == float and not c_number.is_integer():
            decimal_numbers = []
            decimal_numbers = str(c_number).split(".")
            units = int(decimal_numbers[0])            
            decimals = round(float(f".{decimal_numbers[1]}")*6**len(str(decimal_numbers[1])))
            
            decimals = str(decimals).replace(".", "") 
            if decimals != "0":
                decimals.rstrip("0")
            decimals = int(decimals)
            decimals = self.conversor_to_seximal(decimals)
        elif type(c_number) == float and c_number.is_integer():
            c_number = int(c_number)
            units = c_number
        else:
            units = c_number
        units = self.conversor_to_seximal(units)
        try:
            c_number = float(f"{units}.{decimals}")
        except UnboundLocalError:
            c_number = units
        if neg:
            c_number *= -1
        return c_number

    def seximal_manager_to_decimal(self, num): #:)
        c_number = num
        if c_number < 0:
            c_number= abs(c_number)
            neg = True 
        else:
            neg = False

        if type(c_number) == float:
            seximal_numbers = []
            seximal_numbers = str(c_number).split(".")
            units = int(seximal_numbers[0])
            digits = len(str(seximal_numbers[1]))
            seximal_numbers[1] = self.conversor_to_decimal(seximal_numbers[1])
            decimals = round(seximal_numbers[1]/6**digits, 6)
                  #decimals = int(str(decimals).replace(".", "").rstrip("0"))
              
        else:
            units = c_number
        units = self.conversor_to_decimal(units)
        try:
            
            c_number = units + decimals
        except UnboundLocalError:
            c_number = units
        if neg:
            c_number *= -1
        return c_number

    def conversor_to_seximal(self, num): #:)
        temp_number = ""   
        while num >= self.base:
            temp_number = f"{num%self.base}{temp_number}"
            num = num//self.base
        else:            
            temp_number = int(f"{num}{temp_number}")
            num = temp_number
        return num

    def conversor_to_decimal(self, num): #:)
        listS = [int(a) for a in str(num)]
        listS.reverse()
        result = 0
        for i, number in enumerate(listS):
            result += number * (self.base**i)        
        return result

    def operator(self, num1, num2, sign): #:)
        if sign == self.operations[0]:
            result = num1 + num2
        elif sign == self.operations[1]:
            result = num1 - num2
        elif sign == self.operations[2]:
            result = round(num1 * num2, 4)
            result = self.is_int(result)
        elif sign == self.operations[3]:
            result = round(num1 / num2, 4)
            result = self.is_int(result)
        elif sign == self.operations[4]:
            result = round(num1 ** num2, 4)
            result = self.is_int(result)
        else:
            result = None
        return result
    
    def action(self, num1, num2, sign):
        self.number1 = num1
        self.number2 = num2
        self.sign = sign
        self.operations = ["+", "-", "*", "/", "^"]
        list1 = [int(a) for a in str(abs(self.number1)).replace(".","")]
        list2 = [int(a) for a in str(abs(self.number2)).replace(".","")]
        for lista in (list1, list2):
            for digit in lista:
                if digit >= 6:
                    return None
        # print("Numbers in seximal:",self.number1,self.sign, self.number2)
        num1_decimal = self.seximal_manager_to_decimal(self.number1)
        num2_decimal = self.seximal_manager_to_decimal(self.number2)
        # print("Numbers in decimal:", num1_decimal,self.sign, num2_decimal)
        try:
            result_decimal = self.operator(num1_decimal, num2_decimal, self.sign)
        except ZeroDivisionError:
            return None
        # print("Result decimal:", result_decimal)
        result_seximal = self.decimal_manager_to_seximal(result_decimal)
        return result_seximal
    
    def action_to_decimal(self, num1, num2, sign):
        self.number1 = num1
        self.number2 = num2
        self.sign = sign
        self.operations = ["+", "-", "*", "/", "^"]
        list1 = [int(a) for a in str(abs(self.number1)).replace(".","")]
        list2 = [int(a) for a in str(abs(self.number2)).replace(".","")]
        for lista in (list1, list2):
            for digit in lista:
                if digit >= 6:
                    return None
        num1_decimal = self.seximal_manager_to_decimal(self.number1)
        num2_decimal = self.seximal_manager_to_decimal(self.number2)
        try:
            result_decimal = self.operator(num1_decimal, num2_decimal, self.sign)
        except ZeroDivisionError:
            return None
        return result_decimal
    
    def is_int(self, num):
        try:
            if num.is_integer() or type(num) == int:
                return int(num)
            else: 
                return num
        except AttributeError:
            return num

"""

if __name__ == "__main__":
    number1 = 3# int(input("Number 1: "))
    number2 = 5# int(input("Number 2: "))
    operation = "/"# input("Operation (+, -, /, *): ")
    op = Operate()
    result = op.action(number1, number2, operation)
    if type(result) == int or type(result) == float:
        print("Result seximal:", result)
    else:
        print("Error number not in seximal or sign not detected\n")

"""
