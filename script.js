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

let studyTimer; // Declare a global variable for the Pomodoro timer
let isPaused = true; // Flag to track whether the timer is paused or running
let timeLeft; // Store the remaining time globally
let breakTimer; // Declare a global variable for the Break timer

let middleCircle = document.querySelector('.timer .middle-circle');

// function secondPlay() {
//     var audio = new Audio('./secondclock.mp3');
//     audio.play();
//     }
//     // setInterval(play, 1000)


function headerColor() {
    let bgColor = window.getComputedStyle(studyBackGround).backgroundColor;

    if (bgColor === 'rgb(255, 0, 0)') {
        studyBackGround.classList.remove('study-option'); // Remove class
        breakBackGround.classList.add('study-option'); // Add class to break option
    } else {
        studyBackGround.classList.add('study-option'); // Add class back
        breakBackGround.classList.remove('study-option'); // Remove class from break option
    }
}

function stratBreakTimer() {
    // Clear any previous break timer
    if (breakTimer) {
        clearInterval(breakTimer);
    }

    startButton.innerText = ''; // Update the button text for break
    timeDuration.innerText = `${timeBreak.textContent}:00`; // Display the break time
    

    // Reset timeLeft for the break
    timeLeft = parseInt(timeBreak.textContent, 10) * 60; // Convert minutes to seconds

    breakTimer = setInterval(function () {
        if (timeLeft <= 0) {
            clearInterval(breakTimer); // Stop the timer when it reaches 0
            headerColor(); // Switch background color or visual indicator
            isPaused = true;
            startStudyTimer(); // Start the Pomodoro timer again
        } else {
            timeLeft--; // Decrease time by 1 second
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            timeDuration.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Display in mm:ss format
        }

        // Play sound when timeLeft is less than 10 seconds
        if (timeLeft < 10 && timeLeft > 0) {
            clock.play();
        }

    }, 1000); // Repeat every second
}


function startStudyTimer() {
    // Clear any previous Pomodoro timer
    if (studyTimer) {
        clearInterval(studyTimer);
    }


    if (isPaused) {
        begin.play();
        startButton.innerText = 'Pause'; // Change button text to "Pause"

        // Reset timeLeft if not set
        if (!timeLeft) {
            timeDuration.innerText = `${timeStudy.textContent}:00`; // Display the study time
            timeLeft = parseInt(timeDuration.innerText, 10) * 60; // Convert minutes to seconds
        }

        studyTimer = setInterval(function () {
            if (timeLeft <= 0) {
                cheer.play();
                triggerFestival(); // Show celebration when timer ends
                clearInterval(studyTimer); // Stop the timer when it reaches 0

                headerColor(); // Change background color
                stratBreakTimer(); // Start the break timer
                // isPaused = true; // Mark as paused
                // startButton.innerText = ''; // Reset button text
            } else {
                timeLeft--; // Decrease time by 1 second
                const minutes = Math.floor(timeLeft / 60);
                const seconds = timeLeft % 60;
                timeDuration.innerText = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`; // Display in mm:ss format
            
            }

            // Play sound when timeLeft is less than 10 seconds
            if (timeLeft < 10 && timeLeft > 0) {
                clock.play();
            }

        }, 1000); // Repeat every second

        isPaused = false; // Mark as running
    } else {
        // If the timer is running, pause it
        clearInterval(studyTimer); // Stop the current timer
        startButton.innerText = 'Start'; // Change button text back to "Start"
        isPaused = true; // Mark the timer as paused
    }
}



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

// Function to handle click events for color setting (first line)
function handleColorClick() {
    document.querySelectorAll('.color-setting .circle').forEach(circle => {
      circle.addEventListener('click', function() {
        adjustTime('study', 0);
        // Remove "OK" sign from other circles in the color-setting group
        document.querySelectorAll('.color-setting .ok-sign').forEach(ok => ok.classList.add('ok-visible'));
        
        // for color in middle circle 
        const selectedColor = window.getComputedStyle(this).backgroundColor;
        // Apply the selected color to the middle circle's border
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
  
  // Function to handle click events for font setting (second line)
  function handleFontClick() {
    // Select all circles in the font-setting group
    const fontChoices = document.querySelectorAll('.font-setting .circle');
    
    fontChoices.forEach(circle => {
        

      circle.addEventListener('click', function() {

        adjustTime('study', 0);
        
        // Remove the 'clicked' class from all circles
        fontChoices.forEach(c => c.classList.remove('clicked'));
  
        // Add the 'clicked' class to the clicked circle
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
  
  
  // Call the functions to handle clicks for both color and font setting
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
    if (currentTime < 5) currentTime = 5; // Prevent negative values
    element.textContent = currentTime;

    studyBackGround.classList.add('study-option'); // Add class back
    breakBackGround.classList.remove('study-option');

    isPaused = true;
    startButton.innerText = 'Start'
    timeDuration.innerText = `${timeStudy.textContent}:00`;
    

    if (type === 'study') {
        
        timeLeft = currentTime * 60;
        timeDuration.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    } else { // to show the time for study timer when the type is break like a new start
        let defaultStudyTime = parseInt(timeStudy.textContent);
        timeLeft = defaultStudyTime * 60;
        timeDuration.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    }

    
    // timeLeft = currentTime * 60;
    // timeBreak.innerText = `${Math.floor(timeLeft / 60)}:${timeLeft % 60 < 10 ? '0' : ''}${timeLeft % 60}`;
    

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
document.querySelector('.popup-button').addEventListener('click', closePopup);
document.querySelector('.study-option').addEventListener('click', openPopup);
document.querySelector('.break-option').addEventListener('click', openPopup);
document.querySelector('.option img').addEventListener('click', openPopup);

document.querySelector('.popup .close').addEventListener('click', closePopup);

document.querySelector('.popup .close').addEventListener('click', closePopup);

// If you want to close the pop-up when clicking outside of the popup-content
popUp.addEventListener('click', (event) => {
    if (event.target === popUp) {
        closePopup();
    }
});

startButton.addEventListener('click', startStudyTimer);

console.log(timeBreak.textContent);