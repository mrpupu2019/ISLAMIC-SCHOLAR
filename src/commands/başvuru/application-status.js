const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../../../config.json')
module.exports = {
    name: "application-status",
    aliases: ["Başvuru-durum","bşvr-durum","başvurudurum"],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, embed, author, channel, guild) => { 
    message.delete()
	if(!message.member.roles.cache.has(ayar.ytv.kurucu)) return message.channel.send('no, my gosh, how long have you been a guru?');
	
	
	if(args[0] == 'close'){
		db.set(`basvurbilgi`,true);
		message.channel.send(`Application System Closed Successfully`)
	}
	if(args[0] == 'hungry'){
		db.delete(`basvurbilgi`);
		message.channel.send(`Application System Opened Successfully`)
	}
	
    }}