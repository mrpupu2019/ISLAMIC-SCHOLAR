const Discord = require("discord.js");
const db = require("quick.db");
const config = require("../../../config.json")
const moment = require("moment");
moment.locale("en-au");

module.exports = {
    name: "setname",
    aliases: ["ke", "kboy", "kman"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        const member = message.mentions.users.first() || guild.members.cache.get(args[0]);
        const name = args[1]
        
        
        if (!message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authority to use the command"));
        if (!member) return channel.send(embed.setDescription("You must specify a valid user!"))
        if (!name) return channel.send(embed.setDescription("You must specify a valid name!"))
        if (config.registration.purchase) {
            if (!member.username.includes(config.registration.GuilDTag) && !member.roles.cache.has(config.roles.viprole && config.roles.boosterrole && config.roles.musiciansrole && config.roles.designerrole && config.roles.team)) {
                return channel.send(embed.setDescription(`We are buying with tags! (${config.registration.TagSymbol})`))
            }
        }
        await guild.members.cache.get(member.id).setNickname(`${config.registration.TagSymbol} ${name} `);
        db.add(`male_${author.id}`, 1)
        db.add(`total_${author.id}`, 1)
              const names = db.get(`names_${member.id}`)
        db.push(`names_${member.id}`, ` \`${config.registration.TagSymbol} ${name} \` (<@&${config.registration.oneman}>)`);
        db.push(`kke_${member.id}`, `${author} \`${moment(Date.now()).format("DD | MM | YYYY | hh:mm:ss")}\` (<@&${config.registration.oneman}>)`)
        await guild.members.cache.get(member.id).roles.add(config.registration.man);
        await guild.members.cache.get(member.id).roles.remove(config.registration.unregistered)
        if (!names) {
            channel.send(embed.setDescription(`User's name \`${name} \` changed to and <@&${config.registration.oneman}> The role has been registered!`))
        } else {
            channel.send(embed.setDescription(`The user successfully <@&${config.registration.oneman}> registered as!\n\n User's total " ${names.length} " name record displayed.\n${names.map((data) => `${data}`).join("\n")}`))
        }

        client.channels.cache.get(config.channels.chat).send(`${member} registered to the server. Welcome to the ISLAMIC SERVER!`);
    }
}