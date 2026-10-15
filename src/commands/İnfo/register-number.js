const db = require("quick.db");
module.exports = {
    name: "register-number",
    aliases: ["teyitler", "register-number"],
    execute: async (client, message, args, embed, author, channel, guild) => {
        var member = message.mentions.users.first() || client.fetchUser(args[0]) || author;
        let erkek = db.get(`erkek_${member.id}`) || 0;
        let kadın = db.get(`kadın_${member.id}`) || 0;
        let toplam = db.get(`toplam_${member.id}`) || 0;
        channel.send(embed.setDescription(`
 Total Records: **${toplam}**
 
 Male Registration: **${erkek}**
 Women's Registration: **${kadın}**`))
    }
}