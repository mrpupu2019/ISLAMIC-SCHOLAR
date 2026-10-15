const Discord = require("discord.js");
const db = require('quick.db');
const ayar = require('../../../config.json')
module.exports = {
    name: "apply-ban",
    aliases: ["apply-ban","bşvr-ban","başvuruban"],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, embed, author, channel, guild) => { 

    if(!message.member.roles.cache.has(ayar.ytv.adminrol)) return message.channel.send('no authority');
	
	if(args[0]=='banla'){
		
		const banlanacak = message.mentions.members.first()
	if (!banlanacak) return message.channel.send("Can you specify the user to be banned?").then(a => a.delete({ timeout: 5000 }));
	
		db.set(`ban.${banlanacak.id}`, true)
		message.channel.send(new Discord.MessageEmbed().setDescription(`${banlanacak} The person named has been banned from the application system.`));
	}
	
	if(args[0]=='remove'){
		
		const banlanacak = message.mentions.members.first()
	if (!banlanacak) return message.channel.send("Can you specify the user to be unbanned?").then(a => a.delete({ timeout: 5000 }));
	
		db.delete(`ban.${banlanacak.id}`)
		message.channel.send(new Discord.MessageEmbed().setDescription(`${banlanacak} The person named has been banned from the application system.`).setColor('GREEN'));
	}
	
    if(!args[0]) return message.reply('Please specify an Argument `ban/remove`');
	
	
	
	
}}