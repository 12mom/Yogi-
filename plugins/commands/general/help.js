module.exports.config = {
  name: "اوامر",
  version: "1.0.4",
  hasPermssion: 0,
  credits: "Yogi YT 🇪🇬",
  description: "قائمة الأوامر مزينة برموز جميلة",
  commandCategory: "نظام",
  usages: "[رقم الصفحة | اسم الأمر]",
  cooldowns: 5,
  envConfig: {
    autoUnsend: true,
    delayUnsend: 20
  }
};

module.exports.run = async function ({ api, event, args }) {
  const { commands } = global.client;
  const { threadID, messageID } = event;

  const page = parseInt(args[0]) || 1;
  const numberPerPage = 20;
  const allCommands = [...commands.keys()].sort();
  const totalPages = Math.ceil(allCommands.length / numberPerPage);
  const start = (page - 1) * numberPerPage;
  const end = start + numberPerPage;
  const pageCommands = allCommands.slice(start, end);

  // رموز جميلة حسب التصنيف أو عشوائية
  const icons = {
    system: "⚙️",
    admin: "👑",
    fun: "🎉",
    music: "🎵",
    image: "🖼️",
    game: "🎮",
    default: ["🍭", "🍬", "🍫", "🍡", "🍩", "🍪", "🧁", "🎈", "💖", "🔥"]
  };

  let msg = `🎀 قائمة أوامر Yogi Bot 🎀\n📄 الصفحة (${page}/${totalPages})\n━━━━━━━━━━━━━━\n`;

  pageCommands.forEach((cmdName, index) => {
    const cmd = commands.get(cmdName);
    const cat = cmd.config.commandCategory?.toLowerCase() || "misc";
    const icon = icons[cat] || icons.default[Math.floor(Math.random() * icons.default.length)];
    msg += `${icon} ${start + index + 1}. 『${cmdName}』\n📌 ${cmd.config.description}\n\n`;
  });

  msg += `━━━━━━━━━━━━━━\n📜 عدد الأوامر: ${allCommands.length}\n👨‍💻 المطور: Yogi YT 🇪🇬\n✨ استخدم: اوامر [رقم الصفحة] للتنقل`;

  const { autoUnsend, delayUnsend } = global.configModule[module.exports.config.name];
  return api.sendMessage(msg, threadID, async (error, info) => {
    if (autoUnsend) {
      await new Promise(resolve => setTimeout(resolve, delayUnsend * 1000));
      return api.unsendMessage(info.messageID);
    }
  });
};
