'use strict';

module.exports = (bus, { client }, name) => {
  // Simulates a member joining (runs the welcome flow). Owner-only now; it was open to everyone before.
  bus.on('message', name, async (message) => {
    if (message.content !== '!fakeparticipate' || !message.guild || !client.isOwner(message.author.id)) return;
    client.emit('guildMemberAdd', message.member || await message.guild.members.fetch(message.author.id));
  });
};
