// Setting an array "questions" with question, choices (answers to those questions), and the correct answer to the question, using mockup questions for inspiration.
var questions = [
    {
        question: "Commonly used data types do NOT include:",
        choices: ["strings", "booleans", "alerts", "numbers"],
        correctAnswer: "alerts"
    },
    {
        question: "The condition in an if/else statement is enclosed within _____",
        choices: ["quotes", "curly brackets", "parentheses", "square brackets"],
        correctAnswer: "parentheses"
    },
    {
        question: "Arrays in JavaScript can be used to store _____",
        choices: ["numbers and strings", "other arrays", "booleans", "all of the above"],
        correctAnswer: "all of the above"
    },
    {
        question: "String values must be enclosed within _____ when being assigned to variables:",
        choices: ["commas", "curly brackets", "quotes", "parenthesis"],
        correctAnswer: "quotes"
    },
    {
        question: "A very useful tool used during development and debugging for printing content to the debugger is:",
        choices: ["JavaScript", "terminal/bash", "for loops", "console.log"],
        correctAnswer: "console.log"
    },
];

// Global definitions for variables regarding initial timer (in seconds), current time, and the timer's interval by which it increments.
var initialTimer = 75;
var currentTime = initialTimer;
var timerInterval;

// Define contentDiv globally (this will serve as the base for questions as well as additional content)  
var contentDiv; 
// Initializing a "userAnswers" array to store the user's answer selections. 
var userAnswers = [];

// Define a function that updates the timer's text content incrementally as the quiz progresses, linking it to the countdown span in the HTML document.
function updateTimerDisplay() {
    var countdownElement = document.getElementById("countdown");
    countdownElement.textContent = currentTime;
    // Ensuring the timer never drops below 0 seconds.
    countdownElement.textContent = Math.max(currentTime, 0);
    }

function runTimer() {
    // Set the time interval and what you want currentTime to do when you run this runTimer function. 
    timerInterval = setInterval(function () {
        // Decrease the current time
        currentTime--;

        // Update the timer display each time the currentTime decrements by 1.
        updateTimerDisplay();

        // Check if the timer has run all the way to 0.
        if (currentTime <= 0) {
            clearInterval(timerInterval);   // Clears the timer interval so that it doesn't keep running after 0.
            showCompletionScreen();     // Show the end-screen when the timer is at 0.
        }
    }, 1000); // Decrements the timer once every 1000 milliseconds (1 second)
}

// Function to handle the start quiz action
function startQuiz() {
    contentDiv = document.getElementById("quizContent");

     // Check to see if the quiz has already started, if not, start the timer and initialize the question index at 0, skip this step if the question has started.
     if (!contentDiv.hasAttribute("question-index")) {
        runTimer();
        
        contentDiv.setAttribute("question-index", 0);
    }
    // Clear div content by setting an empty string.
    contentDiv.textContent = "";

    // Retrieve the current question index, parsing it as an int so it retrieves a number.
    var currentQuestionIndex = parseInt(contentDiv.getAttribute("question-index"));

    // Define the current question the quiz is on, using questions[currentQuestionIndex] to reference the questions array index 
    var currentQuestion = questions[currentQuestionIndex];

    // Create a new paragraph to display the question for the question we're currently on, append that paragraph's text content assuming now that currentQuestion is an object
    var newParagraph = document.createElement("p");
    newParagraph.textContent = currentQuestion.question;
    contentDiv.appendChild(newParagraph);

    // Use a loop to create and append answer buttons for each question, so 4 buttons each question given that currentQuestion.choices.length is 4.
    for (let i = 0; i < currentQuestion.choices.length; i++) {
        var answerButton = document.createElement("button");
        answerButton.textContent = currentQuestion.choices[i];
        answerButton.style.marginTop = "20px";
        contentDiv.appendChild(answerButton);

        // Adding event listeners to each of the newly created button
        answerButton.addEventListener("click", function (event) {
            // Retrieve text content of user's clicked button
            var selectedAnswer = event.target.textContent;

            if (selectedAnswer === currentQuestion.correctAnswer) {
                // If the user's answer is correct then store the user's answer in the userAnswers array (defined globally).
                userAnswers[currentQuestionIndex] = selectedAnswer;
            } else {
                wrongAnswer();
            }
            // Afterwards, progress to the next question by incrementing currentQuestionIndex
            currentQuestionIndex++;
            contentDiv.setAttribute("question-index", currentQuestionIndex);

            // At the same time, see if there are any remaining questions
            if (currentQuestionIndex < questions.length) {
                startQuiz(); // Recursive calling of the function for next question up until question 4, if currentQuestionIndex isn't 1-4, move on to the else block
            } else {
                showCompletionScreen();     // Definition of function below
            }
        });
    }
}

