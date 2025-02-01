const express = require("express");
const cors = require("cors");
const {ChatGroq} = require("@langchain/groq");
const dotenv = require("dotenv");
const fs = require("fs");
const path = require("path");
dotenv.config();


const app = express();
app.use(cors());
app.use(express.json());

const llm = new ChatGroq({
  model: "mixtral-8x7b-32768",
  temperature: 0.7,
  maxTokens: 100,
  maxRetries: 2,
  apiKey: process.env.GROQ_API_KEY  // Ensure you set this in .env file
});

const topics = {
    beginner: {
      "Introduction to Python": "Python is a high-level, interpreted programming language known for its readability and simplicity.",
      "Variables & Data Types": "Variables store values, and data types include int, float, string, list, tuple, and dictionary.",
      "Loops & Control Flow": "Loops like for and while help repeat tasks, and if-else statements control logic in Python.",
      "Functions": "Functions are reusable blocks of code that perform specific tasks, defined using the def keyword.",
    },
    medium: {
      "Object-Oriented Programming": "OOP is a programming paradigm based on the concept of objects, which contain data and methods.",
      "File Handling": "File handling allows reading from and writing to files in Python using functions like open(), read(), and write().",
      "Exception Handling": "Exception handling involves managing errors with try, except, and finally blocks.",
      "Libraries & Modules": "Libraries and modules help extend Python's functionality, allowing access to pre-written code for specific tasks.",
    },
    advanced: {
      "Decorators": "Decorators are a way to modify the behavior of functions or methods without changing their source code.",
      "Generators": "Generators are functions that return an iterable set of items, one at a time, using the yield keyword.",
      "Concurrency": "Concurrency involves managing multiple tasks at the same time using threads or asyncio.",
      "Metaprogramming": "Metaprogramming is the ability of a program to treat other programs as data and modify its behavior at runtime.",
    },
  }
  

