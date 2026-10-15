'use strict';
const Discord = require('discord.js');
const buttons = require('discord-buttons');
const db = require('quick.db');

module.exports = (bus, { client, config }, name) => {
  async function approve(btn, applicantId) {
    btn.reply.defer();
    const done = new buttons.MessageButton().setLabel('Approved').setStyle('green').setID('ony').setDisabled();
    const embed = new Discord.MessageEmbed()
      .setDescription(`**Congratulations Your Application Has Been Approved**
                    
                    Applicant : <@${applicantId}>  
                    Accepting the Application : \`${btn.clicker.user.tag}\`  

                    Good luck, you are now an authorized member of our family. :)`)
      .setColor('RANDOM');
    await btn.message.edit(`<@${applicantId}> application of the \`${btn.clicker.user.tag}\` Accepted by official`, done);
    const resultChannel = client.channels.cache.get(config.ytv.onayred);
    if (resultChannel) await resultChannel.send(`<@${applicantId}>,`, embed);
    const guild = client.guilds.cache.get(config.Guild.GuildID);
    const member = guild && guild.members.cache.get(applicantId);
    if (member) await member.roles.add(config.ytv.yetkiverilecek);
    const user = client.users.cache.get(applicantId);
    if (user) user.send('Hello! there :wave: \nYour authorized application has been approved, first of all, congratulations, you are now one of our authorized team. :partying_face: \n Then take it easy now :) Welcome to Wasley Authorized Team :heart:').catch(() => {});
  }

  function reject(btn, applicantId, onDone) {
    btn.reply.defer();
    const filter = (m) => m.author.id === btn.clicker.user.id;
    const collector = new Discord.MessageCollector(btn.channel, filter, { max: 1, time: 3 * 60 * 1000 });
    btn.channel.send('**Reason for Rejection?** <you have 3 minutes to answer>');
    collector.on('end', (collected) => {
      if (!collected.size) return btn.channel.send('**Times up!**');
      onDone();
      btn.channel.send('**Your application has been successfully rejected.**');
      const reason = collected.first().content;
      const denied = new buttons.MessageButton().setLabel('Denied').setStyle('red').setID('red').setDisabled();
      const embed = new Discord.MessageEmbed()
        .setAuthor(config.bot.name, btn.message.guild.iconURL({ dynamic: true, size: 1024 }))
        .setDescription(`<@${applicantId}> Your application, \`${reason}\` because of ${btn.clicker.user} Rejected by`)
        .setColor('RED');
      btn.message.edit(`<@${applicantId}> application of the, \`${reason}\` because of, \`${btn.clicker.user.tag}\` Successfully Rejected by`, denied).catch(() => {});
      const resultChannel = client.channels.cache.get(config.ytv.onayred);
      return resultChannel && resultChannel.send(`<@${applicantId}>,`, embed);
    });
  }

  bus.on('clickButton', name, async (btn) => {
    if (btn.id !== 'onay' && btn.id !== 'red') return;
    const key = `basvur.${btn.message.id}`;
    const applicantId = db.get(key);
    if (!applicantId) return;
    if (btn.id === 'onay') {
      await approve(btn, applicantId);
      db.delete(key);
    } else {
      reject(btn, applicantId, () => db.delete(key));
    }
  });
};
