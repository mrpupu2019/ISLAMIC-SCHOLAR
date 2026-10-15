const Discord = require('discord.js');
const qdb = require("quick.db");
const config = require("../../../config.json")


module.exports = {
  name: "swear",
  aliases: ["swear"],
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  execute: async (client, message, args, embed, author, channel, guild) => {
  if (!message.guild) return
  let db = new qdb.table("sunucuayar");
  let db2 = new qdb.table("prefix");
  let guvenliKisiDB = new qdb.table("guvenlikisi");
  
  let gkv = await guvenliKisiDB.get(`guvenlikisi`) || []
  if (gkv.some(i => i == message.author.id) || message.author.id === message.guild.ownerID) {
    const sec = args[0]
    const emoji = client.emojis.cache.find(x => x.name === "owsla_tik")
    const prefix = await db2.get("prefix.") || config.bot.prefix
    if (!sec) {
      return message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setFooter(config.bot.footer)
        .setTimestamp()
        .addField(`What is Cursing Protection?`,
          `*It is a system that is used to check whether members are swearing in the chat channel on the server.*
*To use this system* \`${prefix[0]}curse on/off\` *You should run it as*`)
      )
    }

    if (sec == "on") {
      if (await db.get(`sunucuayar.kufur_koruma`)) {
        return message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setDescription(`
**Cursing barrier system,,**
**This feature is already on if you want to turn it off** \`${prefix[0]}turn off swearing\` **you can write**`))
      }
      await db.set(`sunucuayar.kufur_koruma`, "Active")
      return message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setDescription(`
**Cursing barrier system,**
 **The system is now successfully activated. \`${message.guild.name}\` no swearing on the server**`))
    }
    if (sec == "off") {
      if (!await db.get(`sunucuayar.kufur_koruma`)) {
        return message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setDescription(`
**Cursing barrier system,**
**If you want to turn this feature off already** \`${prefix[0]}open a curse\` **you can write**`))
      }
      await db.delete(`sunucuayar.kufur_koruma`)
      return message.channel.send(new Discord.MessageEmbed().setColor('RANDOM').setDescription(`
**Cursing barrier system,**
**The system has now been successfully deactivated \`${message.guild.name}\` can be cursed on the server**`))
    }
  } else {
    return message.reply(
      "This command can only be used by the CROWN owner"
    );
  }
} }