const Discord = require("discord.js");

const config = require("../../../config.json");


module.exports = {
  name: "audit",
  aliases: ["role-information","roleplay","rb"],
  execute: async (client, message, args, embed, author, channel, guild) => {
    if (!message.member.hasPermission('ADMINISTRATOR')) 
    if(!message.member.roles.cache.has(config.staffrole))
		    return message.channel.send('You are not authorized to use this command.') 
 const filter = (reaction, user) => {
        return ["✅"].includes(reaction.emoji.name) && user.id === message.author.id; 
    };
    if (!args[0]) return message.channel.send("**Enter a role.**")
        let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name.toLowerCase() === args.join(' ').toLocaleLowerCase());
        if (!role) return message.channel.send("**Enter a valid role.**");
        let membersWithRole = message.guild.members.cache.filter(member => {
            return member.roles.cache.find(r => r.name === role.name);
        }).map(member => {
            return member.user;
        })

        const status = {
            false: "Hayır",
            true: "No"
        }
    let sesteolmayan = message.guild.members.cache.filter(s => s.roles.cache.has(role.id)).filter(s => s.presence.status !== "offline").filter(s => !s.voice.channel).map(s => s).join(' ')
    let sesteolan = message.guild.members.cache.filter(s => s.roles.cache.has(role.id)).filter(s => s.voice.channel).map(s => s).join(', ')

    message.channel.send(`
		🔍\`Click on the reaction to find out what's on/without audio\`🔎
    
**Role name**: \`${role.name}\`
**ID**: \`${role.id}\`
**Role color**: \`${role.hexColor}\`
**---------------------------------------------------**
**There is \`${role.members.size}\` person in this Role in total.**
**Position:**: \`${role.position}\`
**Can it be mentioned?**: \`${status[role.mentionable]}\`
**Members with this Role**: 
${membersWithRole.join(",")}
       
`).then(x => {
x.react('✅');  
x.awaitReactions(filter, {max: 1, time: 10000, error: ['time']}).then(z => {
            let donut = z.first();
            if (donut) {
				
			  x.edit(`**Those in the sound**:\n ${sesteolan}\n **Not in audio (not counting offline)**: \n ${sesteolmayan}`);
            };
        });
	    });		
  }
}