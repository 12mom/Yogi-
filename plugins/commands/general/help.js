async function onCall({ message, args, getLang, userPermissions, prefix, data }) {
    const { commandsConfig } = global.plugins;
    const commandName = args[0]?.toLowerCase();
    const page = parseInt(args[1]) || 1;
    const perPage = 10;
    const language = data?.thread?.data?.language || global.config.LANGUAGE || 'ar_SY';

    if (!commandName) {
        let commands = {};
        for (const [key, value] of commandsConfig.entries()) {
            if (value.isHidden) continue;
            if (value.isAbsolute && !global.config?.ABSOLUTES.includes(message.senderID)) continue;
            if (!value.permissions?.some(p => userPermissions.includes(p))) continue;
            if (!commands[value.category]) commands[value.category] = [];
            const localizedName = value._name?.[language] || key;
            commands[value.category].push({ name: localizedName, category: value.category });
        }

        const emojiMap = {
            "admin": "🛠️",
            "fun": "🎮",
            "tools": "🧰",
            "media": "🎬",
            "system": "⚙️",
            "default": "📦"
        };

        const flatList = Object.entries(commands).flatMap(([category, cmds]) =>
            cmds.map(cmd => {
                const emoji = emojiMap[category.toLowerCase()] || emojiMap.default;
                return `${emoji} ${cmd.name}\nالمطور: Yogi`;
            })
        );

        const totalPages = Math.ceil(flatList.length / perPage);
        const currentPage = Math.min(Math.max(page, 1), totalPages);
        const paginated = flatList.slice((currentPage - 1) * perPage, currentPage * perPage);

        const response = `🧠 Yogi Bot\n\n${paginated.join('\n\n')}\n\n📄 صفحة ${currentPage} من ${totalPages}\n🧾 المجموع: ${flatList.length} أمر\n📌 استخدم ${prefix}الاوامر [رقم الصفحة] للتنقل بين الصفحات.`;

        return message.reply(response);
    }

    // باقي الكود لعرض تفاصيل أمر معين كما هو
}
