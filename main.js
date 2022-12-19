// Select Elements
let countSpan = document.querySelector(".quiz-info .count span");
let bullets = document.querySelector(".quiz-app .bullets");
let bulletSpanContainer = document.querySelector(".quiz-app .bullets .spans ");
let quizArea = document.querySelector(".quiz-app .quiz-area");
let answersArea = document.querySelector(".quiz-app .answers-area");
let subButton = document.querySelector(".quiz-app .submit-answer");
let countDown = document.querySelector (".countDown");
// set options 
let rightAnsNum = 0;
let CI = 0; // currentIndex
let countDownInterval;


let resultsContainer = document.querySelector(".quiz-app .results");
console.log(resultsContainer)


function getQuestions () {
    let myRequest = new XMLHttpRequest();

    myRequest.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
            let questions = JSON.parse(this.responseText);
            let questionsCount = questions.length;
            // set Questions count and bullets 
            createBullets(questionsCount);
            // add question data
            aqd(questions[CI],questionsCount);
            counter(150,questionsCount);


           // Click on submitButton
           subButton.onclick = () => {
            // Bring the right answer
            let tra = questions[CI].right_answer;
            
            // Increase index CI
            CI++;
            checkAnswer(tra,questionsCount);
            // Remove previous question
            quizArea.innerHTML='';
            answersArea.innerHTML='';
            aqd(questions[CI],questionsCount);
            // Handle bullets
            handleBullets();
            showResults(questionsCount);
            clearInterval(countDownInterval)
            counter(150,questionsCount);
           }
        }
    }

    myRequest.open("GET", "questions.json", true);
    myRequest.send();
};
getQuestions();

function createBullets(num) {
    countSpan.innerHTML = num;
    // Create bullets span 
    for (let i = 0; i < num; i++){
        let bullet = document.createElement("span");
        if (i === 0) {
            bullet.className = "on";
        }

        bulletSpanContainer.appendChild(bullet);
    }
};
function aqd(obj,count){
    if (CI < count) {
        
// create h2   question title
let qH2 = document.createElement("h2");
let qText = document.createTextNode(obj.title);
qH2.appendChild(qText);
quizArea.appendChild(qH2);
// start answers
for (let i = 1; i <= 4; i++) {
    // Create Main Answer Div
    let mainDiv = document.createElement("div");

    // Add Class To Main Div
    mainDiv.className = "answer";

    // Create Radio Input
    let radioInput = document.createElement("input");

    // Add Type + Name + Id + Data-Attribute
    radioInput.name = "question";
    radioInput.type = "radio";
    radioInput.id = `answer_${i}`;
    radioInput.dataset.answer = obj[`answer_${i}`];

    // Make First Option Selected
    if (i === 1) {
      radioInput.checked = true;
    }

    // Create Label
    let theLabel = document.createElement("label");

    // Add For Attribute
    theLabel.htmlFor = `answer_${i}`;

    // Create Label Text
    let theLabelText = document.createTextNode(obj[`answer_${i}`]);

    // Add The Text To Label
    theLabel.appendChild(theLabelText);

    // Add Input + Label To Main Div
    mainDiv.appendChild(radioInput);
    mainDiv.appendChild(theLabel);

    // Append All Divs To Answers Area
    answersArea.appendChild(mainDiv);
  }
 }
};
function checkAnswer(rightAns,count) {
let answers = document.getElementsByName("question");
let theChosenAns; 
for (let i = 0; i< answers.length; i++) {
    if (answers[i].checked) {
        theChosenAns = answers[i].dataset.answer
    }
}
if (rightAns === theChosenAns) {
   rightAnsNum ++;
}
};
function handleBullets(){
    let spans = document.querySelectorAll(".quiz-app .bullets .spans span");
    let arrayOfSpan = Array.from(spans);
    arrayOfSpan.forEach((ele,index) => {
        if (CI === index){
            ele.className = "on";
        }
    }
  )
 };
 function showResults(count){
    if (CI === count) {
        let theResults;

        quizArea.remove();
        answersArea.remove();
        bullets.remove();
        subButton.remove();
        
    if (rightAnsNum > count / 2 && rightAnsNum < count) {
        theResults = `<span class="good">Good</span>, ${rightAnsNum} From ${count}`;
      } else if (rightAnsNum === count) {
        theResults = `<span class="perfect">Perfect</span>, All Answers Is Good`;
      } else {
        theResults = `<span class="bad">Bad</span>, ${rightAnsNum} From ${count}`;
      }
  
      resultsContainer.innerHTML = theResults;
      resultsContainer.style.padding = "10px";
      resultsContainer.style.backgroundColor = "white";
      resultsContainer.style.marginTop = "10px";
    }
 };

 function counter(duration, count){
    if (CI < count ) {
        let minutes, seconds ;
        countDownInterval = setInterval(function () {

            minutes = parseInt (duration / 60 );
            seconds = parseInt( duration % 60 );

            minutes = minutes < 10 ? `0${minutes}` : minutes ;
            seconds = seconds < 10 ? `0${seconds}` : seconds ;

            countDown.innerHTML = `${minutes}:${seconds}`;

            if (--duration < 0) {
                clearInterval(countDownInterval);
                subButton.click();
            }
        },1000)
    }
 }
