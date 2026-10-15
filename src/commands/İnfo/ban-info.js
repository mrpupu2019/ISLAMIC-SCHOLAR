const config = require("../../../config.json")
module.exports = {
    name: "ban-info",
    aliases: ["bansor"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        if (!message.member.hasPermission("BAN_MEMBERS") && message.member.roles.cache.has(config.penals.ban.staff)) return channel.error(message, "You must have valid authorization to use the command.")

        let kullanici = args[0];

        if (!kullanici) return channel.error(message, "You must specify a valid user ID!")

        guild.fetchBans()

            .then(bans => {

                if (!bans.has(kullanici)) {

                    return channel.error(message, `The user you specified is not banned.`)

                }

            })

        guild.fetchBan(kullanici).then(({ user, reason }) => {

            channel.send(embed.setDescription(`${user.tag} reason for ban: **${reason}**`))



        })

    }
}