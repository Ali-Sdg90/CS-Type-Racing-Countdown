// ------------------------

const raceTime = [22, 00]; // [hh, mm]
const raceMessage = `

🔊 دورهمی هفتگی سی اس فردا یکشنبه ساعت 22:00
هم دورهمی عه هم مسابقه تایپ⌨️

علی و علی اینبار دستشون افتادهههه (میخوای کشف کنی علی ها کی هستن، بیا دورهمی رو👀)

لینکش رو هم 10 دیقه مونده به شروع تو توییتر و تلگرام میذارم🤳

بعدن نگی نگفتی هاااا، قراره بهمون کلللی خوش بگذره😌🔥

آهان، تا یادم نرفته، با دوربین باز شرکت میکنیم، باید مطمعن بشیم شما هستین که دارین تو مسابقه شرکت میکنین👀

#cs_internship
#typing_race
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
let endOfTimer = false;
let output = "";
let square = "";

const addSquares = () => {
    switch (Math.floor(Math.random() * 8)) {
        case 0:
            square = "🟥";
            break;
        case 1:
            square = "🟧";
            break;
        case 2:
            square = "🟨";
            break;
        case 3:
            square = "🟩";
            break;
        case 4:
            square = "🟦";
            break;
        case 5:
            square = "🟪";
            break;
        case 6:
            square = "⬛️";
            break;
        case 7:
            square = "⬜️";
            break;
        default:
            break;
    }
};

useEmoji = (timeString) => {
    addSquares();
    output = square;
    // console.log(timeString);
    if (!endOfTimer) {
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
        output += square;
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