const questions = {
  "Introduction to Python": [
    { question: "What is Python?", answer: "Python is a high-level, interpreted programming language used for general-purpose programming." },
    { question: "Why is Python popular?", answer: "Python is popular because of its simplicity, readability, and large community support." },
    { question: "Is Python compiled or interpreted?", answer: "Python is an interpreted language, meaning it is executed line-by-line by an interpreter." }
  ],
  "Variables & Data Types": [
    { question: "What are the different data types in Python?", answer: "Python includes several built-in data types like int, float, string, list, tuple, and dictionary." },
    { question: "How do you declare a variable in Python?", answer: "In Python, variables are declared by simply assigning a value, for example: x = 10." },
    { question: "What is the difference between list and tuple?", answer: "A list is mutable (can be changed), while a tuple is immutable (cannot be changed once created)." }
  ],
  "Loops & Control Flow": [
    { question: "What is a loop in Python?", answer: "A loop is used to execute a block of code repeatedly, either a fixed number of times (for loop) or until a condition is met (while loop)." },
    { question: "What is the difference between for and while loop?", answer: "A for loop is used when the number of iterations is known, while a while loop runs until a specified condition becomes false." },
    { question: "What are if-else statements used for?", answer: "If-else statements control the flow of execution by checking conditions and executing code accordingly." }
  ],
  "Functions": [
    { question: "What is a function in Python?", answer: "A function is a reusable block of code that performs a specific task, defined using the def keyword." },
    { question: "How do you define a function in Python?", answer: "A function is defined using the def keyword followed by the function name and parentheses, e.g., def my_function():." },
    { question: "What is the difference between a built-in function and a user-defined function?", answer: "Built-in functions are provided by Python (e.g., print(), len()), whereas user-defined functions are created by programmers." }
  ],
  "Object-Oriented Programming": [
    { question: "What is Object-Oriented Programming (OOP)?", answer: "OOP is a programming paradigm based on the concept of objects, which contain data and methods." },
    { question: "What are the main principles of OOP?", answer: "The main principles of OOP are Encapsulation, Abstraction, Inheritance, and Polymorphism." },
    { question: "What is inheritance in OOP?", answer: "Inheritance allows a class to inherit properties and behaviors from another class." }
  ],
  "File Handling": [
    { question: "What is file handling in Python?", answer: "File handling allows reading from and writing to files in Python using functions like open(), read(), and write()." },
    { question: "How do you open a file in Python?", answer: "You can open a file using the open() function, e.g., open('filename.txt', 'r')." },
    { question: "What is the difference between 'r' and 'w' modes in file handling?", answer: "'r' mode is for reading a file, while 'w' mode is for writing to a file, creating the file if it doesn't exist." }
  ],
  "Exception Handling": [
    { question: "What is exception handling?", answer: "Exception handling involves managing errors with try, except, and finally blocks." },
    { question: "What does the 'finally' block do?", answer: "The 'finally' block is always executed, regardless of whether an exception occurred or not." },
    { question: "What is the purpose of the 'except' block?", answer: "The 'except' block is used to catch and handle exceptions that occur during the execution of a program." }
  ],
  "Libraries & Modules": [
    { question: "What is the difference between a library and a module in Python?", answer: "A module is a file containing Python code, while a library is a collection of modules." },
    { question: "How do you import a module in Python?", answer: "You can import a module using the 'import' keyword, e.g., import math." },
    { question: "What is the purpose of the 'os' module?", answer: "The 'os' module provides functions to interact with the operating system, such as file manipulation and directory traversal." }
  ],
  "Decorators": [
    { question: "What is a decorator in Python?", answer: "A decorator is a function that modifies the behavior of another function or method without changing its source code." },
    { question: "How do you create a decorator in Python?", answer: "A decorator is created by defining a function that returns a wrapper function, which modifies the behavior of the original function." },
    { question: "Can you pass arguments to a decorator?", answer: "Yes, you can pass arguments to a decorator by defining the decorator function to accept arguments and using those in the wrapper function." }
  ],
  "Generators": [
    { question: "What is a generator in Python?", answer: "A generator is a function that returns an iterable set of items, one at a time, using the 'yield' keyword." },
    { question: "How is a generator different from a normal function?", answer: "A generator uses 'yield' to return values, and it remembers the state of execution, resuming from where it left off when next() is called." },
    { question: "What is the advantage of using generators in Python?", answer: "Generators are memory efficient because they yield one value at a time and do not store the entire sequence in memory." }
  ],
  "Concurrency": [
    { question: "What is concurrency in Python?", answer: "Concurrency is the ability to manage multiple tasks simultaneously, often using threads or asyncio for asynchronous programming." },
    { question: "What is the difference between threading and multiprocessing?", answer: "Threading uses multiple threads in the same process to run tasks concurrently, while multiprocessing uses multiple processes to execute tasks in parallel." },
    { question: "How do you manage concurrency in Python?", answer: "Concurrency in Python can be managed using the threading module or asyncio for asynchronous programming." }
  ],
  "Metaprogramming": [
    { question: "What is metaprogramming in Python?", answer: "Metaprogramming is the ability to write programs that manipulate other programs, such as modifying classes or methods dynamically at runtime." },
    { question: "What is a metaclass in Python?", answer: "A metaclass is a class that defines the behavior of other classes, enabling customization of class creation and modification." },
    { question: "How can you dynamically add methods to a class in Python?", answer: "Methods can be dynamically added to a class using the 'setattr' function to assign a method to a class at runtime." }
  ]
  
};


