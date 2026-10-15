const config = require("../../../config.json");
const db = require("quick.db");

module.exports = {
  name: "booster",
  aliases: ["booster"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (!message.member.roles.cache.has(config.roles.boosterrole)) return channel.error(message, "You need to be a valid booster to use the command.")
    let name = args.slice(0).join(' ');
    if (!name) return channel.error(message, `Please enter a valid username!`)
    if (name.length > 32) return channel.error(message, `**32** Please specify a name that does not exceed three characters!`)
    guild.members.cache.get(author.id).setNickname(name).then(x => channel.send(embed.setDescription(`User name **${name}** changed to !`), client.tick(message)), db.push(`names_`, (`${name} (Booster)`))).catch(err => console.log(err), client.ytick(message))
  }
}