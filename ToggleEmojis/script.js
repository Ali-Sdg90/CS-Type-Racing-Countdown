const emojis = ["💔", "❤️‍🩹"];

const pageContent = document.getElementById("page");
let iterationCounter = 0;

let output = "";

setInterval(() => {
    if (iterationCounter++ % 2 === 0) {
        output = emojis[0];
    } else {
        output = emojis[1];
    }
    pageContent.textContent = output;
}, 1000);

document.addEventListener("click", () => {
    navigator.clipboard.writeText(output);
});
