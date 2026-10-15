'use strict';
const buttons = require('discord-buttons');
const qdb = require('quick.db');

const CATEGORY = '✧═══❃ LIVE SUPPORT ❃═══✧';
const TICKET_IDS = new Set(['ticket', 'Kilit', 'Evet', 'GeriYükle', 'DesteğiKapat', 'Hayır']);
const btn = (style, label, id, emoji) => {
  const b = new buttons.MessageButton().setStyle(style).setLabel(label).setID(id);
  return emoji ? b.setEmoji(emoji) : b;
};

module.exports = (bus, { config }, name) => {
  const supportRole = config.roles.ticketdestek;
  const yes = btn('green', 'Yes', 'Evet');
  const no = btn('red', 'No', 'Hayır');
  const reopen = btn('green', 'Reload', 'GeriYükle');
  const close = btn('red', 'Close Support', 'DesteğiKapat');
  const lock = btn('grey', 'Quarter', 'Kilit', '🔒');

  async function openTicket(button, member) {
    const existing = qdb.get(`destekkullanıcı_${member.id}`);
    if (existing) return button.reply.send(`> **Failed!** You already have an active support request. **Channel:** <#${existing}>`, true);
    const reply = await button.reply.think(true);
    const { guild } = button;
    const category = guild.channels.cache.find((c) => c.name === CATEGORY) || await guild.channels.create(CATEGORY, { type: 'category' });
    const channel = await guild.channels.create(`ticket-${member.user.username}`, { type: 'text', reason: `Destek ${member.user.tag}`, parent: category.id });
    qdb.set(`destekkanal_${channel.id}`, member.id);
    qdb.set(`destekkullanıcı_${member.id}`, channel.id);
    await channel.createOverwrite(guild.roles.everyone.id, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
    if (supportRole) await channel.createOverwrite(supportRole, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
    await channel.createOverwrite(member.id, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
    reply.edit(`> **Successful!** Your support request has been created. **Channel:** <#${channel.id}>`);
    return channel.send(`${member.user}, Welcome support team will take care of you. \n<@&${supportRole}>`, lock);
  }

  bus.on('clickButton', name, async (button) => {
    if (!TICKET_IDS.has(button.id)) return undefined;
    const member = button.guild.members.cache.get(button.clicker.user.id);
    if (button.id === 'ticket') return openTicket(button, member);

    const channel = button.guild.channels.cache.get(button.channel.id);
    const owner = button.guild.members.cache.get(qdb.get(`destekkanal_${channel.id}`));
    switch (button.id) {
      case 'Kilit':
        await button.message.edit('> **Attention!** Are you sure you want to close the ticket??', { buttons: [yes, no] });
        return button.reply.defer();
      case 'Evet':
        if (owner) await channel.createOverwrite(owner, { SEND_MESSAGES: false, VIEW_CHANNEL: false });
        await button.message.delete();
        await button.channel.send(`> **Closed!** ${member} The support request has been closed.`, { buttons: [reopen, close] });
        if (owner) await channel.setName(`Closed -${owner.user.username}`);
        return button.reply.defer();
      case 'GeriYükle':
        if (owner) {
          await channel.setName(`destek-${owner.user.username}`);
          await channel.createOverwrite(owner, { SEND_MESSAGES: true, VIEW_CHANNEL: true });
        }
        await button.channel.send(`> **Attention!** ${owner || ""} Support request reopened.`, { buttons: [lock] });
        await button.message.delete();
        return button.reply.defer();
      case 'DesteğiKapat':
        qdb.delete(`destekkanal_${channel.id}`);
        if (owner) qdb.delete(`destekkullanıcı_${owner.id}`);
        await button.channel.delete();
        return button.reply.defer().catch(() => {});
      case 'Hayır':
        await button.message.edit(`${owner || ""} Our support team will take care of you.\n @everyone - @here`, lock);
        return button.reply.defer();
      default:
        return undefined;
    }
  });

  bus.on('guildMemberRemove', name, (member) => {
    const channelId = qdb.get(`destekkullanıcı_${member.id}`);
    if (!channelId) return undefined;
    qdb.delete(`destekkanal_${channelId}`);
    qdb.delete(`destekkullanıcı_${member.id}`);
    const channel = member.guild.channels.cache.get(channelId);
    return channel && channel.delete();
  });

  bus.on('channelDelete', name, (channel) => {
    const userId = qdb.get(`destekkanal_${channel.id}`);
    if (!userId) return;
    qdb.delete(`destekkanal_${channel.id}`);
    qdb.delete(`destekkullanıcı_${userId}`);
  });
};
