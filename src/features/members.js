'use strict';
const { MessageEmbed } = require('discord.js');
const db = require('quick.db');
const moment = require('moment');
require('moment-duration-format');

const WEEK_MS = 604800000;
const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function welcomeDm(member, config) {
  const embed = new MessageEmbed()
    .setColor('GREEN')
    .setTitle('Assalamu Alaikum')
    .setURL(config.bot.guildVanityURL)
    .setDescription(`Welcome to the official ${member.guild.name} We are glad to see you here. 😊 \n\n\`Please follow these simple steps:\` \n\n\`1.\` **Take on your preferred self-role** <#${config.channels.selfRolesChannel}>\n\`2.\` **Read and comply with server rules** <#${config.channels.rules}>\n\`3.\` **Feel free to engage in chat discussions** <#${config.channels.chat}>\n\nThank you and have a good day!`)
    .setImage(config.welcomeDm.image)
    .setTimestamp()
    .setFooter(config.bot.footer, config.welcomeDm.footerIcon);
  return member.send(embed).catch(() => {});
}

function registrationWelcome(member, config) {
  const age = Date.now() - member.user.createdTimestamp;
  const created = moment(member.user.createdAt);
  const createdText = `${created.format('DD')} ${MONTHS[created.month()]} ${created.format('YYYY')} ${created.format('HH:mm')}`;
  const ignore = () => {};
  if (age > WEEK_MS) {
    member.roles.add(config.registration.unregistered).catch(ignore);
    member.setNickname(config.registration.autonickname).catch(ignore);
    const channel = member.guild.channels.cache.get(config.channels.welcomechannel);
    if (!channel) return undefined;
    return channel.send(`
:tada: welcome to our server ${member} We are glad to see you!
        
Your account \`${createdText}\` on \`(${moment.duration(age).format('Y [yıl], M [ay]')})\` created before.

To register on our server, you must enter one of the audio channels on the left!

Do Not Forget To Read Our Server Rules After Registering Not all rules are written, Please be polite.

You can write \`.tag\` to any channel to reach our tag.

<@&${config.registration.staff}> our officials in your role will take care of you.

**With you \`${member.guild.memberCount}\` We've reached the member!** 🎉`);
  }
  member.roles.add(config.registration.suspecios).catch(ignore);
  member.setNickname(config.registration.autonickname || config.registration.susoeciosnickname).catch(ignore);
  const channel = member.guild.channels.cache.get(config.registration.suspecchannel);
  if (!channel) return undefined;
  return channel.send(`
        :tada: **welcome to our server ${member}!**
        
        Your account \`${moment.duration(age).format('DD [Day], HH [moment], mm [minutes], ss [second]')}\` You Have Been Suspected For Being New Created
        
        It is enough to give a sound confirmation to our authorities to get out of the suspect.
        
        `);
}

module.exports = (bus, { config }, name) => {
  bus.on('guildMemberAdd', `${name}:welcome-dm`, (member) => config.welcomeDm.enabled && welcomeDm(member, config));
  bus.on('guildMemberAdd', `${name}:registration`, (member) => registrationWelcome(member, config));

  bus.on('guildMemberRemove', name, (member) => {
    if (member.user.bot) return;
    db.set(`roles_${member.id}`, member.roles.cache.map((x) => x.id));
    db.set(`name_${member.id}`, member.displayName);
  });

  bus.on('guildBanRemove', name, (guild, user) => {
    if (db.get(`ban.${user.id}`) === true) return guild.members.ban(user.id, { reason: 'Unopened bank.' });
    if (db.get(`tban_${user.id}`)) return guild.members.ban(user.id, { reason: 'Temporary Ban.' });
    return undefined;
  });
};

module.exports.registrationWelcome = registrationWelcome;
