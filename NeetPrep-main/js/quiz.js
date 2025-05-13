let currentQuestion = 0;
let questions = [];

fetch('questions.json')
  .then(res => res.json())
  .then(data => {
    questions = data;
    showQuestion();
  });

function showQuestion() {
  const q = questions[currentQuestion];
  document.getElementById('question').innerText = q.question;

  const optionsDiv = document.getElementById('options');
  optionsDiv.innerHTML = "";

  q.options.forEach((opt, index) => {
    const btn = document.createElement('button');
    btn.innerText = opt;
    btn.className = 'btn';
    btn.onclick = () => checkAnswer(index);
    optionsDiv.appendChild(btn);
  });
}

function checkAnswer(selectedIndex) {
  const correctIndex = questions[currentQuestion].correctIndex;
  if (selectedIndex === correctIndex) {
    alert("Correct!");
  } else {
    alert("Wrong! Correct answer: " + questions[currentQuestion].options[correctIndex]);
  }
}

document.getElementById('nextBtn').onclick = () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    showQuestion();
  } else {
    alert("Quiz Finished!");
    location.href = "index.html";
  }
};
