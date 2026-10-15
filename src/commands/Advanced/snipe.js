const { MessageEmbed } = require("discord.js");
const Discord = require("discord.js");
const db = require("quick.db");
const moment = require("moment")
require('moment-duration-format');
const config = require("../../../config.json");

module.exports = {
    name: "snipe",
    aliases: ["snipe"],
    execute: async (client, message, args) => {
     if (!message.member.roles.cache.has(config.registration.staff) && !message.member.hasPermission("ADMINISTRATOR")) return   message.channel.send("You must have valid authority to use the command").then(x => x.delete({timeout: 10000}));

    let embed = new MessageEmbed().setColor("#40FC00").setFooter(config.bot.BotStatus);
    let data = db.get(`snipe.${message.guild.id}`);
    if(!data) return message.channel.send(embed.setDescription(`No Message Has Been Deleted Before On The Server.`)).catch(e => { });
    message.channel.send(embed.setDescription(`
    \`Posted By:\` <@${data.mesajyazan}>
    \`Message:\` (**${data.mesaj}**)
    \`Written Date:\` ${moment.duration(Date.now() - data.ytarihi).format("D [day], H [hour], m [minute], s [second]")} **Written First**
    \`Deletion Date:\` ${moment.duration(Date.now() - data.starihi).format("D [day], H [hour], m [minute], s [second]")} **Deleted Before**
    \`Channel:\` <#${data.kanal}>
    `)).then(x => x.delete({timeout: 10000}));
        
        }
    }