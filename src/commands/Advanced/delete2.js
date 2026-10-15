module.exports = {
    name: "delete2",
    aliases: ["temizle2", "delete2"],
    execute: async (client, message, args, embed, author, channel, guild) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
    const sayı = Number(args[1]);

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.reply(`You must have "MANAGE MESSAGES" permission to use this command!`);
    if (!member) return message.reply("You forgot to specify a user or specify a number.");
    if (!sayı) return message.reply("You must specify a number to delete a message.");
    if (sayı > 100) return message.channel.send(`100'You cannot delete more than one message.`)

    message.channel.messages.fetch({
        limit: 100,
    }).then((messages) => {
        if (member) {
            const cs = member ? member.id : client.user.id;
            messages = messages.filter(m => m.author.id === cs).array().slice(0, sayı);
            message.reply(`Successful **${member.user.tag}** by ${sayı} You deleted your message.`).then(x => x.delete({ timeout: 5000 }))
        }
        try {
            message.channel.bulkDelete(messages)
        } catch (err) {
            message.channel.send(`I cannot delete the messages you are trying to delete because they were written 14 days ago.`)
        }
    });
}}