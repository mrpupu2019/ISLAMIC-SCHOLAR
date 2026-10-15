const {MessageEmbed} = require('discord.js');
let qdb = require("quick.db");
const moment = require("moment");
const config = require("../../../config.json");

require("moment-duration-format");
let sesdb = new qdb.table("stats")
let stats_week = new qdb.table("stats_week")
let stats_daily = new qdb.table("stats_daily")
let stats_two_week = new qdb.table("stats_two_week")
let stats_three_week = new qdb.table("stats_three_week")
let stats_month = new qdb.table("stats_month")

let mstats_week = new qdb.table("mstats_week")
let mstats_daily = new qdb.table("mstats_daily")
let mstats_two_week = new qdb.table("mstats_two_week")
let mstats_three_week = new qdb.table("mstats_three_week")
let mstats_month = new qdb.table("mstats_month")



module.exports = {
    name: 'top10',
    aliases: ['top10'],
    execute: async (client, message, args, _embed, author, channel, guild) => {
	if (!message.guild) return
	// TOPLAM
	const voiceDataTotal = await sesdb.get(`stats.${message.guild.id}`) || undefined;
	const messageDataTotal = await sesdb.get(`message.${message.guild.id}`) || undefined;
	// GÜNLÜK
	const voiceData = await stats_daily.get(`stats_daily.${message.guild.id}`) || undefined;
	const messageData = await mstats_daily.get(`message_daily.${message.guild.id}`) || undefined;
	// HAFTALIK
	const voiceData_week = await stats_week.get(`stats_week.${message.guild.id}`) || undefined;
	const messageData_week = await mstats_week.get(`message_week.${message.guild.id}`) || undefined;
	// 2 HAFTALIK
	const _mounth = await stats_two_week.get(`stats_two_week.${message.guild.id}`) || undefined;
	const messageData_two_week = await mstats_two_week.get(`message_two_week.${message.guild.id}`) || undefined;
	// 3 HAFTALIK
	const voiceData_three_week = await stats_three_week.get(`stats_three_week.${message.guild.id}`) || undefined;
	const messageData_three_week = await mstats_three_week.get(`message_three_week.${message.guild.id}`) || undefined;
	// 1 AYLIK
	const voiceData_month = await stats_month.get(`stats_month.${message.guild.id}`) || undefined;
	const messageData_month = await mstats_month.get(`message_month.${message.guild.id}`) || undefined;
	var user = message.mentions.users.first() || message.author;

	let rakam = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"]

		let { voiceList_total, messageList_total } = await toplam(voiceDataTotal, messageDataTotal);
		let { voiceList, messageList } = await gunluk(voiceData, messageData);
		let { voiceList_week, messageList_week } = await haftalık(voiceData_week, messageData_week);
		let { voiceList_two_week, messageList_two_week } = await ikihaftalikk(_mounth, messageData_two_week);
		let { voiceList_three_week, messageList_three_week } = await uchaftalik(voiceData_three_week, messageData_three_week);
		let { voiceList_month, messageList_month } = await aylik(voiceData_month, messageData_month);

	return message.channel.send(new MessageEmbed()
		.setAuthor(user.username, user.avatarURL())
		.setThumbnail(user.avatarURL())
		.setColor("RANDOM")
		.setTimestamp()
		.setFooter(config.bot.footer).setDescription(`${message.guild.name} server's total and 1 day / 1 week / 2 weeks / 3 weeks / monthly chat-voice statistics;
\`\`\`------------------------------\`\`\`
**Total Audio Sequencing**
${voiceList_total}
**Total Chat Ranking**
${messageList_total}
\`\`\`------------------------------\`\`\`
**Daily Audio Sequencing**
${voiceList}
**Daily Chat Ranking**
${messageList}
\`\`\`------------------------------\`\`\`
**Weekly Audio Ranking**
${voiceList_week}
**Weekly Chat Ranking**
${messageList_week}
\`\`\`------------------------------\`\`\`
**2 Weekly Audio Ranking**
${voiceList_two_week}
**2 Weekly Chat Ranking**
${messageList_two_week}
\`\`\`------------------------------\`\`\`
**3 Weekly Audio Ranking**
${voiceList_three_week}
**3 Weekly Chat Ranking**
${messageList_three_week}
\`\`\`------------------------------\`\`\`
**1 Monthly Audio Ranking**
${voiceList_month}
**1 Monthly Chat Ranking**
${messageList_month}`)) 
		.addField(`**Total Audio Sequencing**`, `${voiceList_total}`)
		.addField("**Total Chat Ranking**", `${messageList_total}`)

		.addField(`**Daily Audio Sequencing**`, `${voiceList}`)
		.addField("**Daily Chat Ranking**", `${messageList}`)

		.addField(`**Weekly Audio Ranking**`, `${voiceList_week}`)
		.addField("**Weekly Chat Ranking**", `${messageList_week}`)

		.addField(`**2 Weekly Audio Ranking**`, `${voiceList_two_week}`)
		.addField("**2 Weekly Chat Ranking**", `${messageList_two_week}`)

		.addField(`**3 Weekly Audio Ranking**`, `${voiceList_three_week}`)
		.addField("**3 Weekly Chat Ranking**", `${messageList_three_week}`)

		.addField(`**1 Monthly Audio Ranking**`, `${voiceList_month}`)
		.addField("**1 Monthly Chat Ranking**", `${messageList_month}`)
 
if (args[0] === "2") {
	let voiceList_total_Rol = "A data saved in Datacenter could not be displayed";
	let messageList_total_Rol = "A data saved in Datacenter could not be displayed";
	
	let voiceList_week_Rol = "A data saved in Datacenter could not be displayed";
	let messageList_week_Rol = "A data saved in Datacenter could not be displayed";
	let role = message.mentions.roles.first() || message.guild.roles.cache.get(args[1])
	if (!role) return message.channel.send(new MessageEmbed().setAuthor(message.author.tag,message.author.avatarURL()).setColor("RANDOM").setFooter(config.bot.footer).setTimestamp().setDescription(`Please tag the role you want to look at! \`(.top 2 @rol)\``))
			if (voiceDataTotal) {
				voiceList_total_Rol = Object.keys(voiceDataTotal || {}).filter(id => role.members.some(e => e.id == id)).map(md => {
					return {
						Id: md,
						Total: Object.values(voiceDataTotal[md].channels || {}).reduce((a, b) => a + b, 0)
					};
				}).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
		}
		if (messageDataTotal) {
			messageList_total_Rol = Object.keys(messageDataTotal || {}).filter(id => role.members.some(e => e.id == id)).map(md => {
				return {
					Id: md,
					Total: Object.values(messageDataTotal[md].channels || {}).reduce((a, b) => a + b, 0)
				};
			}).sort((a, b) => b.Total - a.Total).splice(0, 10).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
		}

		if (voiceData_week) {
			voiceList_week_Rol = Object.keys(voiceData_week || {}).filter(id => role.members.some(e => e.id == id)).map(md => {
				return {
					Id: md,
					Total: Object.values(voiceData_week[md].channels || {}).reduce((a, b) => a + b, 0)
				};
			}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
		}
		
		if (messageData_week) {
			messageList_week_Rol = Object.keys(messageData_week || {}).filter(id => role.members.some(e => e.id == id)).map(md => {
				return {
					Id: md,
					Total: Object.values(messageData_week[md].channels || {}).reduce((a, b) => a + b, 0)
				};
			}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
		}

	return message.channel.send(new MessageEmbed().setColor("RANDOM").setFooter(config.bot.footer).setTimestamp().setDescription(`
${message.mentions.roles.first() || message.guild.roles.cache.get(args[1])} TOP 10 Voice Statistics of Her Authority
\`\`\`------------------------------\`\`\`
**Total Audio Sequencing**
${voiceList_total_Rol ? voiceList_total_Rol : "A data saved in Datacenter could not be displayed"}
\`\`\`------------------------------\`\`\`
**Total Chat Ranking**
${messageList_total_Rol ? messageList_total_Rol : "A data saved in Datacenter could not be displayed"}
\`\`\`------------------------------\`\`\`
**Weekly Audio Ranking**
${voiceList_week_Rol ? voiceList_week_Rol : "A data saved in Datacenter could not be displayed"}
\`\`\`------------------------------\`\`\`
**Weekly Chat Ranking**
${messageList_week_Rol ? messageList_week_Rol : "A data saved in Datacenter could not be displayed"}

`))
}

const emojis = [`\`\`\`------------------------------\`\`\`
**Total Audio Sequencing**
${voiceList_total}
**Total Chat Ranking**
${messageList_total}
\`\`\`------------------------------\`\`\`
**Daily Audio Sequencing**
${voiceList}
**Daily Chat Ranking**
${messageList}
\`\`\`------------------------------\`\`\`
**Weekly Audio Ranking**
${voiceList_week}
**Weekly Chat Ranking**
${messageList_week}`, `\`\`\`------------------------------\`\`\`
**2 Weekly Audio Ranking**
${voiceList_two_week}
**2 Weekly Chat Ranking**
${messageList_two_week}
\`\`\`------------------------------\`\`\`
**3 Weekly Audio Ranking**
${voiceList_three_week}
**3 Weekly Chat Ranking**
${messageList_three_week}
\`\`\`------------------------------\`\`\`
**1 Monthly Audio Ranking**
${voiceList_month}
**1 Monthly Chat Ranking**
${messageList_month}`]

		// Define our function.
		async function list(listMsg, page, increment) {
		  const entries = Object.entries(emojis);
		
		  // Set up base embed.
		  var embed = new MessageEmbed()
			.setColor(1056085)
			.setTitle('**Daily / Weekly / Monthly TOP 5 Stats Information**')
			.setFooter(`Page ${page} of ${Math.ceil(entries.length/increment)}`)
			.setTimestamp(listMsg ? listMsg.createdAt : undefined);
		
		  // Add fields to embed.
		
		  const stringField = [];
		
		  for (let [emoji, string] of entries.slice((page - 1) * increment, (page * increment))) {
		
			stringField.push(string);
		  }
		
		  embed.setDescription(stringField.join('\n'), true);
		
		  // Edit/send embed.
		  if (listMsg) await listMsg.edit(embed);
		  else listMsg = await message.channel.send(embed);
		
		  // Set up page reactions.
		  const lFilter = (reaction, user) => reaction.emoji.name === '◀' && page !== 1 && user.id === message.author.id;
		  const lCollector = listMsg.createReactionCollector(lFilter, { max: 1 });
		
		  lCollector.on('collect', async () => {
			rCollector.stop();
			await listMsg.reactions.removeAll();
			list(listMsg, page - 1, increment);
		  });
		
		  const rFilter = (reaction, user) => reaction.emoji.name === '▶' && entries.length > page * increment && user.id === message.author.id;
		  const rCollector = listMsg.createReactionCollector(rFilter, { max: 1 });
		
		  rCollector.on('collect', async () => {
			lCollector.stop();
			await listMsg.reactions.removeAll();
			list(listMsg, page + 1, increment);
		  });
		
		  if (page !== 1) await listMsg.react('◀');
		  if (entries.length > page * increment) await listMsg.react('▶');
		}
		
		// Send the list; page 1, and 5 shown on each page.
		list(undefined, 1, 1)
		  .catch(console.error);


	}
}

async function toplam(voiceDataTotal, messageDataTotal) {
	let voiceList_total = "A data saved in Datacenter could not be displayed";
	if (voiceDataTotal) {
		voiceList_total = Object.keys(voiceDataTotal || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(voiceDataTotal[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList_total = "A data saved in Datacenter could not be displayed";
	if (messageDataTotal) {
		messageList_total = Object.keys(messageDataTotal || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageDataTotal[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList_total, messageList_total };
}

async function aylik(voiceData_month, messageData_month) {
	let voiceList_month = "A data saved in Datacenter could not be displayed";
	if (voiceData_month) {
		voiceList_month = Object.keys(voiceData_month || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(voiceData_month[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList_month = "A data saved in Datacenter could not be displayed";
	if (messageData_month) {
		messageList_month = Object.keys(messageData_month || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageData_month[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList_month, messageList_month };
}

async function uchaftalik(voiceData_three_week, messageData_three_week) {
	let voiceList_three_week = "A data saved in Datacenter could not be displayed";
	if (voiceData_three_week) {
		voiceList_three_week = Object.keys(voiceData_three_week || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(voiceData_three_week[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList_three_week = "A data saved in Datacenter could not be displayed";
	if (messageData_three_week) {
		messageList_three_week = Object.keys(messageData_three_week || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageData_three_week[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList_three_week, messageList_three_week };
}

async function ikihaftalikk(_mounth, messageData_two_week) {
	let voiceList_two_week = "A data saved in Datacenter could not be displayed";
	if (_mounth) {
		voiceList_two_week = Object.keys(_mounth || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(_mounth[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList_two_week = "A data saved in Datacenter could not be displayed";
	if (messageData_two_week) {
		messageList_two_week = Object.keys(messageData_two_week || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageData_two_week[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList_two_week, messageList_two_week };
}

async function haftalık(voiceData_week, messageData_week) {
	let voiceList_week = "A data saved in Datacenter could not be displayed";
	if (voiceData_week) {
		voiceList_week = Object.keys(voiceData_week || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(voiceData_week[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList_week = "A data saved in Datacenter could not be displayed";
	if (messageData_week) {
		messageList_week = Object.keys(messageData_week || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageData_week[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList_week, messageList_week };
}

async function gunluk(voiceData, messageData) {
	let voiceList = "A data saved in Datacenter could not be displayed";
	if (voiceData) {
		voiceList = Object.keys(voiceData || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(voiceData[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${moment.duration(user.Total).format("H [hour,] m [minute,] s [second]")}\``).join("\n");
	}
	let messageList = "A data saved in Datacenter could not be displayed";
	if (messageData) {
		messageList = Object.keys(messageData || {}).map(md => {
			return {
				Id: md,
				Total: Object.values(messageData[md].channels || {}).reduce((a, b) => a + b, 0)
			};
		}).sort((a, b) => b.Total - a.Total).splice(0, 5).map((user, index) => `\`${index + 1}.\` <@${user.Id}> \`${user.Total} message\``).join("\n");
	}
	return { voiceList, messageList };
}



/*
		if (args[0] === "1") {

		}
		message.channel.send(new MessageEmbed().setAuthor(user.username, user.avatarURL()).setThumbnail(user.avatarURL()).setColor("RANDOM").setTimestamp().setFooter(client.ayarlar.footer)
		.setDescription(`Lütfen en az 1, en fazla 5 tane kategori seçin.

\`1.\` Toplam
\`2.\` Kayıt Odaları
\`3.\` Vampir / Köylü
\`4.\` Doğruluk / Cesaret
\`5.\` Public Odalar
\`6.\` Stream Odalar
\`7.\` Secret Of Dark
\`8.\` Sleep Room
\`9.\` Sorun Çözme
\`10.\` Müzik Odaları
\`11.\` Oyun Odaları

\`--rookies\` <@&ID>
\`--eternal\` <@&ID>
\`--moon\` <@&ID>
\`--throne\` <@&ID>
\`--shadows\` <@&ID>
\`--proteger\` <@&ID>
\`--kronos\` <@&ID>
\`--lotis\` <@&ID>
\`--legion\` <@&ID>
\`--alpha\` <@&ID>
\`--majesty\` <@&ID>
\`--blackthron\` <@&ID>
\`--darklord\` <@&ID>
\`--diamente\` <@&ID>
\`--paradise\` <@&ID>

Örnek Kullanım:
\`d!top 1 --legion\`
\`d!top 4 1 --shadows --kronos\`
\`d!top <kanalID> --lord\`
\`d!top 3 4 751524861205282969 --majesty\`
\`d!top 1 --dark 2 --moon\`
		`))

*/