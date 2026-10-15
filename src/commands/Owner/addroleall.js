const Discord = require('discord.js');

const qdb = require("quick.db");
module.exports = {
    name: 'addroleall',
    aliases: ["addroleall","toplurolver","hrolver"],
    execute: async (client, message, args, embed, author, channel, guild ) => {
  if (!message.guild) return;
  let guvenliKisiDB = new qdb.table("guvenlikisi");
  
  let gkv = await guvenliKisiDB.get(`guvenlikisi`) || []
  if (gkv.some(i => i == message.author.id) || message.author.id === message.guild.ownerID) {
    let role = message.mentions.roles.first()
    if (!role) return message.reply("Please tag a valid role")
    var rol = message.guild.roles.cache.get(role.id);
    if (!rol) return message.reply("Please tag a valid role")
    message.guild.members.fetch().then(async data => {
      let members = data.map(m => m.user.id);
      var mesaj = await message.channel.send(new Discord.MessageEmbed()
        .setColor("RANDOM")
        .setAuthor(`Wasley Casting`, client.user.avatarURL())
        .setDescription(`
─────────────────────
The process started successfully!
─────────────────────
**Role to be assigned:** <@&${rol.id}>
**Estimated Successful Transaction:** (\`${members.length}/${members.length}\`)
**Time to Happen:** (\`${Math.round((members.length) * (1.5) / (60))} Minute\`)

\`Do not delete this message to see the result!\`
─────────────────────
`)).then(m => m).catch(err => {
        console.log(err);
        console.log("There is an error in assigning roles to everyone line 30")
      });
      var indexDurumu = 0;
      setInterval(async function () {
        if (indexDurumu >= members.length) {
          mesaj.edit(
            new Discord.MessageEmbed()
            .setColor("RANDOM")
            .setAuthor(`ISLAMIC SERVER`, client.user.avatarURL())
            .setDescription(`

─────────────────────
Transaction completed successfully.
─────────────────────
**Number of members cast:** (\`${members.length}\`)
**Number of successful transactions:** (\`${indexDurumu}\`)
**Actual Time:** (\`${Math.round((members.length) * (1.5) / (60))} Minute\`)
─────────────────────
`)
            .setFooter(`Number of successful transactions: (${indexDurumu}/${members.length}) | Actual Time: (${Math.round((members.length) * (1.5) / (60))} Minute)`)
          )
          return clearInterval(this);
        }
        var id = members[indexDurumu];
        indexDurumu++;
        var guildMember = message.guild.members.cache.get(id);
        if (guildMember) await guildMember.roles.add(rol.id).catch(() => {});
      }, 1500)
    })
  } else {
    return message.reply(
      "This command can only be used by the CROWN owner"
    );
  }
}}