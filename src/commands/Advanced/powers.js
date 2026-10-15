const Discord = require('discord.js');
const db = require('quick.db');

module.exports = {
    name: "powers",
    aliases: ['yetkilerim'],
    execute: async (client, msg, args,) => {
      let x;
  let x2;
  let x3;
  let x4;
  let x5;
  let x6;
  let x7;
  let x8;
  let x9;
  let x10;
  let x11;

  //yönetici
  if (msg.member.hasPermission("ADMINISTRATOR")) x = "✔";
  if (!msg.member.hasPermission("ADMINISTRATOR")) x = "❌";

  //Denetim kaydı
  if (msg.member.hasPermission("VIEW_AUDIT_LOG")) x2 = "✔";
  if (!msg.member.hasPermission("VIEW_AUDIT_LOG")) x2 = "❌";

  //Sunucuyu yönet
  if (msg.member.hasPermission("MANAGE_GUILD")) x3 = "✔";
  if (!msg.member.hasPermission("MANAGE_GUILD")) x3 = "❌";

  //Rolleri yönet
  if (msg.member.hasPermission("MANAGE_ROLES")) x4 = "✔";
  if (!msg.member.hasPermission("MANAGE_ROLES")) x4 = "❌";

  //Kanalları yönet
  if (msg.member.hasPermission("MANAGE_CHANNELS")) x5 = "✔";
  if (!msg.member.hasPermission("MANAGE_CHANNELS")) x5 = "❌";

  //üyeleri at
  if (msg.member.hasPermission("KICK_MEMBERS")) x6 = "✔";
  if (!msg.member.hasPermission("KICK_MEMBERS")) x6 = "❌";

  //üyeleri yasakla
  if (msg.member.hasPermission("BAN_MEMBERS")) x7 = "✔";
  if (!msg.member.hasPermission("BAN_MEMBERS")) x7 = "❌";

  //mesajları yönet
  if (msg.member.hasPermission("MANAGE_MESSAGES")) x8 = "✔";
  if (!msg.member.hasPermission("MANAGE_MESSAGES")) x8 = "❌";

  //kullanıcı adlarını yönet
  if (msg.member.hasPermission("MANAGE_NICKNAMES")) x9 = "✔";
  if (!msg.member.hasPermission("MANAGE_NICKNAMES")) x9 = "❌";

  //emojileri yönet
  if (msg.member.hasPermission("MANAGE_EMOJIS")) x10 = "✔";
  if (!msg.member.hasPermission("MANAGE_EMOJIS")) x10 = "❌";

  //webhookları yönet
  if (msg.member.hasPermission("MANAGE_WEBHOOKS")) x11 = "✔";
  if (!msg.member.hasPermission("MANAGE_WEBHOOKS")) x11 = "❌";

  msg.channel.send(`
    \`\`\`diff
    ${x} Executive
${x2} View Audit Log
${x3} Manage Server
${x4} Manage Roles
${x5} Manage Channels
${x6} Horse Members
${x7} Ban Members
${x8} Manage Messages
${x9} Manage Usernames
${x10} Manage Emojis
${x11} Manage Webhooks
\`\`\`
   `);
  msg.channel.send(
    '```md\n# Those with "❌" at the beginning indicate that they do not have that privilege. \n# Those with "✔" at the beginning indicate that you have that authority. \n```'
  );
}}