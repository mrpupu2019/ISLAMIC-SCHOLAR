module.exports = {
    name: "lock",
    aliases: [],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (!message.member.permissions.has("MANAGE_MESSAGES")) return channel.error(message, "You must have valid authorization to use the command.")
        const content = args[0];

        if (!content) return channel.error(message, "Specify valid data! `.lock on/off`")

        if (content === "off") {
            let every = guild.roles.cache.find(r => r.name === '@everyone');
            channel.createOverwrite(every, {
                'SEND_MESSAGES': null,

            })
            return channel.send(embed.setColor("GREEN").setDescription("🔓 Channel Unlocked!"))
        }

        if (content === "on") {
            let every = guild.roles.cache.find(r => r.name === "@everyone");
            channel.createOverwrite(every, {
                SEND_MESSAGES: false
            });
            return channel.send(embed.setColor("RED").setDescription("🔒 Channel locked!"))
        }
    }

}