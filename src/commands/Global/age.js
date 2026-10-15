const Discord = require("discord.js")
const config = require("../../../config.json");
module.exports = {
    name: "age",
    aliases:["age"],
    execute: async (client, message, args, embedcik, author, channel, guild) => {
  if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send()

let yas13 = message.guild.members.cache.filter(x=> x.displayName.includes("13")).size;
let yas14 = message.guild.members.cache.filter(x=> x.displayName.includes("14")).size;
let yas15 = message.guild.members.cache.filter(x=> x.displayName.includes("15")).size;
let yas16 = message.guild.members.cache.filter(x=> x.displayName.includes("16")).size;
let yas17 = message.guild.members.cache.filter(x=> x.displayName.includes("17")).size;
let yas18 = message.guild.members.cache.filter(x=> x.displayName.includes("18")).size;
let yas19 = message.guild.members.cache.filter(x=> x.displayName.includes("19")).size;
let yas20 = message.guild.members.cache.filter(x=> x.displayName.includes("20")).size;
let yas21 = message.guild.members.cache.filter(x=> x.displayName.includes("21")).size;
let yas22 = message.guild.members.cache.filter(x=> x.displayName.includes("22")).size;
let yas23 = message.guild.members.cache.filter(x=> x.displayName.includes("23")).size;
let yas24 = message.guild.members.cache.filter(x=> x.displayName.includes("24")).size;
let yas25 = message.guild.members.cache.filter(x=> x.displayName.includes("25")).size;
let yas26 = message.guild.members.cache.filter(x=> x.displayName.includes("26")).size;
let yas27 = message.guild.members.cache.filter(x=> x.displayName.includes("27")).size;
let yas28 = message.guild.members.cache.filter(x=> x.displayName.includes("28")).size;
let yas29 = message.guild.members.cache.filter(x=> x.displayName.includes("29")).size;
let yas30 = message.guild.members.cache.filter(x=> x.displayName.includes("30")).size;
let yas31 = message.guild.members.cache.filter(x=> x.displayName.includes("31")).size;
let yas32 = message.guild.members.cache.filter(x=> x.displayName.includes("32")).size;
let yas33 = message.guild.members.cache.filter(x=> x.displayName.includes("33")).size;
let yas34 = message.guild.members.cache.filter(x=> x.displayName.includes("34")).size;
let yas35 = message.guild.members.cache.filter(x=> x.displayName.includes("35")).size;
let yas36 = message.guild.members.cache.filter(x=> x.displayName.includes("36")).size;
let yas37 = message.guild.members.cache.filter(x=> x.displayName.includes("37")).size;
let yas38 = message.guild.members.cache.filter(x=> x.displayName.includes("38")).size;
let yas39 = message.guild.members.cache.filter(x=> x.displayName.includes("39")).size;
let yas40 = message.guild.members.cache.filter(x=> x.displayName.includes("40")).size;


let embed = new Discord.MessageEmbed()
.setColor('RANDOM')
.setAuthor(message.guild.name, message.guild.iconURL({ dymaic: true}))
.setDescription(`Average Age on Server; 
\`13 Yaş:\` **${yas13}** Person
\`14 Yaş:\` **${yas14}** Person
\`15 Yaş:\` **${yas15}** Person
\`16 Yaş:\` **${yas16}** Person
\`17 Yaş:\` **${yas17}** Person
\`18 Yaş:\` **${yas18}** Person
\`19 Yaş:\` **${yas19}** Person
\`20 Yaş:\` **${yas20}** Person
\`21 Yaş:\` **${yas21}** Person
\`22 Yaş:\` **${yas22}** Person
\`23 Yaş:\` **${yas23}** Person
\`24 Yaş:\` **${yas24}** Person
\`25 Yaş:\` **${yas25}** Person
\`26 Yaş:\` **${yas26}** Person
\`27 Yaş:\` **${yas27}** Person
\`28 Yaş:\` **${yas28}** Person
\`29 Yaş:\` **${yas29}** Person
\`30 Yaş:\` **${yas30}** Person
\`31 Yaş:\` **${yas31}** Person
\`32 Yaş:\` **${yas32}** Person
\`33 Yaş:\` **${yas33}** Person
\`34 Yaş:\` **${yas34}** Person
\`35 Yaş:\` **${yas35}** Person
\`36 Yaş:\` **${yas36}** Person
\`37 Yaş:\` **${yas37}** Person
\`38 Yaş:\` **${yas38}** Person
\`39 Yaş:\` **${yas39}** Person
\`40 Yaş:\` **${yas40}** Person`)
.setThumbnail(message.guild.iconURL({ dymaic: true}))
message.channel.send(embed)
}

}
