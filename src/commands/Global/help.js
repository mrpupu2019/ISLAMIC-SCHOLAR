const Discord = require('discord.js')
let pages = ['**General Commands Everyone Can Use**\n\n `afk` = you switch to afk mode\n `alarm` = you set an alarm\n `stats` = you can check your own stats\n  `top10` = You can see the top 10 active user stats\n `booster` = Allows changing nicknames for boosters\n `where` = shows you where\n `link` = throws the server link\n `apply` = You can apply for an authorized\n `info` = Shows User Information\n `avatar` = shows your avatar\n `powers` = You can see the Powers You Have\n `livesupport` = You start live support\n',

    '**Registration Commands**\n\n `male` = you register the user as male\n `female` = you register the user as Female\n `names` = You can view all registered user names.\n `setname` = Lets You Correct The Users Name\n `unregistered` = Unregisters the user you tagged\n `suspicious` = Suspicious of the User You Tagged\n `user-reset` = You can remove the user from the registration channel after registration\n' ,

    '**Moderation Commands**\n\n `mute` = You Mute the User in Chat\n `vmute` = You Mute the User on Audio Channels\n `jail` = You Arrest the User to Criminal\n `ban` = you ban the user\n `delete` = You can delete up to 100 messages in chat.\n `delete2` = Deletes as many messages as you specify from the user you tagged.\n`warn` = You Warn the User\n `unmute` = You unmute users\n `unvmute` = You turn on users mute on audio channels\n `unjail` = You Remove the User from Silivri\n `unban` = You Can Unban Banned User\n `vckick` = kicks a user on the voice channel from that channel\n `limited-role` = you can give a role for a period of time\n `snipe` = Throws the last deleted message\n `say` = Shows the number of members on the server\n `voting` = You Start a Vote\n `activechk` = Counts active but not voiced officials\n `audiochk` = counts all non-voice officials (including AFK ones)\n `denetim` = Returns the number of members in the role and the role information\n `ytb` = You Authorize a User\n `kilit` = Allows You to Lock and Unlock the Channel\n `reklamtarama` = Lists users with Nick And Status\n `rolsüz` = Gives Roles to Non-Roles\n `ytçağır` = Sends a DM to the authorities\n `topteyit` = You Look at Total Records\n `kayıtlarım` = you can look at your own registration data\n `ad-scan` `audible` `authorized-call` `delete` `delete2` `lock` `move` `powers` `roleless` `roleplay` `snipe` `tagaldır` `tagliste`\n',

    '**Authorized Application System**\n\n  `başvur` = You Create an Application Request\n `başvuru-banla` = People who make trool etc. in the application unnecessarily will be banned from the system\n `başvuru-durum` = It turns the system on and off\n `ytb` = Provides YT when Applicants Application is Accepted',


'**Information Commands**\n\n `banlist` = You Can See the Banned Users\n `oldname` = Shows the previous name of the user you tagged\n `register-number` = Shows the number of registrations made by the user you tagged\n `registration-officer` = Shows who registered the user you tagged\n `record` = Shows the last 20 records\n `top-record` = Shows the users with the most registrations\n `warns` = Shows the warnings of the user you tagged\n `taginfo` = Shows the number of users with the given tag\n `vipisim` = Changes the nickname of the user you tagged to the VIP tag\n `age` = Shows the age of the user you tagged\n `avatar` = Shows the avatar of the user you tagged\n `analyse` = Analyzes the content of the message you sent\n `banner` = Shows the banner of the user you tagged\n `device` = Shows the devices logged into the user account\n `dm` = Sends a direct message to the user you tagged\n `fortune` = Throws Fortune Cookie\n',

'**Talent Commands**\n\n `designer` = Gives Designer Role to User\n `musician` = Gives Musician Role to User\n `sponsor` = Gives Sponsor Role to User\n `streamer` = Gives Streamer Role to User\n `tagged` = Gives Tagged Role to User\n `vip` = Gives VIP Role to User\n',

'**Ticket Commands**\n\n `ticket` = You Can Open a Ticket\n',

'**Penal Commands**\n\n `ban` = You ban the user\n `jail` = You Arrest the User to Criminal\n `mute` = You Mute the User in Chat\n `tmban` = You Banish the User to a More Terrible Place\n `unban` = You Can Unban Banned User\n `unjail` = You Remove the User from Silivri\n `unmute` = You unmute users\n `unvmute` = You turn on users mute on audio channels\n `user-reset` = You can remove the user from the registration channel after registration\n `vckick` = kicks a user on the voice channel from that channel\n `vmute` = You Mute the User on Audio Channels\n `warn` = You Warn the User\n',

'**Advanced Commands**\n\n `ad-scan` = Scans the Channel for Ads\n `audible` = You Listen to Music on Audio Channels\n `authorized-call` = allows authorized personnel to make a voice call\n `delete2` = Deletes as many messages as you specify from the user you tagged.\n `lock` = Allows You to Lock and Unlock the Channel\n `move` = Moves the user you tagged to the specified voice channel\n `powers` = You Can see the Powers You Have\n `roleless` = Removes roles from all users on the server\n `roleplay` = Allows the user to have a role play channel\n `snipe` = Throws the last deleted message\n `tagaldır` = Removes the tag from the user you tagged\n `tagliste` = Shows the list of available tags\n',

'**Apply Commands**\n\n `application-status` = Checks the status of your application\n `apply` = You can apply for an authorized\n `apply-ban` = You Can Ban User for Excessive Use of Application Command\n `byardım` = Gives information about using the application system\n',

'**Stat Commands**\n\n `stats` = Checks the stats of server\n `top10` = Checks the top stats of server\n',

'**Destek Commands**\n\n `livesupport`= you can do live chat by this command\n',


'**DC Commands**\n\n `td`= you can play truth or Dare\n',

'**Prefix-less Commands (from the isdatamod bot)**\n\n Type these without `#`:\n `Salam` / `Assalamu Alaikum` = greeting reply\n `invite` / `invt` = server invite link\n `help` = how to get help\n `Command` / `cmd` = moderator command list (mods)\n `info @user` = user info (mods)\n `nickname` / `nik` @user [name] = change nickname (mods)\n `warn @user reason` = DM warning (mods)\n `mute` / `unmute` @user = mute role (mods)\n `kick @user` / `bannow @user` = kick / ban (owner role)\n `verifygirl` / `removegirl` @user = sister role\n `#addqa Q: A` / `#removeqa Q` / `#qastatus` = Q&A database (mods)\n `#ta text [bangla]` = text to speech (mods)\n\n**Auto reactions (from the autorcdc bot)** run automatically in the configured channels.\n',

'**Owner Commands**\n\n `activechk`= Checks the activity status of a user on a server.\n `addroleall` = Adds a specified role to all members of a server.\n  `adprotection` = Enables or disables ad protection for a server.\n `audiochk` = Checks the audio settings of a user on a server.\n `dmrole-message` = Sends a direct message to a specific role on the server.\n `eval` = Allows users to evaluate and execute code within the context of the bot.\n `ip` = Displays the IP address of a user on the server.\n `limited-role` = Assigns a limited role to a user on the server.\n `reboot` = Restarts the bot.\n `removeroleall` = Removes a specified role from all members of a server.\n `sound-draw` = Plays a random sound effect in the voice channel.\n `swear` = Automatically censors inappropriate language on the server.\n `taginfo` = Displays information about a specific user on the server.\n `toplanti` = Starts a voice meeting or conference on the server\n `trusted` = Assigns a trusted role to a user on the server.\n `voting` = Starts a poll or voting session on the server.\n `yetkiver` = Assigns a specified role to a user on the server.\n', ]




