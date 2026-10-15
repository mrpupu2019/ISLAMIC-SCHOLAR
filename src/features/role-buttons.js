'use strict';
const buttons = require('discord-buttons');
const db = require('quick.db');
const moment = require('moment');

const button = (label, id, style) => new buttons.MessageButton().setStyle(style).setLabel(label).setID(id);

const ROLE_TEXT = `Hello!
 
By becoming a Sweepstakes Participant **Nitro, Spotify, Netflix and similar raffles and winners** you can be.

from the buttons below **By becoming an Event Participant, we can enjoy our concerts, plays, and events.** you can benefit.

\`NOT:\` Registered or unregistered, all of you can see this channel. Definitely don't forget to take your roles as everyone will not be posted here on this server.
`;
const INFO_TEXT = '**Hello there!** \n\n By interacting with the buttons below **You can get information about your status on our server.** \n\n **1 -** `You check under which names you have previously registered on our server.` \n **2 -** `You check whether you have already registered on our server.` \n **3 -** `You check whether you have been penalized before on our server.` \n **4 -** `You control your roles on our server.` \n **5 -** `You control when you join our server.`';

async function toggleRole(btn, roleId, addedText, removedText) {
  const { member } = btn.clicker;
  await btn.reply.think(true);
  if (member.roles.cache.has(roleId)) {
    await member.roles.remove(roleId);
    return btn.reply.edit(removedText);
  }
  await member.roles.add(roleId);
  return btn.reply.edit(addedText);
}

async function info(btn, text) {
  await btn.reply.think(true);
  return btn.reply.edit(text);
}

module.exports = (bus, { client, config }, name) => {
  bus.on('message', name, (message) => {
    if (!client.isOwner(message.author.id)) return undefined;
    if (message.content === '!buton-rol') {
      return message.channel.send(ROLE_TEXT, { buttons: [button('🎁 Sweepstakes Participant', 'Giveaway', 'green'), button('🎉 Event Participant', 'Activity', 'green')] });
    }
    if (message.content === '!buton-bilgi') {
      return message.channel.send(INFO_TEXT, { buttons: ['I', 'II', 'III', 'IV', 'V'].map((l, i) => button(l, ['one', 'two', 'three', 'four', 'five'][i], 'gray')) });
    }
    return undefined;
  });

  bus.on('clickButton', name, (btn) => {
    const id = btn.clicker.id;
    switch (btn.id) {
      case 'Giveaway':
        return toggleRole(btn, config.buttons.giveaway, 'You have successfully landed the Sweepstakes Participant role!', 'The Sweepstakes Participant role has been successfully taken over!');
      case 'Activity':
        return toggleRole(btn, config.buttons.activity, 'You have successfully received the Event Participant role!', 'The Event Participant role has been successfully stripped!');
      case 'one': {
        const names = db.get(`names_${id}`);
        return info(btn, names ? `Names you have previously registered on our server:\n${names.map((d, n) => `**${n + 1}.** ${d}`).join('\n')}` : 'You have not registered on our server before.');
      }
      case 'two': {
        const kke = db.get(`kke_${id}`);
        return info(btn, kke ? `Our officials who registered you while registering on our server before:\n${kke.join('\n')}!` : 'You have not registered on our server before.');
      }
      case 'three': {
        const record = db.get(`record_${id}`);
        const points = db.get(`points_${id}`) || 0;
        return info(btn, record ? `Your total penalty points: ${points}, the penalties you receive: ${record.join('\n')}!` : 'You do not have any track record!');
      }
      case 'four':
        return info(btn, `${btn.clicker.member.roles.cache.filter((r) => r.name !== '@everyone').map((r) => r).join('\n')}`);
      case 'five':
        return info(btn, `to our server ${moment(btn.clicker.member.joinedAt).format('DD | MM | YYYY | hh:mm:ss')} You joined on.`);
      default:
        return undefined;
    }
  });
};
