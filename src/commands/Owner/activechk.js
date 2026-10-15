const config = require("../../../config.json")
module.exports = {
  name: "activechk",
  aliases: ["activechk"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (message.member.hasPermission('ADMINISTRATOR')) {
      let matthe = args[0];

      let sesdedeğil = message.guild.members.cache.filter(x => x.roles.cache.has(config.registration.staff)).filter(y => !y.voice.channel && y.presence.status != "offline")
      message.channel.send(`
        Active but not voiced officials:
    ${sesdedeğil.map(s => `${s} \`${s.user.tag}\``).join('\n')}`)
    } else
      return message.channel.send(`In order to use this command, you must first be competent!`)
  }
}