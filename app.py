from flask import Flask, render_template, request, jsonify, session
import random
import math
import os
from datetime import datetime

app = Flask(__name__)
app.secret_key = os.urandom(24)

def generate_question(level):
    # Generate a math question based on difficulty level
    if level == 1:  # Easy
        num1 = random.randint(1, 10)
        num2 = random.randint(1, 10)
        operation = random.choice(['+', '-', '*'])
        if operation == '+':
            answer = num1 + num2
            question = f"{num1} + {num2}"
        elif operation == '-':
            # Ensure positive result
            if num1 < num2:
                num1, num2 = num2, num1
            answer = num1 - num2
            question = f"{num1} - {num2}"
        else:
            answer = num1 * num2
            question = f"{num1} × {num2}"
    
    elif level == 2:  # Medium
        num1 = random.randint(10, 50)
        num2 = random.randint(10, 50)
        operation = random.choice(['+', '-', '*', '/'])
        if operation == '+':
            answer = num1 + num2
            question = f"{num1} + {num2}"
        elif operation == '-':
            # Ensure positive result
            if num1 < num2:
                num1, num2 = num2, num1
            answer = num1 - num2
            question = f"{num1} - {num2}"
        elif operation == '*':
            num1 = random.randint(2, 12)
            num2 = random.randint(2, 12)
            answer = num1 * num2
            question = f"{num1} × {num2}"
        else:
            # Ensure division results in whole number
            num2 = random.randint(1, 10)
            num1 = num2 * random.randint(1, 10)
            answer = num1 // num2
            question = f"{num1} ÷ {num2}"
    
    elif level == 3:  # Hard
        operation = random.choice(['+', '-', '*', '/', 'sqrt', 'pow', 'quad'])
        if operation in ['+', '-']:
            num1 = random.randint(50, 200)
            num2 = random.randint(50, 200)
            if operation == '+':
                answer = num1 + num2
                question = f"{num1} + {num2}"
            else:
                if num1 < num2:
                    num1, num2 = num2, num1
                answer = num1 - num2
                question = f"{num1} - {num2}"
        elif operation == '*':
            num1 = random.randint(5, 20)
            num2 = random.randint(5, 20)
            answer = num1 * num2
            question = f"{num1} × {num2}"
        elif operation == '/':
            num2 = random.randint(2, 12)
            num1 = num2 * random.randint(1, 12)
            answer = num1 // num2
            question = f"{num1} ÷ {num2}"
        elif operation == 'sqrt':
            num = random.choice([4, 9, 16, 25, 36, 49, 64, 81, 100, 121, 144])
            answer = int(math.sqrt(num))
            question = f"√{num}"
        elif operation == 'pow':
            base = random.randint(2, 10)
            power = random.randint(2, 3)
            answer = base ** power
            question = f"{base}^{power}"
        else:  # quadratic
            a = 1
            b = random.randint(-5, 5)
            c = random.randint(-10, 10)
            # We'll ask for the value of x where ax^2 + bx + c = 0
            # Simplified version: x = (-b ± √(b^2 - 4ac)) / 2a
            # We'll make sure there's a nice integer solution
            root1 = random.randint(-5, 5)
            root2 = random.randint(-5, 5)
            a = 1
            b = -(root1 + root2)
            c = root1 * root2
            answer = root1
            question = f"Solve for x: x^2 + ({b})x + ({c}) = 0. Hint: One root is {root1}"
    
    return question, answer

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/game')
def game():
    # Initialize game state
    session['score'] = 0
    session['level'] = 1
    session['questions_asked'] = 0
    session['start_time'] = datetime.now().timestamp()
    return render_template('game.html')

@app.route('/get_question', methods=['POST'])
def get_question():
    level = int(request.form.get('level', 1))
    session['level'] = level
    question, answer = generate_question(level)
    
    # Store answer in session
    session['current_answer'] = answer
    
    return jsonify({
        'question': question,
        'level': level
    })

@app.route('/check_answer', methods=['POST'])
def check_answer():
    user_answer = request.form.get('answer', '')
    correct_answer = session.get('current_answer', None)
    
    try:
        user_answer = int(user_answer)
        is_correct = user_answer == correct_answer
    except ValueError:
        is_correct = False
    
    if is_correct:
        session['score'] = session.get('score', 0) + session.get('level', 1) * 10
    
    session['questions_asked'] = session.get('questions_asked', 0) + 1
    
    return jsonify({
        'is_correct': is_correct,
        'correct_answer': correct_answer,
        'score': session.get('score', 0),
        'questions_asked': session.get('questions_asked', 0)
    })

@app.route('/end_game', methods=['POST'])
def end_game():
    end_time = datetime.now().timestamp()
    start_time = session.get('start_time', end_time)
    time_taken = int(end_time - start_time)
    
    final_score = session.get('score', 0)
    questions_asked = session.get('questions_asked', 0)
    
    # Calculate accuracy
    if questions_asked > 0:
        accuracy = (final_score / (questions_asked * session.get('level', 1) * 10)) * 100
    else:
        accuracy = 0
    
    # Calculate time bonus
    time_bonus = max(0, 1000 - time_taken)
    
    final_score += time_bonus
    
    return jsonify({
        'final_score': final_score,
        'questions_asked': questions_asked,
        'accuracy': round(accuracy, 1),
        'time_taken': time_taken,
        'time_bonus': time_bonus
    })

if __name__ == '__main__':
    app.run(debug=True)
