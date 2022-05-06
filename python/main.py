from browser import document

def get_result(event):
    document["result"].value = "YES"
document["equal"].bind("click", get_result)

  
# number1 = 3# int(input("Number 1: "))
# number2 = 5# int(input("Number 2: "))
# operation = "/"# input("Operation (+, -, /, *): ")
# op = Operate()
# result = op.action(number1, number2, operation)