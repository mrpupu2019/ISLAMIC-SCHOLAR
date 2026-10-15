const Discord = require("discord.js")
const config = require("../../../config.json")
const destekKanal = config.channels.liveSupport
module.exports = {
    name: "livesupport",
    aliases: [],
    enabled: true,
    guildOnly: false,
    execute: async (client, message, args, _embed, author, channel, guild) => { 
  
  let isEnabled
  let mesaj = args.slice(0).join(" ")
  if(!mesaj) return message.reply("**Why You Need 🟢 Live Support Write also that!\nExample: `#livesupport I want to tell something or complaint.`**")
  
  message.reply("✅ **You Have Submitted Your 🟢 Live Support Request To Higher Mod!\nThey will contact you as soon as possible!**")
  let chan = message.channel
  
  const embed = new Discord.MessageEmbed()
    .setTitle(`🛠 Support Request Information 🛠`)
    .setColor("BLUE") 
    .setDescription(`**🚉 Server**\n● | ${message.guild.name}\n● | (${message.guild.id}) \n \n**📮 Channel**\n● | ${message.channel.name}\n● | (${message.channel.id})\n \n**📝 Support Need**\n● | ${message.author.tag}\n● | (${message.author.id})\n \n**📩 Incoming Message**\n● | ${mesaj}`)
    .setFooter("🔧 Live Support System ")
    .setTimestamp()
  const supportChannel = client.channels.cache.get(destekKanal)
  if (!supportChannel) return message.reply("**Live support is not configured.**")
  supportChannel.send(embed)
  const collector = client.channels.cache.get(destekKanal).createMessageCollector(message => message.content.startsWith(""), {time: 86400000})
  
  client.channels.cache.get(destekKanal).send("🔰 **Support Request Received** 🔰\n \n**✅ If you want to accept `join`\n❌ If You Want To Reject `close` You can write!**")
  collector.on("collect", m => {
    if (m.content == "close") collector.stop("aborted")
    if (m.content == "join") collector.stop("success")
  });
  collector.on("end", (collected, reason) => {
    if (reason === "time")
      return message.reply("**🔌 Connection Timed Out**")
    if (reason === "aborted") {
      message.reply("**Live Support Request 🛑 Rejected 🛑**");
    client.channels.cache.get(destekKanal).send("**📡 Connection Successfully Rejected ✅**")
    }
    if (reason === "success") {
      client.channels.cache.get(destekKanal).send("**📡 Connected to Server Opening Support Request!\n❌ to turn it off `close` You can write!**")
      chan.send(`**${message.author}, Your 🟢 Live Support Request Has Been Accepted\n now type your message and send it here you are now Connected Live Support or If You Want To Close Your Support Request type\`close\`**`)
      isEnabled = true
      const relay = message => {
        function contact() {
          if (isEnabled === false) return client.removeListener("message", relay)
          if (message.author.id === client.user.id) return
          if (message.content.startsWith("close")) {
            message.channel.send("**❌ live support Closed**")
            if (message.channel.id === chan.id)
              client.channels.cache.get(destekKanal).send("**❌ live support Closed From Other side!**")
            if (message.channel.id === destekKanal)
              chan.send("**🟢 live support Closed From Other Side! ❌**")
            client.removeListener("message", relay)
            return (isEnabled = false)
          }
          if (message.channel.id === chan.id)
            client.channels.cache.get(destekKanal).send(`**${message.author.tag}**: ${message.content}`)
          if (message.channel.id === destekKanal) 
            chan.send(`**${message.author.tag}**: ${message.content}`)
        }
        contact(client);
      }
      client.on("message", relay)
      setTimeout(() => { isEnabled = false; client.removeListener("message", relay) }, 86400000).unref()
    }
  })
}
}