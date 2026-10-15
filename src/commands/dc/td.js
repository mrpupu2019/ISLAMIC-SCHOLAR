const disbut = require ('discord-buttons')
const Discord = require ('discord.js')
module.exports = {
    name: "td",
    aliases: ["truth or Dare"],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, _embed, author, channel, guild) => { 
    const buton = new disbut.MessageButton()
    .setEmoji("☺")
    .setStyle("green")
    .setLabel("Truth")
    .setID("button_dc_d")
    const buton2 = new disbut.MessageButton()
    .setEmoji("😬")
    .setStyle("green")
    .setID("button_dc_c")
    .setLabel("Dare")
    const embed = new Discord.MessageEmbed()
    .setTitle('Truth or Dare')
    .setDescription('If You Want Truth And Dare Quests Click The Buttons Below!')
    .setColor('GREEN')
    .setFooter(client.user.username ,client.user.avatarURL())
    .setTimestamp()
    const buttonRow = new disbut.MessageActionRow()
    .addComponent(buton)
    .addComponent(buton2)
    message.channel.send({embed : embed , component : buttonRow})
}
}