// Function for score calculation
function calculateScore() {
    var score = 0; // Initalize score at 0.

    for (var i = 0; i < questions.length; i++) {
        var isCorrect = userAnswers[i] === questions[i].correctAnswer;  // The selected answer of the user stored in the userAnswers array is strictly equal to correctAnswer
        // If yes, increment score by 1.
        if (isCorrect) {
            score++; 
        }
    }
    // Return the total score 
    return score;
}

// Function for when wrong answers are selected.
function wrongAnswer() {
    // Reduce time remaining by 10 seconds.
    currentTime -= 10;
    // Display the updated time accordingly.
    updateTimerDisplay();
}

function showCompletionScreen() {
    // Clear the elapsing timer immediately when the completion screen displays.
    clearInterval(timerInterval);
    // Clear everything first.
    var contentDiv = document.getElementById("quizContent");
    contentDiv.textContent = "";
    // Create a div with the textContent of that div displaying a message including user's quiz score
    var completionMessageDiv = document.createElement("div");
    completionMessageDiv.textContent = "All done! Your score is: " + calculateScore() + " out of 5";
    contentDiv.appendChild(completionMessageDiv); 

    // Get input for user's name and and have them submit their score, including a "Enter your name" placeholder to kickstart the user.
    var inputField = document.createElement("input");
    inputField.type = "text";
    inputField.placeholder = "Enter your name";
    inputField.style.marginTop = "20px"; // Adding margin
    contentDiv.appendChild(inputField);
    
    // Creating a submit button below the input field with a marginTop of 20px so there's space between the input field and the submit button.
    var submitButton = document.createElement("button");
    submitButton.textContent = "Submit";
    submitButton.style.marginTop = "20px";
    contentDiv.appendChild(submitButton);
    
    // Attach an EventListener to submit button
    submitButton.addEventListener("click", function (event) {
        // Defining user input variable and setting it as the inputField value that the user entered
        var userInput = inputField.value;
        // Setting an error message below the submit button should the user not enter anything in the input field.
        var errorMessageDiv = document.getElementById("errorMessage");
        // Check if userInput is empty
        if (userInput === "") {
            // AND if there is no error message to begin with:
            if (!errorMessageDiv) {
                errorMessageDiv = document.createElement("div");
                errorMessageDiv.id = "errorMessage";    // Set an ID on the errorMessageDiv so it can be accessed using the errorMessageDiv variable in line 173
                errorMessageDiv.style.color = "red"; // Setting the error message to red for visibility.
                contentDiv.appendChild(errorMessageDiv);
            }
            // Set the error message to be:
            errorMessageDiv.textContent = "Please enter your name.";
            return; // Prevent user from proceeding as long as userInput remains empty.
}       
        // Then, submit the userInput and their calculated score
        submitHighscore(userInput, calculateScore());

        // Clear the contentDiv in preparation for the final slide
        contentDiv.textContent = "";

        // Display the local highscores from storage
        displayHighscores();
    });
}

