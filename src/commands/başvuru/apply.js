const Discord = require("discord.js");
const disbut = require("discord-buttons");
const db = require('quick.db');
const ayar = require('../../../config.json')
module.exports = {
    name: "apply",
    aliases: ["Başvur","başvur","apply"],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, embed, author, channel, guild) => { 
    message.delete()
	const basvurdata = await db.get(`basvurbilgi`);
	if(basvurdata) return message.reply(`Applications are temporarily suspended.`);
	
	const bandata = await db.get(`ban.${message.author.id}`)
	if(bandata) return message.reply("You are banned from applications");
		
  let category = message.guild.channels.cache.get(ayar.ytv.basvurkategori);
            
  message.guild.channels.create(`${message.author.username}-apply`, {
    parent: category,
    permissionOverwrites: [
        {id: ayar.ytv.everyoneid, deny: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
		{id: ayar.ytv.adminrol, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]},
        {id: message.author.id, allow: [('VIEW_CHANNEL'), ('SEND_MESSAGES')]}]
    }).then( async baschannel => {

    
  const sorular = [
    '**Do You Know How to Record?** yes/no',
    '**How Many Hours a Day Are You Active?** 1/24 Hours',
    '**Are You Authorized On Another Server?** yes/no',
    '**How many years have you been on the Discord Platform?** years',
    '**What are you planning to support the server?** Invite / Voice And Chat Activation ',
    '**Why Do You Want to Become Authorized?** your answer'
  ]
  let sayac = 0
  
  const filter = m => m.author.id === message.author.id
  const collector = new Discord.MessageCollector(baschannel, filter, {
    max: sorular.length,
    time: 2000 * 60
  })
  baschannel.send(`Hello ${message.author}, so you want to be authorized on our server but first you need to answer some questions good luck\n:hourglass: Don't forget!!! You have exactly 2 minutes to answer all the questions, hurry up :) `);
  baschannel.send(sorular[sayac++])
  collector.on('collect', m => {
    if(sayac < sorular.length){
      m.channel.send(sorular[sayac++])
    }
  })

  collector.on('end', collected => {
    if(!collected.size) return baschannel.send('**Times up!**\nThis channel will be deleted after 5 seconds').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    baschannel.send('**Your application has been successfully submitted!**\nThis channel will be deleted after 5 seconds').then(
      setTimeout(function() {
        baschannel.delete();
         }, 5000));
    let sayac = 0
    
    const onybuton = new disbut.MessageButton()
    .setLabel('Approve')
    .setStyle('green')
    .setID('onay');
    const redbuton = new disbut.MessageButton()
    .setLabel('Saved')
    .setStyle('red')
    .setID('red');
    let row = new disbut.MessageActionRow()
    .addComponents(onybuton, redbuton);

    const log = new Discord.MessageEmbed()
    .setAuthor(message.author.username + ` (${message.author.id})`, message.author.avatarURL({dynamic: true}))
	.setTitle('New Application Arrived!')
	.setDescription('You can perform approval/rejection operations from the buttons below.')
    .setColor('BLUE')
    .addField('About the applicant',[
      `**Do You Know How to Register?: **\t\t${collected.map(m => m.content).slice(0,1)}`,
      `**How Many Hours a Day Are You Active?: **\t\t${collected.map(m => m.content).slice(1,2)}`,
      `**Are You Authorized On Another Server?: **\t\t${collected.map(m => m.content).slice(2,3)}`,
	    `**How many years have you been on the Discord Platform?: **\t\t${collected.map(m => m.content).slice(3,4)}`,
      `**What are you planning to support the server on?: **\t\t${collected.map(m => m.content).slice(4,5)}`,
      `**Why Do You Want to Become Competent?: **\t\t${collected.map(m => m.content).slice(5,6)}`
    ])
    .setTimestamp()
    .setFooter('', message.guild.iconURL());
    const logChannel = client.channels.cache.get(ayar.ytv.yetkililog);
    if (!logChannel) return;
    logChannel.send({
		buttons: [onybuton, redbuton],
	    embed: log}).then(async m => {
      db.set(`basvur.${m.id}`, message.author.id);
    })

  })
  
})
}}