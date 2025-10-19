require("dotenv").config();
const { Telegraf } = require("telegraf");
const { DateTime } = require("luxon");

const bot = new Telegraf(process.env.BOT_TOKEN);
const ALLOWED_USERNAME = "Ali_Sdg90";
const GIF = process.env.GIF_URL || null;
if (!process.env.BOT_TOKEN) throw new Error("BOT_TOKEN missing in .env");
if (!GIF) throw new Error("GIF_URL missing in .env");

const jobs = new Map(); // chatId -> { intervalId, messageId, ownerId }

// -------- time helpers --------
function nextMondayAt1500() {
    const zone = "Asia/Tehran";
    let now = DateTime.now().setZone(zone);
    const wd = now.weekday; // 1 = Monday
    let add = 0;
    if (wd === 1) {
        const targetToday = now.set({
            hour: 16,
            minute: 0,
            second: 0,
            millisecond: 0,
        });
        add = now < targetToday ? 0 : 7;
    } else {
        add = (8 - wd) % 7;
    }
    return now
        .plus({ days: add })
        .set({ hour: 16, minute: 0, second: 0, millisecond: 0 });
}

function pad(n) {
    return String(n).padStart(2, "0");
}
function hhmmssUntil(target) {
    const now = DateTime.now().setZone("Asia/Tehran");
    if (now >= target) return "00:00:00";
    const diff = target.diff(now, ["hours", "minutes", "seconds"]).toObject();
    // total hours may be >24 so compute days -> hours
    const totalSec = Math.floor(target.toSeconds() - now.toSeconds());
    const h = Math.floor(totalSec / 3600);
    const m = Math.floor((totalSec % 3600) / 60);
    const s = totalSec % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

// -------- emoji map & random square --------
function digitToEmoji(ch) {
    switch (ch) {
        case "0":
            return "0️⃣";
        case "1":
            return "1️⃣";
        case "2":
            return "2️⃣";
        case "3":
            return "3️⃣";
        case "4":
            return "4️⃣";
        case "5":
            return "5️⃣";
        case "6":
            return "6️⃣";
        case "7":
            return "7️⃣";
        case "8":
            return "8️⃣";
        case "9":
            return "9️⃣";
        case ":":
            return ":";
        default:
            return "";
    }
}
function timeToEmoji(str) {
    let out = "";
    for (let i = 0; i < str.length; i++) out += digitToEmoji(str.charAt(i));
    return out;
}
function randomSquare() {
    switch (Math.floor(Math.random() * 8)) {
        case 0:
            return "🟥";
        case 1:
            return "🟧";
        case 2:
            return "🟨";
        case 3:
            return "🟩";
        case 4:
            return "🟦";
        case 5:
            return "🟪";
        case 6:
            return "⬛️";
        default:
            return "⬜️";
    }
}

// -------- build caption --------
function buildCaption() {
    const target = nextMondayAt1500();
    const t = hhmmssUntil(target);
    const emojiTime = timeToEmoji(t);
    const sq = randomSquare();
    return `${sq}${emojiTime}${sq}\nسلام بچه‌ها!

دوشنبه ساعت ۱۶:۰۰ یه مسابقه تایپ باحال داریممم😎⌨️

بیاین دورهم گپ بزنیم و بحرفیم :)

بعدا نگی نگفتی هاااا، قراره بهمون کلللی خوش بگذره😌🔥

این پیام هر ۱۰ ثانیه آپدیت می‌شه تا زمانی که تا دورهمی مونده رو بهت نشون بده. 
بعدا بهونه اینکه اوا حواسم نبود و نمی‌دونستم دورهمی داریم و اینا قبول نیست. بهت دارم با دقت ۱۰ ثانیه می‌گم تا دورهمی چقدر مونده. باید بیای!😌🔪`;
}

// -------- start / stop --------
async function startCountdown(chatId, ownerId) {
    if (jobs.has(chatId)) return false;
    // send animation with caption (bot owns this message -> can edit caption)
    const sent = await bot.telegram.sendAnimation(chatId, GIF, {
        caption: buildCaption(),
    });
    const msgId = sent.message_id;
    const intervalId = setInterval(async () => {
        try {
            const newCap = buildCaption();
            // edit caption of the animation message
            await bot.telegram.editMessageCaption(
                chatId,
                msgId,
                undefined,
                newCap
            );
        } catch (e) {
            console.error("editCaption failed", e && e.message ? e.message : e);
        }
    }, 10_000);
    jobs.set(chatId, { intervalId, messageId: msgId, ownerId });
    return true;
}

function stopCountdown(chatId, requesterId) {
    const job = jobs.get(chatId);
    if (!job) return { ok: false, reason: "not_found" };
    if (job.ownerId !== requesterId) return { ok: false, reason: "not_owner" };
    clearInterval(job.intervalId);
    jobs.delete(chatId);
    return { ok: true };
}

// -------- bot commands --------
bot.command("launch", async (ctx) => {
    const chatType = ctx.chat?.type || "";
    if (!["group", "supergroup"].includes(chatType))
        return ctx.reply("این کامند را در گروه بزن.");
    const uname = ctx.from?.username || "";
    if (uname.toLowerCase() !== ALLOWED_USERNAME.toLowerCase())
        return;
    const ok = await startCountdown(ctx.chat.id, ctx.from.id);
    if (ok) return;
    return ctx.reply("قبلاً یک شمارش معکوس در این گروه فعال شده است.");
});

bot.command("stop", (ctx) => {
    const uname = ctx.from?.username || "";
    if (uname.toLowerCase() !== ALLOWED_USERNAME.toLowerCase())
        return;
    const res = stopCountdown(ctx.chat.id, ctx.from.id);
    if (res.ok) return ctx.reply("شمارش معکوس متوقف شد ✅");
    if (res.reason === "not_owner")
        return;
    return ctx.reply("وظیفه‌ای پیدا نشد.");
});

// minimal startup help
bot.start((ctx) =>
    ctx.reply(
        "برای راه‌اندازی در گروه /launch را بزن (فقط @Ali_Sdg90). توقف: /stop"
    )
);

bot.launch()
    .then(() => console.log("bot up"))
    .catch((e) => console.error(e));

// graceful
process.once("SIGINT", () => bot.stop("SIGINT"));
process.once("SIGTERM", () => bot.stop("SIGTERM"));
