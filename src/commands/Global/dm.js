const Discord = require('discord.js');
module.exports = {
    name: "dm",
  enabled: true,
  guildOnly: true,
    aliases:  ['dm'],
    execute: async (client, message, args, _embed, author, channel, guild) => {

    if ([client.config.bot.owner, "770552876937248768"].includes(message.author.id)) {
    let dmkisi = message.mentions.users.first();
    if (!dmkisi) return message.channel.send(':x: **You Must Choose The Person You Will DM**');
    let dm = args.slice(1).join(' ');
    if (!dm) return message.channel.send(':x: **You Forgot What Text Will Send The User DM**');
    message.delete();
    const dmat = new Discord.MessageEmbed()
    
    dmkisi.send(`${dm}`).catch(() => message.channel.send(':x: **That user does not accept DMs**'));
    const dmtamam = new Discord.MessageEmbed()
    .setColor('RANDOM')
    .setTimestamp()
    .setTitle('💌 Your Message Was Sent To The User Dm :white_check_mark:')
    .setFooter('ISLAMIC SERVER')
    message.channel.send(dmtamam);
    } else {
        message.channel.send(':x: **Only My Owner Can Use This dm Command!**');
    }
}}