const popUp = document.getElementById('popup');
const popupButtom = document.querySelector('.popup-button');
const startButton = document.querySelector('.time-start');
const clock = new Audio('./sounds/secondclock.mp3');
const cheer = new Audio('./sounds/cheering.mp3');
const begin = new Audio('./sounds/begin.mp3');

let studyBackGround = document.querySelector('.study-option');
let breakBackGround = document.querySelector('.break-option');

let timeDuration = document.querySelector(".time-duration");
let timeBreak = document.querySelector("#break-time");
let timeStudy = document.querySelector("#study-time");

let studyTimer; // A global variable for the Study timer
let breakTimer; // A global variable for the Break timer

let isPaused = true; // Timer is paused or running
let timeLeft; // Store the remaining time globally

let middleCircle = document.querySelector('.timer .middle-circle');


function headerColor() {
    let bgColor = window.getComputedStyle(studyBackGround).backgroundColor;

    if (bgColor === 'rgb(255, 0, 0)') {
        studyBackGround.classList.remove('study-option'); 
        breakBackGround.classList.add('study-option'); 
    } else {
        studyBackGround.classList.add('study-option');
        breakBackGround.classList.remove('study-option'); 
    }
}

function stratBreakTimer() {
    // Clear any previous break timer
    if (breakTimer) {
        clearInterval(breakTimer);
    }

    startButton.innerText = ''; 
    timeDuration.innerText = `${timeBreak.textContent}:00`; // Display the break time
    

    // Reset timeLeft for the break
    timeLeft = parseInt(timeBreak.textContent, 10) * 60; 

    breakTimer = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(breakTimer); 
            headerColor(); // Switch background color
            isPaused = true;
            startStudyTimer(); // Start the Pomodoro timer again
        } else {
            timeLeft--; 
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDuration.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
        }

        if (timeLeft < 10 && timeLeft > 0) {
            clock.play();
        }

    }, 1000); // Repeat every second
}


function startStudyTimer() {
    // Clear any previous Study timer
    if (studyTimer) {
        clearInterval(studyTimer);
    }

    if (isPaused) {
        begin.play();
        startButton.innerText = 'Pause';

        // Reset timeLeft if not set
        if (!timeLeft) {
            timeDuration.innerText = `${timeStudy.textContent}:00`; 
            timeLeft = parseInt(timeDuration.innerText, 10) * 60; 
        }

        studyTimer = setInterval(function () {
            if (timeLeft <= 0) {
                cheer.play();
                triggerFestival(); // Show celebration when timer ends
                clearInterval(studyTimer);

                headerColor(); 
                stratBreakTimer(); // Start the break timer
            } else {
                timeLeft--; 
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timeDuration.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; 
            
            }

            if (timeLeft < 10 && timeLeft > 0) {
                clock.play();
            }

        }, 1000); // Repeat every second

        isPaused = false; // Mark as running
    } else {
        // If the timer is running, pause it
        clearInterval(studyTimer); // Stop the current timer
        startButton.innerText = 'Resume'; 
        isPaused = true; // Mark the timer as paused
    }
}

// Festival when StudyTimer reaches 0
function triggerFestival() {
    confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
    });
    confetti({
        particleCount: 200,
        spread: 120,
        startVelocity: 30,
        origin: { x: 0.5, y: 0.5 }
    });
}

// handle click events for color setting
function handleColorClick() {
    document.querySelectorAll('.color-setting .circle').forEach(circle => {
      circle.addEventListener('click', function() {
        // adjustTime('study', 0);    //if I wanna make start from beggining (studyTimer)

        document.querySelectorAll('.color-setting .ok-sign').forEach(ok => ok.classList.add('ok-visible'));
        
        // for color in middle circle 
        const selectedColor = window.getComputedStyle(this).backgroundColor;
        document.querySelector('.timer .middle-circle').style.borderColor = selectedColor;

        // Create or show the OK sign in the clicked circle
        let okSign = this.querySelector('.ok-sign');
        if (!okSign) {
          okSign = document.createElement('div');
          okSign.classList.add('ok-sign');
          okSign.textContent = '✔'; // Display the OK sign
          this.appendChild(okSign);
        }
        okSign.classList.remove('ok-visible');
      });
    });
  }
  
  // handle click events for font setting
  function handleFontClick() {

    const fontChoices = document.querySelectorAll('.font-setting .circle');
    
    fontChoices.forEach(circle => {

      circle.addEventListener('click', function() {
        // adjustTime('study', 0);   //if I wanna make start from beggining (studyTimer)
        
        fontChoices.forEach(c => c.classList.remove('clicked'));
        this.classList.add('clicked');
  
        // Get the selected font from the data-font attribute
        const selectedFont = this.getAttribute('data-font');
        // Apply the selected font to the whole page
        document.body.style.fontFamily = selectedFont;
  
        // Update the "Aa" text in each circle to reflect its font style
        fontChoices.forEach(item => {
          const font = item.getAttribute('data-font');
          item.style.fontFamily = font;
        });
      });
    });
  }

handleColorClick();
handleFontClick();

function adjustTime(type, change) {
    let element = document.getElementById(`${type}-time`);
    let currentTime = parseInt(element.textContent);

    clearInterval(studyTimer);
    clearInterval(breakTimer);

    // Adjust time value and update DOM
    currentTime += change;
    if (type === 'break' && currentTime > 45) {
        currentTime = 45;
    } else if (type === 'study' && currentTime > 90) {
        currentTime = 90;
    }  
    if (currentTime < 5) currentTime = 5; 
    element.textContent = currentTime;

    studyBackGround.classList.add('study-option'); 
    breakBackGround.classList.remove('study-option');

    isPaused = true;
    startButton.innerText = 'Start'
    timeDuration.innerText = `${timeStudy.textContent}:00`;
    

    if (type === 'study') {
        
        timeLeft = currentTime * 60;
        timeDuration.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    } else { // when type break it makes a new start
        let defaultStudyTime = parseInt(timeStudy.textContent);
        timeLeft = defaultStudyTime * 60;
        timeDuration.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    }
}

// Function to open the pop-up
function openPopup() {
    popUp.style.display = 'flex';
}

// Function to close the pop-up
function closePopup() {
    popUp.style.display = 'none';
}

// Event listeners
document.querySelector('.option img').addEventListener('click', openPopup);

document.querySelector('.popup-button').addEventListener('click', closePopup);
document.querySelector('.popup .close').addEventListener('click', closePopup);

// close the pop-up when clicking outside of the popup-content
popUp.addEventListener('click', (event) => {
    if (event.target === popUp) {
        closePopup();
    }
});

startButton.addEventListener('click', startStudyTimer);
