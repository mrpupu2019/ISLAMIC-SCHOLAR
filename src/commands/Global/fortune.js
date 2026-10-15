const Discord = require('discord.js');
const data = require('quick.db');

module.exports = {
    name: "fortune",
    aliases: ["fortune"],
    execute: async (client, message, args, embed, author, channel, guild) => {
if(await data.fetch(`slm.${message.author.id}.${message.guild.id}.fortune`)) return message.channel.send(new Discord.MessageEmbed().setColor('#00001').setDescription(`**You can't fast under 10 seconds!**`));
var gifler = ['```You will never marry in your life, you will oppose marriage.```', '```Look, I see it, and I see it very well, thank God for showing me these. Eating carrots is very good for the eyes.```', '```There is someone around you, he will be around you, he will come and ask you from your father until three oclock, you will be very happy, you will have three children.```', '```Daisy fortunes always have only one result; if you look at your hand and you will see that all you have left is a handle.```', '```You will soon receive good news from a place you expect.```', '```Whether I say blonde or brunette, she looks like a brown hair, its best to say no.```'];
let resimler = gifler[Math.floor(Math.random() * gifler.length)];

message.channel.send(new Discord.MessageEmbed().setTitle(`${message.author.username} Let's look at your bet 🤓`)
.setDescription(resimler).setColor('#cd0e63'));


data.set(`slm.${message.author.id}.${message.guild.id}.fortune`, '');
setTimeout(() => {
data.delete(`slm.${message.author.id}.${message.guild.id}.fortune`)
}, 10000);

}
}