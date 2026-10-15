const Discord = require('discord.js');
  const db = require("quick.db")
  const disbut = require("discord-buttons");

  module.exports = {
    name: "ticket",
    aliases: [],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, embed, author, channel, guild) => { 
    if(!message.member.hasPermission("ADMINISTRATOR")) return message.reply("de sektur shit you don't have authority!!!!!")

const buton = new disbut.MessageButton()
.setStyle("green")
.setLabel("Create Ticket")
.setEmoji("✅")
.setID("ticket")

message.channel.send("📬 **Click the Button to Create a Ticket**")
message.channel.send("https://cdn.discordapp.com/attachments/900005796304269342/1084663538682974238/ticket.png", buton)
  }
  }