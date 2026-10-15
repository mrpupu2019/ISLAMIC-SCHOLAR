const Discord = require("discord.js")
const config = require("../../../config.json")
const qdb = require('quick.db');
const ms = require("ms");
const moment = require("moment")
module.exports = {
  name: "sound-draw",
  aliases: ["ses-kanal-çekiliş", "ses-çekiliş", "çekiliş"],
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  execute: async (client, message, args, embed, author, channel, guild) => {
  if (!message.guild) return

  let db = new qdb.table("sunucuayar");
  let prefixDB = new qdb.table("prefix");
  
  let prefix = await prefixDB.get(`prefix`) || client.ayarlar.prefix
  let tag = await db.get(`sunucuayar.sunucu_tag`) || config.registration.GuilDTag
  let booster = await db.get(`sunucuayar.booster_rol`) || config.roles.boosterrole
  let guvenliKisiDB = new qdb.table("guvenlikisi")
  let gkv = await guvenliKisiDB.get(`guvenlikisi`) || []
  if (gkv.some(i => i == message.author.id) || message.author.id === message.guild.ownerID) {


    const sec = args[0]
    if (sec == "yardım") return message.channel.send(new Discord.MessageEmbed().setColor("RANDOM").setAuthor(client.user.username, client.user.avatarURL({
      dynamic: true
    })).setDescription(`
─────────────────────
**Not:** \`The raffle system is valid for voice channels for now, we will also make a raffle system for all server members in the future!\`
─────────────────────
**How the Lottery System Works ?**
**1) Giveaway covering all Audio Channels**
This system usually chooses a random member who is active on audio channels at events.

**Information:** \`Executive\` Users with permission cannot benefit from the lottery system.

**Proper use:** \`${prefix[0]}draw all\`
─────────────────────
**2) The lottery covering the channels where the lottery manager is located.**
this system \`Sweepstakes Manager\`'There is a lottery among all members on the voice channel where

**Information:** \`If there is a server tag (symbol) in the name of the members in the room, their names are written twice by the system in the draw.\`

**Proper use:** \`${prefix[0]}i'm in the draw\`

`))




    if (sec === "hepsi" || sec === "tümkanallar") {

      let Kisukea = message.guild.members.cache.filter(member => {
        return member.voice.channel && member.presence.status !== "offline" && !member.user.bot && message.author.id && !member.permissions.has("ADMINISTRATOR")
      }).map(member => (member.user.id));
      message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(`
**The Raffle Started Successfully**
─────────────────────
**Starter of the Draw:** ${message.author}
**Time to Happen:** \`30 Second\`
**The number of participants:** \`${Kisukea.length} kişi\``)).then(async mesaj => {
  shuffle(Kisukea)
        let random = Kisukea[Math.floor(Math.random() * Kisukea.length)]
        setTimeout(async () => {
          await mesaj.edit(new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(`
**The Lottery Has Been Successfully Concluded**
─────────────────────
**Starter of the Draw:** ${message.author}
**Actual Time:** \`30 Saniye\`
**The number of participants:** \`${Kisukea.length} kişi\`
**Winning User:** <@${random}> (\`${random}\`)`))
        }, 1000 * 30)
      })
    }

    if (sec === "bulundugum" || sec === "bulunduğum") {

      if (!message.member.voice.channel) return message.reply(`You must be on an audio channel.`)

      let Kisukea = message.member.voice.channel.members.filter(member => {
        return member.voice.channel && member.presence.status !== "offline" && !member.user.bot && message.author.id && !member.permissions.has("ADMINISTRATOR")
      }).map(member => (member.user.id));
      message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(message.author.tag, message.author.avatarURL())
        .setDescription(`
**The Raffle Started Successfully**
─────────────────────
**Starter of the Draw:** ${message.author}
**Time to Happen:** \`${args[1]||"5m".replace("s", " Second").replace("m", " Minute").replace("h", " Hour").replace("d", " Day")}\`
**The number of participants:** \`${Kisukea.length} person\``)).then(async mesaj => {

        shuffle(Kisukea)
        let random = Kisukea[Math.floor(Math.random() * Kisukea.length)]
        setTimeout(async () => {
          await mesaj.edit(new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(message.author.tag, message.author.avatarURL())
            .setDescription(`
**The Lottery Has Been Successfully Concluded**
─────────────────────
**Starter of the Draw:** ${message.author}
**Actual Time:** \`${args[1]||"5m".replace("s", " Second").replace("m", " Minute").replace("h", " Hour").replace("d", " Day")}\`
**The number of participants:** \`${Kisukea.length} person\`
**Winning User:** <@${random}> (\`${random}\`)`))
        }, ms(args[1] || "5m"))
      })


    }


    if (!args[0]) return message.channel.send(`You didn't specify the time!`);
    if (
      !args[0].endsWith("d") &&
      !args[0].endsWith("h") &&
      !args[0].endsWith("m")
    )
      return message.channel.send(
        `You did not use the correct formatting for the time! (\`m/h/d\`)`
      );
    if (isNaN(args[0][0])) return message.channel.send(`The value you entered must be a number!`);
    let channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        `Please specify a channel!`
      );
    let prize = args.slice(2).join(" ");
    if (!prize) return message.channel.send(`Please specify a prize name!`);
    message.channel.send(`${channel} The raffle has started on the channel, please check!`);
    let Embed = new Discord.MessageEmbed()
      .setTitle(`Draw Has Started`)
      .setDescription(`
**To participate in the draw** :tada: **click on the response** (in your name \`${tag}\` The names of the members who have the tag are written 2 times!)
**Starter of the Draw:** \`${message.author.username}\`
**Time to Happen:** \`${args[0].replace("s", " Second").replace("m", " Minute").replace("h", " Hour").replace("d", " Day")}\`
**Award to be Given:** \`${prize.replace(message.mentions.roles.first(), "")}\`
      `)
      .setFooter(client.ayarlar.footer)
      .setTimestamp()
      .setColor(`BLUE`);
    let m = await channel.send(Embed);






	const sayı = args[0].replace("m", "").replace("h", "").replace("d", "")
