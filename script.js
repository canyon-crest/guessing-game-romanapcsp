let answer = 0;
let guessCount = 0;
const scores = [];
let range = 0;
let startTime = 0;
const times = [];
let streak = 0;

let playerName = prompt("What is your name?");
playerName = playerName.charAt(0).toUpperCase() + playerName.slice(1).toLowerCase();

function getDaySuffix(day) {
    if (day >= 11 && day <= 13) return "th";
    if (day % 10 === 1) return "st";
    if (day % 10 === 2) return "nd";
    if (day % 10 === 3) return "rd";
    return "th";
}

function updateDate() {
    const months = ["January","February","March","April","May","June",
                    "July","August","September","October","November","December"];
    const now = new Date();
    const month = months[now.getMonth()];
    const day = now.getDate();
    const suffix = getDaySuffix(day);
    const year = now.getFullYear();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    document.getElementById("date").textContent =
        month + " " + day + suffix + ", " + year + " — " + hours + ":" + minutes + ":" + seconds;
}
updateDate();
setInterval(updateDate, 1000);

document.getElementById("playBtn").addEventListener("click", play);
document.getElementById("guessBtn").addEventListener("click", makeGuess);
document.getElementById("giveUpBtn").addEventListener("click", giveUp);

function play() {
    range = 0;
    let levels = document.getElementsByName("level");
    for (let i = 0; i < levels.length; i++) {
        if (levels[i].checked) {
            range = parseInt(levels[i].value);
        }
        levels[i].disabled = true;
    }
    document.getElementById("msg").textContent = playerName + ", guess a number 1-" + range;
    answer = Math.floor(Math.random() * range) + 1;
    guessCount = 0;
    startTime = new Date().getTime();
    document.body.style.backgroundColor = "white";
    document.getElementById("guessBtn").disabled = false;
    document.getElementById("giveUpBtn").disabled = false;
    document.getElementById("playBtn").disabled = true;
}

function makeGuess() {
    let guess = parseInt(document.getElementById("guess").value);
    if (isNaN(guess)) {
        document.getElementById("msg").textContent = "Please enter a valid number";
        return;
    }
    guessCount++;
    const msg = document.getElementById("msg");
    let diff = Math.abs(guess - answer);
    let hint = diff <= 2 ? " Hot!" : diff <= 5 ? " Warm." : " Cold.";

    if (diff <= 2) document.body.style.backgroundColor = "#ff4d4d";
    else if (diff <= 5) document.body.style.backgroundColor = "#ffa500";
    else document.body.style.backgroundColor = "#87ceeb";

    if (guess == answer) {
        updateStreak(true);
        msg.textContent = "Correct! " + playerName + ", it took " + guessCount + " tries.";
        updateScore(guessCount);
        resetGame();
        document.body.style.backgroundColor = "#ffff66";
    } else if (guess < answer) {
        msg.textContent = "Too low, try again." + hint;
    } else {
        msg.textContent = "Too high, try again." + hint;
    }
}

function giveUp() {
    const msg = document.getElementById("msg");
    msg.textContent = "You gave up! The answer was " + answer + ".";
    updateScore(range);
    updateStreak(false);
    resetGame();
    document.body.style.backgroundColor = "#d3d3d3";
}

function updateStreak(win) {
    if (win) {
        streak++;
    } else {
        streak = 0;
    }
    document.getElementById("streak").textContent = "Current Streak: " + streak;
}

function updateScore(score) {
    scores.push(score);
    document.getElementById("wins").textContent = "Total wins: " + scores.length;

    let sum = 0;
    for (let i = 0; i < scores.length; i++) {
        sum += scores[i];
    }
    document.getElementById("avgScore").textContent = "Average Score: " + (sum / scores.length).toFixed(1);

    let elapsed = ((new Date().getTime() - startTime) / 1000).toFixed(1);
    times.push(parseFloat(elapsed));

    let fastestTime = times[0];
    let totalTime = 0;
    for (let i = 0; i < times.length; i++) {
        if (times[i] < fastestTime) fastestTime = times[i];
        totalTime += times[i];
    }
    document.getElementById("fastest").textContent = "Fastest Game: " + fastestTime + "s";
    document.getElementById("avgTime").textContent = "Average Time: " + (totalTime / times.length).toFixed(1) + "s";

    scores.sort(function(a, b) { return a - b; });
    let lb = document.getElementsByName("leaderboard");
    for (let i = 0; i < lb.length; i++) {
        if (i < scores.length) {
            lb[i].textContent = scores[i];
        } else {
            lb[i].textContent = "--";
        }
    }
}

function resetGame() {
    document.getElementById("guess").value = "";
    document.getElementById("guessBtn").disabled = true;
    document.getElementById("giveUpBtn").disabled = true;
    document.getElementById("playBtn").disabled = false;
    document.getElementById("e").disabled = false;
    document.getElementById("m").disabled = false;
    document.getElementById("h").disabled = false;
}