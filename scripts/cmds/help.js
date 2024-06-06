const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;
const doNotDelete = "[ ۩۩ | GoatBot V2 ]"; // changing this wont change the goatbot V2 of list cmd it is just a decoyy

module.exports = {
  config: {
    name: "help",
    version: "1.17",
    author: "NTKhang", // original author leeza 
    countDown: 0,
    role: 0,
    shortDescription: {
      en: "View command usage and list all commands directly",
    },
    longDescription: {
      en: "View command usage and list all commands directly",
    },
    category: "info",
    guide: {
      en: "{pn} / help cmdName ",
    },
    priority: 1,
  },

  onStart: async function ({ message, args, event, threadsData, role }) {
    const { threadID } = event;
    const threadData = await threadsData.get(threadID);
    const prefix = getPrefix(threadID);

    if (args.length === 0) {
      const categories = {};
      let msg = "";

      msg += `✿❯────「✿」────❮✿⤴\n   ஜ۩۞۩ஜ Kitty IA ஜ۩۞۩ஜ \n✿❯────「✿」────❮✿⤴`; // replace with your name 

      for (const [name, value] of commands) {
        if (value.config.role > 1 && role < value.config.role) continue;

        const category = value.config.category || "Uncategorized";
        categories[category] = categories[category] || { commands: [] };
        categories[category].commands.push(name);
      }

      Object.keys(categories).forEach((category) => {
        if (category !== "info") {
          msg += `\n━─━─━≫\n│ ⏎  ${category.toUpperCase()}  ⏎`;


          const names = categories[category].commands.sort();
          for (let i = 0; i < names.length; i += 3) {
            const cmds = names.slice(i, i + 3).map((item) => `ஜ۩۞۩ஜ${item}`);
            msg += `\n│ ${cmds.join(" ".repeat(Math.max(1, 10 - cmds.join("").length)))}`;
          }

          msg += `\n━─━─━≫`;
        }
      });

      const totalCommands = commands.size;
      msg += `\nCurrently, the bot has ${totalCommands} commands that can be used\n`;
      msg += `Type ${prefix} .help cmdName to view the details of that command\n`;
      msg += `۩۩ | GoatBot V2`; // its not decoy so change it if you want 

      const helpListImages = [
       // add image link here  // Add more image links as needed
      ];

      const helpListImage = helpListImages[Math.floor(Math.random() * helpListImages.length)];

      await message.reply({
        body: msg,
        attachment: await global.utils.getStreamFromURL(helpListImage),
      });
    } else {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));

      if (!command) {
        await message.reply(`Command "${commandName}" not found.`);
      } else {
        const configCommand = command.config;
        const roleText = roleTextToString(configCommand.role);
        const author = configCommand.author || "Unknown";

        const longDescription = configCommand.longDescription ? configCommand.longDescription.en || "No description" : "No description";

        const guideBody = configCommand.guide?.en || "No guide available.";
        const usage = guideBody.replace(/{p}/g, prefix).replace(/{n}/g, configCommand.name);

        const response = `✿❯────「✿」────❮✿⤴ஜ۩۞۩ஜ Kitty IA ஜ۩۞۩ஜ✿❯────「✿」────❮✿⤴
  ➡۩۩ ${configCommand.name}
  ➡۩۩ ℹ️
  ➡۩۩ Description: ${longDescription}
  ➡۩۩ Autres noms: ${configCommand.aliases ? configCommand.aliases.join(", ") : "Do not have"}
  ➡۩۩ Autres noms inclus dans votre groupe: Aucun
  ➡۩۩ Version: ${configCommand.version || "1.0"}
  ➡۩۩ Rôle: ${roleText}
  ➡۩۩ Temps par commande: ${configCommand.countDown || 1}s
  ➡۩۩ Auteur: ${author}
  ➡۩۩ Usage
  ➡۩۩ ${usage}
  ➡۩۩ Notes
  ➡۩۩ Le contenu inclus dans les crochets <XXXXX> peut être modifié
  ➡۩۩ Le contenu inclus entre crochets [a|b|c] peut être remplacé par a, b ou c.\n✿❯────「✿」────❮✿\n ۩۩ Édité par : ஜ۩۞۩ஜ Kitty IA ஜ۩۞۩ஜ
  `;

        await message.reply(response);
      }
    }
  },
};

function roleTextToString(roleText) {
  switch (roleText) {
    case 0:
      return "0 (All users)";
    case 1:
      return "1 (Group administrators)";
    case 2:
      return "2 (Admin bot)";
    default:
      return "Unknown role";
  }
}