const süre = args[0].replace(sayı, "")

const zaman = moment(new Date()).add(sayı, süre).valueOf()
m.react("🎉");
let arr = []
let interval = setInterval(async function () {

const date = zaman - new Date().getTime()
const dakika = Math.floor(date / 60000);
const saniye = Math.floor(date / 1000);
const saat = Math.floor(date / 3600000);
 if (saniye === 0 || saniye < 0) {
   




  setTimeout(() => {
    if (m.reactions.cache.get("🎉").count <= 2) {
      message.channel.send(`The number of participants: \`${m.reactions.cache.get("🎉").count} person\``);
      return message.channel.send(
        `There were not enough participants for the draw to be concluded.`
      );
    }

    m.reactions.cache.get("🎉").users.cache.filter((u) => !u.bot && message.author.id !== u.id).map(x => {
      if (x.username.includes(tag) || message.guild.members.cache.get(x.id).roles.cache.get(booster)) {
        arr.push(x.id)
      }
      arr.push(x.id)
    })
    
    shuffle(arr)
    shuffle(arr)
    let random = arr[Math.floor(Math.random() * arr.length)]
    
    let Embed = new Discord.MessageEmbed()
    .setTitle(`The Draw Has Been Concluded`)
    .setDescription(`
**Starter of the Draw:** \`${message.author.username}\`
**Time to Happen:** \`${args[0].replace("s", " Second").replace("m", " Minute").replace("h", " Hour").replace("d", " Day")}\`
**Award to be Given:** \`${prize.replace(message.mentions.roles.first(), "")}\`
**Winning User:** <@${random}> (\`${random}\`)
`)
    .setFooter(client.ayarlar.footer)
    .setTimestamp()
    .setColor(`BLUE`);

    m.edit(Embed)
    channel.send(`**${prize.replace(message.mentions.roles.first(), "")}** for the winner of the gift. <@${random}>`);
  }, 1000);

  return clearInterval(interval)}

m.edit(new Discord.MessageEmbed()
.setColor("RANDOM")
.setTitle("Çekiliş ")
.setDescription(
`
**To participate in the draw** :tada: **click on the response** (in your name \`${tag}\` The names of the members who have the tag are written 2 times!)
**Starter of the Draw:** \`${message.author.username}\`
**Time to Happen:** \`${saat} hour ${dakika+1} minutes left\`
**Award to be Given:** \`${prize.replace(message.mentions.roles.first(), "")}\`
      `)
      .setFooter(client.ayarlar.footer)
      .setTimestamp()
      .setColor(`BLUE`));
}, 5000)
  } else {
    return message.reply("This command can only be used by the CROWN owner")
  }



}




}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;
  while (0 !== currentIndex) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}