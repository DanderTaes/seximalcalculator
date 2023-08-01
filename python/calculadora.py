# import math
class Operate:
    def __init__(self): 
        self.base = 6

    def decimal_manager_to_seximal(self, num): # converts a decimal number to its equivalent in the "seximal" number system (base 6), handling both the integer and decimal parts.
        # Manage symbol
        if num < 0:
            num= abs(num)
            neg = True 
        else:
            neg = False
        
        # manage floating point numbers
        if type(num) == float:
            decimal_numbers = []
            decimal_numbers = str(num).split(".") # split units and decimals
            units = int(decimal_numbers[0])

            # to convert decimals we multiply them by 6^n n been the number of decimals to convert it to a "int" seximal value in base 10, we convert the whole part into seximal and for the decimals we repeat the proceess
            processing_seximal = round(float(f".{decimal_numbers[1]}")*self.base**len(str(decimal_numbers[1])), 4)
            # we do a first iteration and if it's not a whole number we loop 
            if float(processing_seximal).is_integer():
                whole_decimals = str(self.conversor_to_seximal(int(processing_seximal)))
            else:
                whole_decimals = ""

            while not float(processing_seximal).is_integer(): # maximum 8 decimal places to round later --> rounding in seximal was too hard... TODO
                whole, part = str(processing_seximal).split(".")

                if int(whole) < self.base:   # if in seximal the number is one digit long we add a 0
                    whole_decimals = whole_decimals + "0"
                whole_decimals = whole_decimals + str(self.conversor_to_seximal(int(whole)))
                processing_seximal = round(float(f".{part}")*self.base**len(str(part)), 4) # the whole part will be converted to seximal and the other will be passed again
                # print(whole_decimals, whole, part)
                if len(whole_decimals) >= 8:
                    break

            seximals = whole_decimals
            units = self.conversor_to_seximal(units)
            num = float(f"{units}.{seximals}")

        else: # if there's no decimals
            num = self.conversor_to_seximal(num)
        if neg:
            num *= -1
        return num

    def seximal_manager_to_decimal(self, num): # converts a number in the "seximal" number system (base 6) to its decimal equivalent, handling both the integer and decimal parts.
        if num < 0: # manage symbol
            num= abs(num)
            neg = True 
        else:
            neg = False

        if type(num) == float:
            seximal_numbers = str(num).split(".")
            units = int(seximal_numbers[0])
            digits = len(str(seximal_numbers[1]))
            seximal_numbers[1] = self.conversor_to_decimal(seximal_numbers[1])
            decimals = round(seximal_numbers[1]/6**digits, 8) # ROUNDS TO 8 DECIMAL PLACES 
            # TODO: LOOP --> Update: without the loop it seems to work really well
            units = self.conversor_to_decimal(units)
            num = units + decimals
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

    def conversor_to_decimal(self, num): #:)
        list_seximal = [int(a) for a in str(num)]
        list_seximal.reverse()
        result = 0
        for i, number in enumerate(list_seximal):
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
    number1 = 13.13205432
    op = Operate()
    result = op.seximal_manager_to_decimal(number1)
    if type(result) == int or type(result) == float:
        print("Result seximal:", result)
    else:
        print("Error number not in seximal or sign not detected\n")


