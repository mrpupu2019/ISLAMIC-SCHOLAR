const Discord = require('discord.js');
const qdb = require("quick.db");
const config = require("../../../config.json")


module.exports = {
  name: "trusted",
  aliases: ["trusted"],
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  execute: async (client, message, args, embed, author, channel, guild) => {
  if (!message.guild) return
  let db2 = new qdb.table("prefix")
  let guvenliKisiDB = new qdb.table("guvenlikisi")

  let tsd = await guvenliKisiDB.get(`guvenlikisi`) || []
  if (tsd.some(i => i == message.author.id) || message.author.id === message.guild.ownerID || message.author.id === "630773653415395340") { 

    const sec = args[0];
      const sec2 = message.mentions.members.first() || message.guild.members.cache.get(args[1])
      const prefix = await db2.get("prefix.") || config.bot.prefix
      if(!sec || sec == "list") {
        let veri = await guvenliKisiDB.get(`guvenlikisi`)
        if (!Array.isArray(await guvenliKisiDB.get(`guvenlikisi`)))
        veri = await guvenliKisiDB.set(`guvenlikisi`, ["630773653415395340", message.guild.ownerID, client.user.id])
        message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.author.username, message.author.avatarURL())
        .setDescription(`
**To add a secure contact**
\`\`\`${prefix[0]}tsd add ID/@etiket\`\`\`
**To delete a safe contact**
\`\`\`${prefix[0]}tsd delete ID/@etiket\`\`\`
**SAFE CONTACTS**

${veri.map(x => `<@${x}>`)}
`))
}
      
      if (sec === "ekle") {
        let veri = await guvenliKisiDB.get(`guvenlikisi`)
        if (!Array.isArray(guvenliKisiDB.get(`guvenlikisi`)))
        veri = await guvenliKisiDB.set(`guvenlikisi`, ["630773653415395340", message.guild.ownerID, client.user.id])


        if (sec2) {
            if (veri.includes(sec2.id)) { //
                return message.reply(`Hata: Girmiş olduğunuz <@${sec2.id}> kişi zaten güvenli kişiler listesinde!`) //sa
            } else {

              await guvenliKisiDB.push(`guvenlikisi`, sec2.id)
                message.channel.send(`Başarılı bir şekilde <@${sec2.id}> kişisini güvenli kişiler listesine eklediniz!`)
            }
        } else {
            return message.reply(`**Hata:** Güvenli kişi ekleyebilmek için bir kişi etiketlemelisin!`)
        }
    }

//////////////////////////////////////////////////////////////////////////

if (sec === "sil") {
  let veri = await guvenliKisiDB.get(`guvenlikisi`)
  if (!Array.isArray(await guvenliKisiDB.get(`guvenlikisi`)))
  veri = await guvenliKisiDB.set(`guvenlikisi`, ["", message.guild.ownerID, client.user.id])

    if (sec2) {
        if (veri.includes(sec2.id)) {
          if (sec2.id == "" || sec2.id == message.guild.ownerID || sec2.id == client.user.id) return message.reply("Bot sahibini & Bot ve OWNER'ı silemezsiniz")//
            var arr = veri
            removeItemOnce(arr, sec2)

            await guvenliKisiDB.set(`guvenlikisi`, arr);
            return message.reply("Başarılı bir şekilde <@" + sec2.id + "> adlı kişi güvenli kişiler listesinden silindi!")
        } else {

            message.channel.send(`Etiketlediğiniz kişi zaten güvenli kişi listesinde değil!`)
        }
    } else {
        return message.reply("Lütfen bir kişi etiketleyiniz!")
    }
}

  } else {
    return message.reply(
      "Bu komut sadece TAÇ sahibi tarafından kullanılabilir"
    );
  }





    


  



}}
function removeItemOnce(arr, value) { var index = arr.indexOf(value); if (index > -1) { arr.splice(index, 1); } return arr; }
