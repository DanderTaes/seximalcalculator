# import math
class Operate:
    def __init__(self): 
        self.base = 6
        self.max_decimals = 10

    def decimal_manager_to_seximal(self, num): # converts a decimal number to its equivalent in the "seximal" number system (base 6), handling both the integer and decimal parts.
        # Manage symbol
        if num < 0:
            num= abs(num)
            neg = True 
        else:
            neg = False
        
        # manage floating point numbers
        if type(num) == float:
            decimal_numbers = str(num).split(".") # split units and decimals
            units = int(decimal_numbers[0])
            units = self.conversor_to_seximal(units)

            processing_seximal = decimal_numbers[1]
            whole_decimals = ""
            while len(whole_decimals) < self.max_decimals: # maximum 10 decimal places to round later --> rounding in seximal was too hard... TODO
                processing_seximal = round(float(f".{processing_seximal}")*self.base, self.max_decimals) # multiply by the base and take the whole part, then take the decimals and repeat
                whole, processing_seximal = str(processing_seximal).split(".")
                whole_decimals = whole_decimals + str(whole)

                if processing_seximal == "0":
                    break

            seximals = whole_decimals
            
            result = float(f"{units}.{seximals}")

        else: # if there's no decimals
            result = self.conversor_to_seximal(num)
        if neg:
            result *= -1
        return result

    def seximal_manager_to_decimal(self, num): # converts a number in the "seximal" number system (base 6) to its decimal equivalent, handling both the integer and decimal parts.
        if num < 0: # manage symbol
            num= abs(num)
            neg = True 
        else:
            neg = False

        if type(num) == float:
            seximal_numbers = str(num).split(".")
            units = self.conversor_to_decimal(int(seximal_numbers[0]))
            decimals = self.conversor_to_decimal(seximal_numbers[1], True) # really important that our input num is a str, so it keeps the 0 to the left
            num = units + decimals
            num = round(num, self.max_decimals)
        else:
            num = self.conversor_to_decimal(num)

        if neg:
            num *= -1
        return num

    def conversor_to_seximal(self, num): # function to convert a whole number into seximal
        temp_number = ""   
        while num >= self.base: # we iterate dividing by 6 keeping the remainder as the converted values and pass the quotient to be iterated again
            temp_number = f"{num%self.base}{temp_number}"
            num = num//self.base
        else:            
            temp_number = int(f"{num}{temp_number}") # when the quotient is less than the base, we have the last digit in our number
            num = temp_number
        return num

    def conversor_to_decimal(self, num, decimals=False): # iterates differently depending if its whole number or decimals
        list_seximal = [int(a) for a in str(num)]
        result = 0
        if decimals:
            for i, number in enumerate(list_seximal): # really important that our input num is a str, so it keeps the 0 to the left
                result += number * (1/(self.base**(i+1)))     
        else:
            list_seximal.reverse()
            for i, number in enumerate(list_seximal):
                result += number * (self.base**i)

        return result
    

    # TODO: make calculator better lmao

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
    

    # TODO: figure out wtf is this
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
        num1_decimal = self.seximal_manager_to_decimal(self.number1)
        num2_decimal = self.seximal_manager_to_decimal(self.number2)
        try:
            result_decimal = self.operator(num1_decimal, num2_decimal, self.sign)
        except ZeroDivisionError:
            return None
        
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


        


if __name__ == "__main__":
    number1 = 13
    op = Operate()
    result = op.seximal_manager_to_decimal(number1)
    if type(result) == int or type(result) == float:
        print("Result decimal:", result)
    else:
        print("Error number not in seximal or sign not detected\n")



"""
Clarification on decimal changing of base

I was trying to multiplying the decimals by 6 to the power of n, n been the number of decimal places. Then I took the whole part of the result and transformed it to seximal using the conversor I used on whole numbers, and then I repeated the process with the next decimals. This completely worked, but when the numbers in seximal had to start by 0.0xx it failed to put the 0 in.
I finally found out that this would have worked if I used the "n" to check how many numbers there should be at the end, and if it was less i should've added 0 to the left.

This all worked, but there's an easier solution.
If I take a decimal value, like 0.25; and I multiply it by 6:
0.25 * 6 = 1.5
The whole part is the first digit of the "seximals", then I repeat this process with the decimals of the new number.

0.5 * 6 = 3.
So the seximal value is 0.13
base 6 (0.13) = base 10 (0.25)

this works with every base, I think xd


"""