const codingQuestions = {
  "Introduction to Python": [
    { question: "Write a Python program to print 'Hello, World!'.", answer: `print("Hello, World!")` },
    { question: "Write a Python program to find the sum of two numbers.", answer: `a = 10\nb = 20\nprint(a + b)` }
  ],
  "Variables & Data Types": [
    { question: "Write a Python program to check if a number is even or odd.", answer: `number = 5\nif number % 2 == 0:\n  print("Even")\nelse:\n  print("Odd")` },
    { question: "Write a Python program to swap two variables.", answer: `a = 5\nb = 10\na, b = b, a\nprint(a, b)` }
  ],
  "Loops & Control Flow": [
    { question: "Write a Python program to print numbers from 1 to 10 using a for loop.", answer: `for i in range(1, 11):\n  print(i)` },
    { question: "Write a Python program to print the factorial of a number using a while loop.", answer: `number = 5\nfactorial = 1\nwhile number > 0:\n  factorial *= number\n  number -= 1\nprint(factorial)` },
    { question: "Write a Python program to check if a number is prime.", answer: `num = 7\nis_prime = True\nfor i in range(2, num):\n  if num % i == 0:\n    is_prime = False\n    break\nprint("Prime" if is_prime else "Not Prime")` }
  ],
  "Functions": [
    { question: "Write a Python function to add two numbers.", answer: `def add(a, b):\n  return a + b\nprint(add(5, 10))` },
    { question: "Write a Python function to calculate the factorial of a number.", answer: `def factorial(n):\n  if n == 0:\n    return 1\n  return n * factorial(n - 1)\nprint(factorial(5))` },
    { question: "Write a Python function to check if a number is even or odd.", answer: `def check_even_odd(number):\n  return "Even" if number % 2 == 0 else "Odd"\nprint(check_even_odd(10))` }
  ],
  "Object-Oriented Programming": [
    { question: "Write a Python program to create a class named 'Car' with attributes 'brand' and 'model'.", answer: `class Car:\n  def __init__(self, brand, model):\n    self.brand = brand\n    self.model = model\ncar = Car("Toyota", "Corolla")\nprint(car.brand, car.model)` },
    { question: "Write a Python program to create a class 'Student' with methods to set and get the name and age.", answer: `class Student:\n  def __init__(self, name, age):\n    self.name = name\n    self.age = age\n  def get_name(self):\n    return self.name\n  def get_age(self):\n    return self.age\nstudent = Student("Alice", 21)\nprint(student.get_name(), student.get_age())` },
    { question: "Write a Python program to implement inheritance where 'Dog' class inherits from 'Animal' class.", answer: `class Animal:\n  def speak(self):\n    print("Animal speaks")\nclass Dog(Animal):\n  def speak(self):\n    print("Dog barks")\ndog = Dog()\ndog.speak()` }
  ],
  "File Handling": [
    { question: "Write a Python program to read a file and print its contents.", answer: `with open('file.txt', 'r') as file:\n  print(file.read())` },
    { question: "Write a Python program to write data to a file.", answer: `with open('file.txt', 'w') as file:\n  file.write("Hello, World!")` },
    { question: "Write a Python program to append data to an existing file.", answer: `with open('file.txt', 'a') as file:\n  file.write("New data")` }
  ],
  "Exception Handling": [
    { question: "Write a Python program that catches a division by zero exception.", answer: `try:\n  result = 10 / 0\nexcept ZeroDivisionError:\n  print("Cannot divide by zero")` },
    { question: "Write a Python program to catch multiple exceptions.", answer: `try:\n  result = 10 / 0\nexcept ZeroDivisionError:\n  print("Cannot divide by zero")\nexcept Exception as e:\n  print(f"An error occurred: {e}")` },
    { question: "Write a Python program that always executes a cleanup action after an exception.", answer: `try:\n  result = 10 / 0\nexcept ZeroDivisionError:\n  print("Cannot divide by zero")\nfinally:\n  print("Cleanup actions executed")` }
  ],
  "Libraries & Modules": [
    { question: "Write a Python program to import the 'math' module and find the square root of a number.", answer: `import math\nprint(math.sqrt(16))` },
    { question: "Write a Python program to import a custom module and use a function from it.", answer: `# In math_operations.py\n\ndef add(a, b):\n  return a + b\n\n# In main script\nfrom math_operations import add\nprint(add(5, 10))` },
    { question: "Write a Python program to use the 'os' module to get the current working directory.", answer: `import os\nprint(os.getcwd())` }
  ],
  "Decorators": [
    { question: "Write a Python decorator to measure the execution time of a function.", answer: `import time\n\ndef timing_decorator(func):\n    def wrapper():\n        start_time = time.time()\n        func()\n        end_time = time.time()\n        print(f'Execution time: {end_time - start_time} seconds')\n    return wrapper\n\n@timing_decorator\ndef my_function():\n    time.sleep(2)\n    print("Function executed")\n\nmy_function()` },
    { question: "Write a Python decorator to log function arguments and return value.", answer: `def log_decorator(func):\n    def wrapper(*args, **kwargs):\n        print(f'Arguments: {args}, {kwargs}')\n        result = func(*args, **kwargs)\n        print(f'Result: {result}')\n        return result\n    return wrapper\n\n@log_decorator\ndef add(a, b):\n    return a + b\n\nadd(5, 10)` }
  ],
  "Generators": [
    { question: "Write a Python generator to yield even numbers from 1 to 10.", answer: `def even_numbers():\n    for i in range(2, 11, 2):\n        yield i\n\nfor num in even_numbers():\n    print(num)` },
    { question: "Write a Python generator to create an infinite sequence of Fibonacci numbers.", answer: `def fibonacci():\n    a, b = 0, 1\n    while True:\n        yield a\n        a, b = b, a + b\n\nfib = fibonacci()\nfor _ in range(10):\n    print(next(fib))` }
  ],
  "Concurrency": [
    { question: "Write a Python program using threading to print numbers from 1 to 5 in parallel.", answer: `import threading\n\ndef print_number(number):\n    print(number)\n\nthreads = []\nfor i in range(1, 6):\n    t = threading.Thread(target=print_number, args=(i,))\n    threads.append(t)\n    t.start()\n\nfor t in threads:\n    t.join()` },
    { question: "Write a Python program using asyncio to run two coroutines concurrently.", answer: `import asyncio\n\nasync def greet(name):\n    await asyncio.sleep(1)\n    print(f'Hello {name}')\n\nasync def main():\n    await asyncio.gather(greet('Alice'), greet('Bob'))\n\nasyncio.run(main())` }
  ],
  "Metaprogramming": [
    { question: "Write a Python program to dynamically add a method to a class.", answer: `class MyClass:\n    pass\n\ndef dynamic_method(self):\n    print("Dynamically added method")\n\nMyClass.dynamic_method = dynamic_method\nobj = MyClass()\nobj.dynamic_method()` },
    { question: "Write a Python program to modify the class definition at runtime using a metaclass.", answer: `class MyMeta(type):\n    def __new__(cls, name, bases, dct):\n        dct['greet'] = lambda self: print(f'Hello, {self.name}')\n        return super().__new__(cls, name, bases, dct)\n\nclass MyClass(metaclass=MyMeta):\n    def __init__(self, name):\n        self.name = name\n\nobj = MyClass('Alice')\nobj.greet()` }
  ]
};


