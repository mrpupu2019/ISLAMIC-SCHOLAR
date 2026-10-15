module.exports = {
    name: "delete",
    aliases: ["temizle", "sil"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (!message.member.hasPermission("MANAGE_MESSAGES")) return channel.error(message, "You must have valid authorization to use the command.")
        if (!args[0]) return channel.error(message, "Specify a valid number.")
        if (isNaN(args[0])) return channel.error(message, "Specify a valid number!")
        channel.bulkDelete(args[0]).then(() => {
            channel.send(`${args[0]} Message Deleted! 🗑`)
        })
    }
}