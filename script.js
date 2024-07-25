document.getElementById('timer-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const startStopBtn = document.getElementById('start-stop-btn');
    if (startStopBtn.innerText === 'Start Timer') {
        startTimer();
    } else {
        stopTimer();
    }
});

let timerInterval;
let currentTask = '';
let remainingTime;
let isBreak = false;

function startTimer() {
    const workDuration = parseInt(document.getElementById('work-duration').value) * 60;
    const breakDuration = parseInt(document.getElementById('break-duration').value) * 60;
    const task = document.getElementById('task').value;

    if (!currentTask) {
        remainingTime = workDuration;
        currentTask = task;
        isBreak = false;
    }

    document.getElementById('current-task').innerText = `Task: ${currentTask}`;

    disableInputs(true);
    document.getElementById('start-stop-btn').innerText = 'Stop Timer';

    startTimerCountdown(remainingTime, breakDuration);
}

function stopTimer() {
    clearInterval(timerInterval);
    document.getElementById('start-stop-btn').innerText = 'Start Timer';
    disableInputs(false);
}

function startTimerCountdown(workDuration, breakDuration) {
    const timerDisplay = document.getElementById('time');

    timerInterval = setInterval(() => {
        const minutes = Math.floor(workDuration / 60);
        const seconds = workDuration % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        remainingTime = workDuration;

        if (workDuration <= 0) {
            clearInterval(timerInterval);
            playAlarm();
            setTimeout(() => startBreakCountdown(breakDuration), 5000);
        } else {
            workDuration--;
        }
    }, 1000);
}

function startBreakCountdown(breakDuration) {
    isBreak = true;
    const timerDisplay = document.getElementById('time');
    document.getElementById('current-task').innerText = `Break`;

    timerInterval = setInterval(() => {
        const minutes = Math.floor(breakDuration / 60);
        const seconds = breakDuration % 60;
        timerDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        remainingTime = breakDuration;

        if (breakDuration <= 0) {
            clearInterval(timerInterval);
            playAlarm();
            stopTimer();
        } else {
            breakDuration--;
        }
    }, 1000);
}

function disableInputs(disable) {
    document.getElementById('work-duration').disabled = disable;
    document.getElementById('task').disabled = disable;
    document.getElementById('break-duration').disabled = disable;
}

function playAlarm() {
    const alarm = document.getElementById('alarm-sound');
    alarm.play();
}

document.getElementById('add-task').addEventListener('click', function() {
    var taskText = document.getElementById('new-task').value;
    if (taskText === '') {
        alert('Please enter a task.');
        return;
    }

    var li = document.createElement('li');
    li.textContent = taskText;

    var button = document.createElement('button');
    button.textContent = 'Remove';
    button.onclick = function() {
        removeTask(this);
    };

    li.appendChild(button);
    document.getElementById('task-list').appendChild(li);

    document.getElementById('new-task').value = '';
    updateTaskStyles();
});

function removeTask(button) {
    var li = button.parentElement;
    li.remove();
    updateTaskStyles();
}

function updateTaskStyles() {
    var tasks = document.querySelectorAll('#task-list li');
    tasks.forEach(function(task, index) {
        task.style.backgroundColor = '';
        if (index === 0 || index === 2) {
            task.style.backgroundColor = '#e0f7fa';
        }
    });
}

updateTaskStyles();


const ctx = document.getElementById('stepsChart').getContext('2d');
const stepsChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        datasets: [{
            label: 'Steps Taken',
            data: [5000, 7000, 6500, 8000, 6000, 7500, 7200], // Sample data
            borderColor: '#007bff',
            backgroundColor: 'rgba(0, 123, 255, 0.2)',
            fill: true,
            tension: 0.1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: true
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return 'Steps: ' + tooltipItem.raw;
                    }
                }
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
});


const quotesContainer = document.getElementById('quotesContainer');

async function fetchQuotes() {
    const response = await fetch('https://type.fit/api/quotes');
    const quotes = await response.json();
    displayQuotes(quotes);
}

function displayQuotes(quotes) {
    quotesContainer.innerHTML = '';
    
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const quote = quotes[randomIndex];
        const quoteCard = createQuoteCard(quote);
        quotesContainer.appendChild(quoteCard);
    }
}

function createQuoteCard(quote) {
    const quoteCard = document.createElement('div');
    quoteCard.classList.add('quote-card');
    
    const quoteText = document.createElement('div');
    quoteText.classList.add('quote-text');
    quoteText.textContent = quote.text;
    
    const quoteAuthor = document.createElement('div');
    quoteAuthor.classList.add('quote-author');
    quoteAuthor.textContent = quote.author ? `- ${quote.author}` : '- Unknown';
    
    quoteCard.appendChild(quoteText);
    quoteCard.appendChild(quoteAuthor);
    
    return quoteCard;
}

function autoFetchQuotes() {
    fetchQuotes();
    setInterval(fetchQuotes, 30000); 
}

document.addEventListener('DOMContentLoaded', autoFetchQuotes);