app.get("/api/topics", (req, res) => {
  res.json(topics);
});

app.get("/api/questions", (req, res) => {
  const topic = req.query.topic;
  const topicQuestions = questions[topic] || [];
  res.json(topicQuestions);
});

app.post("/chat", async (req, res) => {
  const { message } = req.body;

  try {
    const response = await llm.invoke([
      { role: "system", content: "You are a helpful Python tutor." },
      { role: "user", content: message }
    ]);
    
    res.json({ response: response.content });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Failed to fetch response" });
  }
});

dotenv.config();

app.post("/update-config", (req, res) => {
  const { apiKey } = req.body;

  // Path to the .env file
  const envFilePath = path.resolve(__dirname, ".env");

  // Read the current .env file
  fs.readFile(envFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading .env file:", err);
      return res.status(500).send("Error updating configuration.");
    }

    // Modify the .env file content
    let newEnvContent = data;
    newEnvContent = newEnvContent.replace(
      /^GROQ_API_KEY=.*$/m,
      `GROQ_API_KEY=${apiKey}`
    );

    // Write the updated content back to the .env file
    fs.writeFile(envFilePath, newEnvContent, "utf8", (writeErr) => {
      if (writeErr) {
        console.error("Error writing to .env file:", writeErr);
        return res.status(500).send("Error saving configuration.");
      }

      // Reload .env to reflect changes
      dotenv.config();

      // Return the updated GROQ_API_KEY as part of the response body
      res.status(200).send({
        message: "Configuration updated successfully.",
        apiKey: process.env.GROQ_API_KEY, // Send the updated API key back in the response
      });
    });
  });
});


app.get("/api/coding-questions", (req, res) => {
  const topic = req.query.topic;
  const topicCodingQuestions = codingQuestions[topic] || [];
  res.json(topicCodingQuestions);
});

const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
