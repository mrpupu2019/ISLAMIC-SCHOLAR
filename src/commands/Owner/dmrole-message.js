const { MessageEmbed } = require("discord.js");

module.exports = {
  name: "dmrole-message",
  aliases: ["dmrole-message"],
  enabled: true,
  guildOnly: false,
  permLevel: 0,
  execute: async (client, message, args, embed, author, channel, guild) => {
if (!message.member.hasPermission("ADMINISTRATOR")) return channel.send(embed.setDescription("You must have valid authorization to use the command."));
    const role =
        message.mentions.roles.first() ||
        message.guild.roles.cache.get(args[0]);

    const mesaj = args.slice(1).join(" ");

    if (!role)
        return message.channel.send(
            `You have to tag a role or write its ID!`
        );

    if (!mesaj) return message.channel.send(`You should write a message!`);

    role.members.forEach(async (member) => {
        member.send(mesaj).catch((x) => {
            console.log(`${member.user.tag}, I couldn't send messages to these members!`);
        });
    });

    const members = message.guild.roles.cache
        .find((roles) => roles.id === role.id)
        .members.map((üyeler) => `<@!${üyeler.user.id}>`)
        .join("\n");

    const sleax = await message.channel.send(`Message sent to members!`);

    setTimeout(() => {
        sleax.edit(
            `Messages sent! \n\nWhich members was it sent to? \n${members}`
        );
    }, 5000);
}}