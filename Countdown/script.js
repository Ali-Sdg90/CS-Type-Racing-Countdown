// ------------------------

const raceTime = [22, 00]; // [hh, mm]
const raceMessage = `
Aloha, This is enticing message!

.
`;

// ------------------------

function getRemainingTime() {
    const endTime = new Date();
    endTime.setHours(raceTime[0], raceTime[1], 0);
    const timeDiff = (endTime - new Date()) / 1000;
    return {
        hours: Math.trunc(timeDiff / 3600),
        minutes: Math.trunc((timeDiff / 60) % 60),
        seconds: Math.trunc(timeDiff % 60),
    };
}

const pageContent = document.getElementById("page");
let iterationCounter = 0;
let endOfTimer = false;
let output = "";

const addHighlights = () => {
    if (iterationCounter % 2 === 0) {
        output += "⬜️";
    } else {
        output += "⬛️";
    }
};

useEmoji = (timeString) => {
    output = "";
    iterationCounter++;
    // console.log(timeString);
    if (!endOfTimer) {
        addHighlights();

        for (let i = 0; i < timeString.length; i++) {
            let replacement = "";
            switch (timeString.charAt(i)) {
                case "0":
                    replacement = "0️⃣";
                    break;
                case "1":
                    replacement = "1️⃣";
                    break;
                case "2":
                    replacement = "2️⃣";
                    break;
                case "3":
                    replacement = "3️⃣";
                    break;
                case "4":
                    replacement = "4️⃣";
                    break;
                case "5":
                    replacement = "5️⃣";
                    break;
                case "6":
                    replacement = "6️⃣";
                    break;
                case "7":
                    replacement = "7️⃣";
                    break;
                case "8":
                    replacement = "8️⃣";
                    break;
                case "9":
                    replacement = "9️⃣";
                    break;
                case ":":
                    replacement = ":";
                    break;
                default:
                    endOfTimer = true;
            }
            output += replacement;
        }
        addHighlights();
    } else {
        output = "🎉🎉🎉🎉🎉🎉🎉🎉";
    }

    console.log(output);
    pageContent.textContent = output;
};

function formatTime(time) {
    return String(time).padStart(2, "0");
}

setInterval(() => {
    const remainingTime = getRemainingTime();
    const formattedTime = `${formatTime(remainingTime.hours)}:${formatTime(
        remainingTime.minutes
    )}:${formatTime(remainingTime.seconds)}`;

    useEmoji(formattedTime);
}, 1000);

document.addEventListener("click", () => {
    navigator.clipboard.writeText(output + raceMessage);
});