module.exports = {
    name: 'help',
    aliases: ["help","h","hlp"],
    execute: async (client, message, args, _embed, author, channel, guild) => {
    let page = 1
    const embed = new Discord.MessageEmbed()
        .setColor("#00FF00")
        .setThumbnail(client.user.avatarURL({ dynamic: true }))
        .setFooter(`🏡 Total ${pages.length} Pages | 🔴 Live Now ${page}. Page`)
        .setDescription(pages[page - 1])
        .setColor("RANDOM")

    message.channel.send({ embed }).then(msg => {
        msg.react('⬅').then(r => {
            msg.react('➡')

            const backwardsFilter = (reaction, user) => reaction.emoji.name === '⬅' && user.id === message.author.id
            const forwardsFilter = (reaction, user) => reaction.emoji.name === '➡' && user.id === message.author.id

            const backwards = msg.createReactionCollector(backwardsFilter, { time: 120000 })
            const forwards = msg.createReactionCollector(forwardsFilter, { time: 120000 })

            backwards.on('collect', (r, u) => {
                if (page === 1) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                page--
                embed.setDescription(pages[page - 1])
                embed.setFooter(`🏡 Total ${pages.length} Pages | 🔴 Live Now ${page}. Page`)
                msg.edit(embed)
                r.users.remove(r.users.cache.filter(u => u === message.author).first())
            })

            forwards.on('collect', (r, u) => {
                if (page === pages.length) return r.users.remove(r.users.cache.filter(u => u === message.author).first())
                page++
                embed.setDescription(pages[page - 1])
                embed.setFooter(`🏡 Total ${pages.length} Pages | 🔴 Live Now ${page}. Page`)
                msg.edit(embed)
                r.users.remove(r.users.cache.filter(u => u === message.author).first())
            })
        })
    })
} }