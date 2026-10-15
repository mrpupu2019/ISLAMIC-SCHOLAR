'use strict';
const { MessageEmbed } = require('discord.js');

module.exports = (bus, { client, config }, name) => {
  bus.on('userUpdate', name, (oldUser, newUser) => {
    if (newUser.username === oldUser.username) return;
    const tag = config.registration.GuilDTag;
    const guild = client.guilds.cache.get(config.Guild.GuildID);
    const member = guild && guild.members.cache.get(newUser.id);
    if (!member) return;
    const hadTag = oldUser.username.includes(tag);
    const hasTag = newUser.username.includes(tag);
    if (hadTag === hasTag) return;

    const tagged = guild.members.cache.filter((m) => m.user.username.includes(tag)).size;
    const embed = new MessageEmbed().setTimestamp().setColor('RANDOM').setFooter(`Total ${tagged} We Have Tagged Members`);
    const tagLog = client.channels.cache.get(config.logs.taglog);
    const ignore = () => {};
    if (hadTag) {
      member.roles.remove(config.roles.team).catch(ignore);
      if (tagLog) tagLog.send(embed.setDescription(`${newUser} from the name \`${tag}\` She left our family by taking it out!  \n──────────────────────────────────\nprevious username: \`${oldUser.tag}\` \n next username: \`${newUser.tag}\``));
    } else {
      member.roles.add(config.roles.team).catch(ignore);
      const chat = client.channels.cache.get(config.channels.chat);
      if (chat) chat.send(`${newUser} to your name \`${tag}\` He joined our family by getting a tag! Welcome to our family`);
      if (tagLog) tagLog.send(embed.setDescription(`${newUser} to your name \`${tag}\` He joined our family! Welcome to the club \n──────────────────────────────────\nprevious username: \`${oldUser.tag}\`\n next username: \`${newUser.tag}\``));
    }
  });
};
