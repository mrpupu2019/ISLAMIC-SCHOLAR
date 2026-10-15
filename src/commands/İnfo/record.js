const Discord = require("discord.js");
const config = require("../../../config.json")
const db = require("quick.db");

module.exports = {
  name: "record",
  aliases: [],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (!message.member.roles.cache.has(config.penals.ban.staff) && !message.member.hasPermission("BAN_MEMBERS")) return channel.error(message, "You must have valid authorization to use the command.")
    let member = message.mentions.members.first() || guild.members.cache.get(args[0]);
    const points = db.fetch(`points_${member.id}`) || 0
    if (!member) return channel.error(message, "Tag a valid user!")
    let penals = db.get(`sicil_${member.user.id}`);
    if (!penals) return channel.send(`${member} The user has no track record!`)
    channel.send(embed
      .setColor("RANDOM")
      .setTitle(`User's registry data:`)
      .setFooter("ISLAMIC SERVER")
      .setDescription(penals.map((data) => `${data}`).join("\n"))
      .addField("Total penalty points:", points))
  }
}