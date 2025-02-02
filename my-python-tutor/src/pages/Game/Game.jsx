import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {images} from '../../assets/assets';
import './Game.css';
const storySteps = [
  {
    image: images.Id_1,
    description: "You set off on your journey into the unknown lands, where a mysterious figure blocks the path. It offers you a riddle—solve it, and the way ahead will be clear.",
    question: "What will the following Python code output?",
    code: "print('Hello, World!')",
    options: ["Hello World", "Hello, World!", "print(Hello, World!)", "Error"],
    correct: "Hello, World!",
  },
  {
    image: images.Id_2,
    description: "The figure steps aside, revealing a dense forest stretching out before you. Strange creatures flicker in the shadows. A new challenge stands before you: identify the truth hidden in the depths of this enchanted forest to unlock your way.",
    question: "What is the output of the following Python code?",
    code: "x = 10.5\nprint(type(x))",
    options: ["<class 'int'>", "<class 'float'>", "<class 'str'>", "<class 'list'>"],
    correct: "<class 'float'>",
  },
  {
    image: images.Id_3,
    description: "A twisting path full of traps and illusions lies ahead. To proceed, you must decipher the codes hidden within the very fabric of this realm, testing your ability to discern the truth from trickery.",
    question: "What will the following Python code print?",
    code: "for i in range(5):\n    print(i)",
    options: ["0 1 2 3 4", "1 2 3 4 5", "0 1 2 3 4 5", "5 4 3 2 1"],
    correct: "0 1 2 3 4",
  },
  {
    image: images.Id_4,
    description: "You come across an ancient temple. Inside, the artifact of great knowledge lies, but only those who can solve the riddle guarding it may claim its power. Solve the puzzle to gain its strength.",
    question: "What will the function greet() print when called with 'Alice'?",
    code: "def greet(name):\n    return 'Hello, ' + name\nprint(greet('Alice'))",
    options: ["Hello, Alice", "greet Alice", "Hello", "Error"],
    correct: "Hello, Alice",
  },
  {
    image: images.Id_5,
    description: "A vast, daunting realm of mysterious forces opens before me. Legends say that only those with a true understanding of these forces can navigate the realm and find the way to the next stage of the journey. Solve the puzzle to gain the power to continue.",
    question: "What will the output of the following Python code be?",
    code: "class Car:\n    def __init__(self, make, model):\n        self.make = make\n        self.model = model\n    def info(self):\n        return self.make + ' ' + self.model\ncar = Car('Toyota', 'Corolla')\nprint(car.info())",
    options: ["Toyota Corolla", "Toyota", "Corolla", "Error"],
    correct: "Toyota Corolla",
  },
  {
    image: images.Id_6,
    description: "A dark cave stands before you. Ancient whispers tell of a hidden key that opens the gates, but only those who can wield the key or some hidden power will be allowed passage. Can you solve the question to move forward on your journey?",
    question: "What does the following Python code do?",
    code: "with open('test.txt', 'w') as file:\n    file.write('Hello, File!')",
    options: ["Writes 'Hello, File!' to a file", "Reads 'Hello, File!' from a file", "Opens a file in read mode", "Creates a file without content"],
    correct: "Writes 'Hello, File!' to a file",
  },
  {
    image: images.Id_7,
    description: "As I stand before the gate, a mysterious energy flows from me — a gift from the hidden forces of the temple. The gate trembles and slowly opens. I stepped inside the cave, where the air feels heavy with age and secrets. To move further in the journey kick out the puzzle!!",
    question: "What will the following Python code print?",
    code: "try:\n    x = 1 / 0\nexcept ZeroDivisionError:\n    print('Cannot divide by zero!')",
    options: ["Cannot divide by zero!", "Error", "ZeroDivisionError", "None"],
    correct: "Cannot divide by zero!",
  },
  {
    image: images.Id_8,
    description: "As I am moving forward in the cave, a hidden key is found on the path. To claim it, you must first prove your wit by solving the puzzle that stands in your way.",
    question: "What will the output of the following Python code be?",
    code: "import math\nprint(math.sqrt(16))",
    options: ["4", "16", "sqrt(16)", "Error"],
    correct: "4",
  },
    {
      "image": images.Id_9,
      "description": "A treasure chest filled with mysterious and powerful tools lies before me. To unlock its potential to open with that key, you must prove your worth by solving the riddle that guards it.",
      "question": "What will the output of the following Python code be?",
      "code": "import math\nprint(math.sqrt(16))",
      "options": ["4", "16", "sqrt(16)", "Error"],
      "correct": "4"
    },
    {
      "image": images.Id_10,
      "description": "The path diverges into unknown lands. Those who understand the hidden powers of this realm may continue their journey. Solve this puzzle to harness the hidden forces of nature.",
      "question": "What will the output be when calling `greet()`?",
      "code": "def decorator(func):\n    def wrapper():\n        print('Before function call')\n        func()\n        print('After function call')\n    return wrapper\n\n@decorator\ndef greet():\n    print('Hello!')\ngreet()",
      "options": ["Before function call\nHello!\nAfter function call", "Hello!\nBefore function call\nAfter function call", "Before function call\nAfter function call", "Error"],
      "correct": "Before function call\nHello!\nAfter function call"
    },
    {
      "image": images.Id_11,
      "description": "A glowing portal stands ahead, but only those who understand the ancient art of passage can traverse through it. Solve the challenge to step into the next world.",
      "question": "What will the code print?",
      "code": "def countdown(n):\n    while n > 0:\n        yield n\n        n -= 1\nfor i in countdown(5):\n    print(i)",
      "options": ["5 4 3 2 1", "1 2 3 4 5", "Countdown complete", "Error"],
      "correct": "5 4 3 2 1"
    },  
    {
      image: images.Id_12,
      description: "The final chamber of your journey comes to an end. To unlock the journey in the new world with an exciting adventure in Toyland, you must solve the final puzzle. Stay tuned with us!!",
      question: "What will the code output?",
      code: "class MyClass:\n    def __init__(self, name):\n        self.name = name\nobj = MyClass('John')\nprint(getattr(obj, 'name'))",
      options: ["John", "name", "MyClass", "Error"],
      correct: "John",
    }
];


export default function StoryLearning() {
  const [step, setStep] = useState(0);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();

  const handleAnswer = (option) => {
    if (option === storySteps[step].correct) {
      setFeedback("Correct! Moving to the next stage...");
      setTimeout(() => {
        if (step + 1 < storySteps.length) {
          setStep(step + 1);
          setFeedback("");
        } else {
          setFeedback("Congratulations! You completed the journey.");
        }
      }, 1500);
    } else {
      setFeedback("Oops! Try again or review the concept.");
    }
  };

  return (
    <div className="story-container">
      <h1 className="story-title">The Python Mage's Quest</h1>
      <div className="story-image-container">
        <img
          src={storySteps[step].image}
          alt="Story Scene"
          className="story-image"
        />
      </div>
      <p className="story-description">{storySteps[step].description}</p>

      {storySteps[step].code && (
        <div className="code-container">
          <pre className="code-block">
            <code>{storySteps[step].code}</code>
          </pre>
        </div>
      )}

      <div className="question-container">
        <h2 className="question-text">{storySteps[step].question}</h2>
        <div className="options-container">
          {storySteps[step].options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="option-button">
              {option}
            </button>
          ))}
        </div>
        {feedback && <p className="feedback-text">{feedback}</p>}
      </div>

      <div className="continue-container">
        <button onClick={() => navigate("/tutorials")} className="continue-button">
          Keep Learning
        </button>
      </div>
    </div>
  );
}