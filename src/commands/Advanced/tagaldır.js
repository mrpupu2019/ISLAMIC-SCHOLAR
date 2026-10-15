const { MessageEmbed } = require('discord.js');
const Discord = require('discord.js');
const qdb = require("quick.db");
const tdb = new qdb.table("tag")
const ayar = require("../../../config.json");

module.exports = {
    name: "tagal",
    aliases: ["tagaldı"],
    execute: async (client, message, args, _embed, author, channel, guild) => {
    let member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
 let embed = new MessageEmbed().setTimestamp().setColor("RANDOM").setFooter(`ISLAMIC SERVER`);
 if (!message.member.roles.cache.has("ID") && !message.member.hasPermission("ADMINISTRATOR")){ return message.channel.send(embed.setDescription(`You do not have sufficient privileges to use this command`)).then(x => x.delete({timeout: 10000}));
 
}else{
    if(!member) return message.channel.send(embed.setDescription(`Specify a member.`))
    let data = tdb.fetch(`tagverdi.${member.id}`)

    if(data) return message.channel.send(`This person has been tagged before.`).then(x => x.delete({timeout: 10000}));
        const filter = (reaction, user) => {
            return ["✅"].includes(reaction.emoji.name) && user.id === member.id; 
        };
        message.channel.send(embed.setDescription(`${member}, ${message.author} Do you accept that it includes you as tag bought?`).setFooter(`You have 15 seconds to accept.`)).then(x => {
 x.react("✅");
            x.awaitReactions(filter, {max: 1, time: 15000, error: ['time']}).then(resp => {
                let response = resp.first();
                if (response) {
            tdb.add(`aldı.${message.author.id}.tag`, +1);
            tdb.push(`tagaldı.${message.author.id}`, {
                guildName: `${member}`,
                guildNameid: `${member.id}`,
                Zaman: Date.now(),
                Yetkili: message.author.id
            });
            tdb.set(`tagverdi.${member.id}`,true)

            let datas = tdb.get(`aldı.${message.author.id}.tag`)
    
            message.channel.send(embed.setDescription(`${member} I got tag and saved it to your list. \n Total ${datas}`).setFooter(`Thanks for your support to us.`).setAuthor(message.member.displayName, message.author.avatarURL({dynamic: true}))).then(x => x.delete({timeout: 10000}));
        };
    });
        })                
        
        }

        }}