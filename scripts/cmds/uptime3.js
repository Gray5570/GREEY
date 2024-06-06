module.exports = {
  config: {
    name: "uptime3",
    aliases: ["up3", "upt3"],
    version: "1.0",
    author: "XyryllPanget",
    role: 0,
    shortDescription: {
      en: "Displays the uptime of the bot."
    },
    longDescription: {
      en: "Displays the amount of time that the bot has been running for."
    },
    category: "System",
    guide: {
      en: "Use {p}uptime to display the uptime of the bot."
    }
  },
  onStart: async function ({ api, event, args }) {
    const uptime = process.uptime();
    const seconds = Math.floor(uptime % 60);
    const minutes = Math.floor((uptime / 60) % 60);
    const hours = Math.floor((uptime / (60 * 60)) % 24);
    const days = Math.floor(uptime / (60 * 60 * 24));
    const uptimeString = `${hours} hours ${minutes} minutes ${seconds} second`;
    api.sendMessage(`🗂️ஜ۩۞۩۩۞۩ஜ Welcome to uptime3 \n࿇ ══━━━━✥◈✥━━━━══ ࿇\n, ஜ۩۞۩۩۞۩ஜ time remaining for the bot ஜ۩۞۩۩۞۩ஜn࿇ ══━━━━✥◈✥━━━━══ ࿇\n [⏰${uptimeString}]\n\n࿇ ══━━━━✥◈✥━━━━══ ࿇ஜ۩۞۩ Kitty IA ۩۞۩ஜ.`, event.threadID);
  }
};
