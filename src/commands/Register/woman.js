const db = require("quick.db");
const config = require("../../../config.json");
const moment = require("moment");

module.exports = {
    name: "woman",
    aliases: ["female", "woman"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        var member = message.mentions.users.first() || guild.members.cache.get(args[0]);
        var name = args[1];
        var age = args[2];
        const names = db.get(`names_${member.id}`)
        if (!message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authority to use the command"));
        if (!member) return channel.send(embed.setDescription("You must specify a valid user!"))
        if (!name) return channel.send(embed.setDescription("You must specify a valid name!"))
        if (!age) return channel.send(embed.setDescription("You must specify a valid age!"))
        if (isNaN(age)) return channel.send(embed.setDescription("Let age be valid numbers!"))
        if (age < config.registration.minage) return channel.send(embed.setDescription("The age specified for the user is less than the minimum age!"))
        if (config.registration.purchase) {
            if (!member.username.includes(config.registration.GuilDTag) && !member.roles.cache.has(config.roles.viprole && config.roles.boosterrole && config.roles.musiciansrole && config.roles.designerrole && config.roles.team)) {
                return channel.send(embed.setDescription(`We are buying with tags! (${config.registration.TagSymbol})`))
            }
        }
        await guild.members.cache.get(member.id).setNickname(`${config.registration.TagSymbol} ${name} ${config.registration.symbol} ${age}`);
        db.push(`names_${member.id}`, ` \`${config.registration.TagSymbol} ${name} ${config.registration.symbol} ${age}\` (<@&${config.registration.onewoman}>)`);
        db.add(`woman_${author.id}`, 1)
        db.add(`total_${author.id}`, 1)
        db.push(`kke_${member.id}`, `${author} \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\` (<@&${config.registration.onewoman}>)`)
        await guild.members.cache.get(member.id).roles.add(config.registration.woman);
        await guild.members.cache.get(member.id).roles.remove(config.registration.unregistered)
        if (!names) {
            message.channel.send(embed.setDescription(`User's name ${name} ${config.registration.symbol} ${age} changed to and <@&${config.registration.onewoman}> The role has been registered!`))
        } else {
            channel.send(embed.setDescription(`The user successfully <@&${config.registration.onewoman}> registered as!\n\nUser's total " ${names.length} " name record displayed.\n${names.map((data) => `${data}`).join("\n")}`))
        }
        message.react(config.emojis.yes)
        client.channels.cache.get(config.channels.chat).send(`${member} registered to the server. Welcome to the ISLAMIC SERVER!`);
    }
}