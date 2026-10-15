const {MessageEmbed} = require("discord.js"); // [package required: discord.js]
module.exports = {
    name: 'reboot',
  enabled: true,
  guildOnly: false,
    aliases: ["reset", "yenile", "yenşden-başlat"],
    execute: async (client, message, args, _embed, author, channel, guild) => {
  if(message.author.id !== client.config.bot.owner) return message.reply(`Only Bot Owner can use this command!`);
  // EMBED
  let embed = new MessageEmbed()
  .setColor("RANDOM")
  .setTitle("» The bot is restarting...")
  await message.channel.send(embed); // send the embed
  // unload all commands before shutting down
  
  console.log("The bot restarts...");

  // you can always leave out this code // (cmd part)
  require('quick.db').close(); // save pending data first

  // shut down the bot
  process.exit(1);
}}