// Function to store the newly generated scores into the local storage
function submitHighscore(userInput, score) {
    // Ensuring the result of this line of code is always an object
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];  // Retrieves value associated with "highscores" key via storage. Declares highscores variable 
    // and assigns it a value

    // Creates a new object named newHighscore and assigning 2 keys to it; name and score - user's latest highscore.
    var newHighscore = {
        name: userInput,
        score: score
    };  // highscores is an array of objects that have name and score keys, and we assign userInput and score to those keys, then add newHighscore to the highscores array
    highscores.push(newHighscore); // Adds this new object to the highscores array

    // Sorts the "highscores" array based a on descending numerical order (showing highest to lowest scores from top to bottom)
    highscores.sort(function (a, b) {   
        return b.score - a.score;       // if 'b' is bigger than 'a' then it must be higher up in the list than 'a'
    });

    // Store the highscores array that was just sorted back in local storage with key: highscores and value: highscores
    localStorage.setItem("highscores", JSON.stringify(highscores));
}

// Function to display local storage highscores
function displayHighscores() {
    var highscores = JSON.parse(localStorage.getItem("highscores")) || [];  // If nothing in local storage, instead, just create an empty array, JSON parse transforms data
    // Making the highscores page heading an h1 element for better readability
    var highscoresHeading = document.createElement("h1");
    highscoresHeading.textContent = "Highscores:";
    contentDiv.appendChild(highscoresHeading);

    // Display each highscore using a forEach loop. "highscores" is an array of JSON objects, for each element inside of the highscores array, perform some function 
    // on that index, create a p tag for that element, inside of that p tag, put the name value of the index that I'm looking at, : space, and then attach the score.
    highscores.forEach(function (highscore) {
        var scoreEntry = document.createElement("p");
        scoreEntry.textContent = highscore.name + ": " + highscore.score;
        scoreEntry.style.marginTop = "10px";
        contentDiv.appendChild(scoreEntry);
    });

    // Button to clear displayed highscores
    var clearHighscoresButton = document.createElement("button");
    clearHighscoresButton.textContent = "Clear Highscores";
    clearHighscoresButton.style.marginTop = "20px"; // Adding margin
    contentDiv.appendChild(clearHighscoresButton);

    // EventListener for clearHighscoresButton
    clearHighscoresButton.addEventListener("click", function (event) {
        localStorage.removeItem("highscores"); // Clears the highscores array from the storage
        // Clear contentDiv and to reflect changes whilst preserving the buttons
        contentDiv.textContent = "";
        displayHighscores();
    });

    // Add a button to start/restart quiz
    var startAnotherQuizButton = document.createElement("button");
    startAnotherQuizButton.textContent = "Start/Restart Quiz";
    startAnotherQuizButton.style.marginTop = "20px"; // Small margin to space out the buttons
    contentDiv.appendChild(startAnotherQuizButton);

    // Add event listener to the startAnotherQuizButton
    startAnotherQuizButton.addEventListener("click", function (event) {
        location.reload();  // Refreshes the page, thus restarting the program
    });
}

// Functions for quiz introduction/initial page (HTML):

function displayHighscoresScreen() {
    // Clear the time interval so timer doesn't randomly start running
    clearInterval(timerInterval);

    // Get element - accessing globally defined contentDiv
    contentDiv = document.getElementById("quizContent");

    // Clear div
    contentDiv.textContent = "";

    // Display the highscores via the function
    displayHighscores();
}

// Setting the link of the HTML document so that you can access the high scores screen from the get go.
var highscoresLink = document.getElementById("highscoresLink");
highscoresLink.addEventListener("click", function (event) {
    displayHighscoresScreen();
});

// Adding an event listener to the start quiz button to kickstart the quiz.
var startQuizButton = document.getElementById("startQuizButton");
startQuizButton.addEventListener("click", function () {
    // Removing the "See Highscores" link from the document flow when the quiz starts.
    var highscoresLink = document.getElementById("highscoresLink");
    highscoresLink.style.display = "none";

    startQuiz();
});