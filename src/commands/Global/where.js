module.exports = {
    name: "where",
    aliases: ["ss", "n"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        let user = message.mentions.members.first() || guild.members.cache.get(args[0])
        if (!user) return channel.error(message, "Tag a valid user!")
        let sonuc; if (!user.voice.channelID) sonuc = `**${user}** user is not on any audio channel.`; if (user.voice.channelID) sonuc = `${user} user \`${user.voice.channel.name}\` in the sound room.`
        channel.send(embed.setDescription(sonuc))
    }
}