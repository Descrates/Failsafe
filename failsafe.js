//npm install discord.js
//npm install cheerio
//npm install node-pre-gyp
//npm install sqlite
//npm install sqlite3
//==================================================================================
//Updater config
const ScoreUpdateIntervalMinutes = 10;
const NumberOfRunnersToShow = 25;
//======================
//bot config
const botVersion = "0.9.0.0";
const botLoginToken = "";
const prefix = "!";
//======================
//bot Information
const Discord = require('discord.js');
const bot = new Discord.Client();
//======================
//sqlite Information
const sql = require("sqlite");
sql.open("./score.sqlite");
//==================================================================================

//bot Login Listener
bot.on('ready', () => {
    console.log("Logged in as %s - %s", bot.user.username, bot.user.id);
});
//======================

//Available Commands
var UserCommands = {
    "help": {
        name: "help",
        description: "Displays this help documentation",
        usage: "help"
    },
    "commands": {
        name: "Version .9 Commands",
        description: "help, wr, nuke, top, dailies, reset, level, glimmer, rotw are currently working.",
        usage: "Version .9 Commands"
    },
    "wr": {
        name: "wr",
        description: "Displays the top 25 speed runners of Destiny 2 sorted by number of world records",
        usage: "wr"
    },
    "purge": {
        name: "purge @user",
        description: "Removes the last 50 msgs sent by the user mentioned (@ADMIN)- Inactive",
        usage: "purge @user"
    },
    "clear": {
        name: "clear @user",
        description: "Removes the last 200 msgs sent by the user mentioned (@ADMIN)- Inactive",
        usage: "clear @user"
    },
    "nuke": {
        name: "nuke",
        description: "Removes as many msgs as possible from the channel the command is called in. (Admin Only)",
        usage: "nuke"
    },
    "top": {
        name: "top amount category",
        description: "Displays the top 3, 5, 10, or 25 server users sorted by level, glimmer, wr, or rotw",
        usage: "top amount category"
    },
    "dailies": {
        name: "dailies",
        description: "Resets everyday at 2:00 AM PST and allows users to collect their daily 200 glimmer",
        usage: "dailies"
    },
    "reset": {
        name: "reset",
        description: "Backup system that resets the dailies command and allows users to collect their daily rewards (ADMIN)",
        usage: "reset"
    },
    "level": {
        name: "level",
        description: "Displays your current level in the chat. Required amount of messages per level: 50. Max Level: 100. No spam please!",
        usage: "level"
    },
    "glimmer": {
        name: "glimmer @user",
        description: "Displays glimmer information of mentioned user",
        usage: "glimmer @user"
    },
    "rotw": {
        name: "rotw @user",
        description: "Displays the number of times the mentioned user has won Run of the Week",
        usage: "rotw @user"
    },
    "war": {
        name: "war @user <bet>",
        description: "2 users place bets, 50/50 randomization between two users, winner takes all- Inactive",
        usage: "war @user <bet>"
    },
    "glimmer+": {
        name: "glimmer+",
        description: "Reward players for helping in the community! (Admin Only)",
        usage: "glimmer++"
    },
    "winner": {
        name: "winner @user <video>",
        description: "Select the Run of the Week Winner DO NOT USE: BOT WILL CRASH (Admin Only)",
        usage: "winner @user <video>"
    },
    "LFG Self Assign": {
        name: "LFG Self Assign",
        description: "Allows users to opt into LFG notifications per console via reacting with emotes- Inactive",
        usage: "LFG Self Assign"
    },
    "ROTW": {
        name: "ROTW",
        description: "Automates RotW opening/closing based on a weekly timer and randomly assigns an emote to vote with- Inactive",
        usage: "ROTW"
    }
};
//=====================

//Command Listener & Action
bot.on("message", function (msg) {
    var Admins = msg.member.roles.some(r => ["Admin", "Developers", "Mods"].includes(r.name));
    if (msg.author.id === bot.user.id || msg.author.bot) return;
    sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => { // Level System
        if (!row) {
            sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
            //msg.channel.send(`Welcome <@${msg.author.id}>! Thank you for joining Playing Destiny Fast! You start off with 500 glimmer!`);
            console.log("new player added to database");
        } else if (msg.content.toLowerCase() === prefix + "dailies") {
            if (row.daily === 0) {
                sql.run(`UPDATE scores SET glimmer = ${row.glimmer + 200}, daily = 1 WHERE userId = ${msg.author.id}`);
                msg.reply(`has claimed their daily rewards! Total Glimmer: ${row.glimmer + 200}`);
                msg.channel.sendFile("https://i.imgur.com/jxwpX4x.png")
            } else if (row.daily === 1) {
                msg.reply(`has already claimed their daily rewards! Please try again after the daily reset: 2:00 AM PST Total: ${row.glimmer}`);
            }
        } else {
            sql.run(`UPDATE scores SET points = ${row.points + 1} WHERE userId = ${msg.author.id}`);
            let curLevel = Math.floor(0.02 * row.points + 1);
            if (row.level > 100 || curLevel > 100) { row.level = 100; msg.channel.send(`<@${msg.author.id}> has already achieved the highest level! Thank you for your continued support!`) }
            if (curLevel > row.level) {
                row.level = curLevel;
                sql.run(`UPDATE scores SET points = ${row.points + 1}, level = ${row.level} WHERE userId = ${msg.author.id}`);
                msg.reply(`has reached level ${curLevel}!`);
            }
        }
    }).catch(() => {
        console.error;
        console.log("Table doesn't exist. Compiling...");
        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
            sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
            msg.channel.send(`<@Programmer> I've encountered a critical error in the database. Please ensure that there is nothing wrong with my primary objective.`);
        });
    });
    var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
    if (msg.content.toLowerCase().substr(0, 1) === prefix) {
        var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
        if (commandArgs[0] in UserCommands) {
            switch (commandArgs[0]) {
                case "help": {//Help------------------------------------
                    msg.delete();
                    var longestc = 0;
                    var list = new Array();
                    for (var key in UserCommands) {
                        if (UserCommands[key].name.length > longestc) longestc = UserCommands[key].name.length;
                        if (UserCommands[key].name === UserCommands[key].usage) {
                            list.push([StringFormat("{nameins}{spaceins} -- {1}", ([prefix, UserCommands[key].description])), UserCommands[key].name]);
                        }
                    }
                    var fs = "\n```\n";
                    for (var i = 0; i < list.length; i++) {
                        var cname = list[i][1];
                        var nspaces = longestc - cname.length;
                        var tspaces = "";
                        var uspaces = "   ";
                        for (var j = 0; j < nspaces; j++) tspaces += " ";
                        for (var j = 0; j < longestc; j++) uspaces += " ";
                        fs += (list[i][0] + "\n").replace("{nameins}", cname).replace("{spaceins}", tspaces).replace("{usagespaceins}", uspaces);
                    }
                    fs += "```";
                    msg.channel.send(fs);
                    break;
                }
                case "wr": {//Wr-----------------------------------------
                    msg.delete();
                    var SortedScoreKeys = getSortedKeys(ScoreUpdate.ScoreHolder);
                    var SortedScoreString = "";
                    var NumShown = 0;
                    var LongestName = 0;
                    for (var i = 0; i < SortedScoreKeys.length; i++ , NumShown++) {
                        if (i >= NumberOfRunnersToShow) break;
                        var CurrentName = SortedScoreKeys[i];
                        if (CurrentName.length > LongestName) LongestName = CurrentName.length;
                    }
                    for (var i = 0; i < SortedScoreKeys.length; i++) {
                        if (i >= NumberOfRunnersToShow) break;
                        var FormattedLine = StringFormat("{0}: {1} - {2}\n", [pad(i + 1, 2), padBack(SortedScoreKeys[i], LongestName), ScoreUpdate.ScoreHolder[SortedScoreKeys[i]]]);
                        SortedScoreString += FormattedLine;
                    }
                    //

                    embed = new Discord.RichEmbed()
                        .setAuthor("Speedrun.com", "https://www.speedrun.com/themes/Default/1st.png")
                        .setColor(0x7EC0EE)
                        .setThumbnail("https://www.speedrun.com/themes/destiny2/cover-256.png")
                        .setDescription("----------------------------------------------------------------")
                        .setFooter("© Speedrun.com")
                        .addField(StringFormat("The Top {0} Speed Runners", [NumShown]), "```" + SortedScoreString + "```");
                    msg.channel.send(embed);
                    break;
                }
                case "level": {
                    if (commandArgs.length === 2) {
                        var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
                        var commandArgs2 = commandArgs[1].substr(0, 2);
                        var commandArgs1 = commandArgs[1].substr(commandArgs[1].length - 1, 1)
                        if (commandArgs2 === "<@" && commandArgs1 === ">") {
                            var mention = commandArgs[1].substr(2, commandArgs[1].length - 3);
                            sql.get(`SELECT * FROM scores WHERE userId ="${mention}"`).then(row => {
                                if (!row || row.level === 0) return msg.reply("Level: 0");
                                if (row.level > 99) return msg.channel.send(`<@${mention}> is one of our most dedicated members! Level: ${row.level}!`);
                                msg.channel.send(`<@${mention}>'s Level: ${row.level}`);
                            });
                        }
                    } else {
                        sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                            if (!row || row.level === 0) return msg.reply(``);
                            if (row.level > 99) return msg.channel.send(`Thank you <@${msg.author.id}> for being one of our most dedicated members! Level: ${row.level}!`);
                            msg.channel.send(`<@${msg.author.id}>'s Level: ${row.level}, be more active in the server to increase your level!`);
                        });
                    }
                    break;
                }
                case "glimmer": {
                    if (commandArgs.length === 2) {
                        var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
                        var commandArgs2 = commandArgs[1].substr(0, 2);
                        var commandArgs1 = commandArgs[1].substr(commandArgs[1].length - 1, 1)
                        if (commandArgs2 === "<@" && commandArgs1 === ">") {
                            var mention = commandArgs[1].substr(2, commandArgs[1].length - 3);
                            sql.get(`SELECT * FROM scores WHERE userId ="${mention}"`).then(row => {
                                if (!row || row.glimmer === 0) return msg.reply("This player doesn't have any glimmer :(");
                                if (row.glimmer > 10000) return msg.channel.send(`<@${mention}> is one of our richest members! glimmer: ${row.glimmer}!`);
                                msg.channel.send(`<@${mention}>'s glimmer: ${row.glimmer}`);
                            });
                        }
                    } else {
                        sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                            if (!row || row.glimmer === 0) return msg.reply(`You don't have any glimmer, don't forget to use the s!dailies command!`);
                            if (row.glimmer > 10000) return msg.channel.send(`Thank you <@${msg.author.id}> for being one of our most dedicated members with ${row.glimmer} glimmer!`);
                            msg.channel.send(`<@${msg.author.id}>'s glimmer: ${row.glimmer}, collect your s!dailies or win a s!war to get more!`);
                        });
                    }
                    break;
                }
                case "rotw": {
                    if (commandArgs.length === 2) {
                        var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
                        var commandArgs2 = commandArgs[1].substr(0, 2);
                        var commandArgs1 = commandArgs[1].substr(commandArgs[1].length - 1, 1)
                        if (commandArgs2 === "<@" && commandArgs1 === ">") {
                            var mention = commandArgs[1].substr(2, commandArgs[1].length - 3);
                            sql.get(`SELECT * FROM scores WHERE userId ="${mention}"`).then(row => {
                                if (!row || row.rotw === 0) return msg.reply("This player hasn't won Run of the Week :(");
                                if (row.rotw > 10) return msg.channel.send(`<@${mention}> is one of our flashiest members! ROTW: ${row.rotw}!`);
                                msg.channel.send(`<@${mention}>'s ROTW: ${row.rotw}`);
                            });
                        }
                    } else {
                        sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                            if (!row || row.rotw === 0) return msg.reply(`You haven't won any ROTW, see the rules for how to apply!`);
                            if (row.rotw > 10000) return msg.channel.send(`Thank you <@${msg.author.id}> for being one of our flashiest members with ${row.rotw} ROTW!`);
                            msg.channel.send(`<@${msg.author.id}>'s ROTW: ${row.rotw}!`);
                        });
                    }
                    break;
                }
                case "glimmer+": {
                    if (!msg.member.roles.some(r => ["Admins"].includes(r.name))) {
                        return msg.reply("Sorry, you don't have permissions to use this!");
                    }
                    if (commandArgs.length === 2) {
                        var amount = commandArgs[1];
                        if (isNaN(amount)) {
                            msg.channel.send(`Please enter a valid number`);
                        } else if (amount > 500) {
                            msg.channel.send(`This tool is for debugging. See the <@Programmer> for a temperary bypass`);
                        } else if (amount > 0) {
                            sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                                sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${msg.author.id}`);
                            }).catch(() => {
                                console.error;
                                console.log("Table doesn't exist. Compiling...");
                                sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
                                    sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
                                    sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${msg.author.id}`);
                                    msg.channel.send(`<@Programmer> I've encountered a critical error in the database. Please ensure that there is nothing wrong with my primary objective.`);
                                });
                            });;
                            msg.reply(`Be careful to avoid abusing the system, your name and number of executions are being logged.`);
                            console.log(`<@${msg.author.id}> has used the glimmer+ command for their personal gain!`);
                        } else {
                            sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                                sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${msg.author.id}`);
                            }).catch(() => {
                                console.error;
                                console.log("Table doesn't exist. Compiling...");
                                sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
                                    sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
                                    sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${msg.author.id}`);
                                    msg.channel.send(`<@Programmer> I've encountered a critical error in the database. Please ensure that there is nothing wrong with my primary objective.`);
                                });
                            });;
                            msg.reply(`Wise Choice`);
                            console.log(`<@${msg.author.id}> has used the glimmer+ command to remove their glimmer!`);
                        }
                    } else if (commandArgs.length === 3) {
                        var mention = commandArgs[1].substr(2, commandArgs[1].length - 3);
                        var amounts = commandArgs[2];
                        var amount = Number(`${amounts}`);
                        if (isNaN(amount)) {
                            msg.channel.send(`Please enter a valid number`);
                        } else if (amount > 2000) {
                            msg.channel.send(`Please reward players with the amount of glimmer that reflects their contribution!`);
                        } else if (amount > 0) {
                            sql.get(`SELECT * FROM scores WHERE userId ="${mention}"`).then(row => {
                                sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${mention}`);
                            }).catch(() => {
                                console.error;
                                console.log("Table doesn't exist. Compiling...");
                                sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
                                    sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
                                    sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${mention}`);
                                    msg.channel.send(`<@Programmer> I've encountered a critical error in the database. Please ensure that there is nothing wrong with my primary objective.`);
                                });
                            });
                            msg.channel.send(`<@${msg.author.id}> has rewarded <@${mention}> for their contribution to this amazing community!`);
                        } else {
                            sql.get(`SELECT * FROM scores WHERE userId ="${mention}"`).then(row => {
                                sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${mention}`);
                            }).catch(() => {
                                console.error;
                                console.log("Table doesn't exist. Compiling...");
                                sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
                                    sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
                                    sql.run(`UPDATE scores SET glimmer = ${row.glimmer + amount} WHERE userId = ${mention}`);
                                    msg.channel.send(`<@Programmer> I've encountered a critical error in the database. Please ensure that there is nothing wrong with my primary objective.`);
                                });
                            });;
                            msg.channel.send(`<@${msg.author.id}> has penalized <@${mention}> by removing ${amount} glimmer!`);
                        }
                    }
                    break;
                }
                case "reset": {
                    if (!msg.member.roles.some(r => ["Admins"].includes(r.name))) {
                        return msg.reply("Sorry, you don't have permissions to use this!");
                    }
                    sql.run(`UPDATE scores SET daily = 0`);
                    msg.channel.send("Daily reset! Everyone can accept the daily rewards!");
                    break;
                }
                case "nuke": {
                    if (!msg.member.roles.some(r => ["Admins"].includes(r.name))) {
                        return msg.reply("WHOA! Hang on kid, only adults can make this decision!");
                    }
                    nuke().then(() => {
                        console.error;
                        console.log("Nuclear Bomb Detonated");
                        return;
                    });
                    async function nuke() {
                        msg.delete();
                        msg.channel.send("Nuclear Launch System Initiated: 1 Minute until Total Annihilation").then(
                            setTimeout(function () {
                                for (i = 0; i < 10; i++) {
                                    msg.delete();
                                    msg.channel.fetchMessages(100)
                                        .then(function (fetched) {
                                            msg.channel.bulkDelete(fetched);
                                        });
                                }
                            }, 3000));
                    }
                    break;
                }
                case "top": {
                    var commandArgs = msg.content.toLowerCase().substr(1).split(" ");
                    var cat = commandArgs[2];
                    var amount = commandArgs[1];
                    var tops = [];
                    if (isNaN(amount)) {
                        msg.reply(`Please enter a valid **number** and category after the command: s!top 3-25 levels, glimmer, wr, or ROTW`);
                        return;
                    } else if (amount > 25) {
                        amount = 25
                    } else if (amount < 3) {
                        amount = 3
                    }
                    if (cat === "level") {
                        sql.all(`SELECT name, level FROM scores ORDER BY level DESC LIMIT ${amount}`).then(rows => {
                            tops.length = 0;
                            rows.forEach(function (row) {
                                tops.push(`\n ${row.name} -- ${row.level}`);
                            });
                            embed = new Discord.RichEmbed()
                                .setAuthor(`Failsafe`)
                                .setColor(0x7EC0EE)
                                .setThumbnail("https://i.imgur.com/1XPQkeC.jpg")
                                .setDescription("----------------------------------------------------------------")
                                .setFooter("")
                                .addField(StringFormat(`Top ${amount} Users: ${cat}`, [NumShown]), "```" + tops.join('') + "```");
                            msg.channel.send(embed);
                        });
                    } else if (cat === "glimmer") {
                        sql.all(`SELECT name, glimmer FROM scores ORDER BY glimmer DESC LIMIT ${amount}`).then(rows => {
                            tops.length = 0;
                            rows.forEach(function (row) {
                                tops.push(`\n ${row.name} -- ${row.glimmer}`);
                            });
                            embed = new Discord.RichEmbed()
                                .setAuthor(`Failsafe`)
                                .setColor(0x7EC0EE)
                                .setThumbnail("https://i.imgur.com/1XPQkeC.jpg")
                                .setDescription("----------------------------------------------------------------")
                                .setFooter("")
                                .addField(StringFormat(`Top ${amount} Users: ${cat}`, [NumShown]), "```" + tops.join('') + "```");
                            msg.channel.send(embed);
                        });
                    } else if (cat === "wr") {
                        sql.all(`SELECT name, wr FROM scores ORDER BY wr DESC LIMIT ${amount}`).then(rows => {
                            tops.length = 0;
                            rows.forEach(function (row) {
                                tops.push(`\n ${row.name} -- ${row.wr}`);
                            });
                            embed = new Discord.RichEmbed()
                                .setAuthor(`Failsafe`)
                                .setColor(0x7EC0EE)
                                .setThumbnail("https://i.imgur.com/1XPQkeC.jpg")
                                .setDescription("----------------------------------------------------------------")
                                .setFooter("")
                                .addField(StringFormat(`Top ${amount} Users: ${cat}`, [NumShown]), "```" + tops.join('') + "```");
                            msg.channel.send(embed);
                        });
                    } else if (cat === "rotw") {
                        sql.all(`SELECT name, rotw FROM scores ORDER BY rotw DESC LIMIT ${amount}`).then(rows => {
                            tops.length = 0;
                            rows.forEach(function (row) {
                                tops.push(`\n ${row.name} -- ${row.rotw}`);
                            });
                            embed = new Discord.RichEmbed()
                                .setAuthor(`Failsafe`)
                                .setColor(0x7EC0EE)
                                .setThumbnail("https://i.imgur.com/1XPQkeC.jpg")
                                .setDescription("----------------------------------------------------------------")
                                .setFooter("")
                                .addField(StringFormat(`Top ${amount} Users: ${cat}`, [NumShown]), "```" + tops.join('') + "```");
                            msg.channel.send(embed);
                        });
                    } else { msg.channel.send(`Please enter a valid category: level, glimmer, wr, or rotw.`); }
                    break;
                }
                case "winner": {
                    msg.delete();
                    if (!msg.member.roles.some(r => ["Admins"].includes(r.name))) {
                        return msg.reply("Sorry, you don't have permissions to use this!");
                    }
                    var mention = commandArgs[1].substr(2, commandArgs[1].length - 3);
                    sql.get(`SELECT * FROM scores WHERE userId ="${msg.author.id}"`).then(row => {
                        sql.run(`UPDATE scores SET rotw = ${row.rotw + 1} WHERE userId = ${mention}`);
                    }).catch(() => {
                        console.error;
                        console.log("Table doesn't exist. Compiling...");
                        sql.run("CREATE TABLE IF NOT EXISTS scores (userId TEXT, daily INTEGER, points INTEGER, level INTEGER, glimmer INTEGER, wr INTEGER, rotw INTEGER, name TEXT)").then(() => {
                            sql.run("INSERT INTO scores (userId, daily, points, level, glimmer, wr, rotw, name) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [msg.author.id, 0, 0, 0, 0, 0, 0, msg.author.username]);
                            sql.run(`UPDATE scores SET rotw = ${row.rotw + 1} WHERE userId = ${mention}`);
                        });
                    });;
                    var winners = [202768362676289536, 180125630883561472];
                    let role1 = msg.guild.roles.find("name", "RotW Winner");
                    let role2 = msg.guild.roles.find("name", "Run of the Week");
                    var roles = [role1, role2];
                    msg.mention.member.addRole(roles).catch(console.error);
                    if (winners[1].member.roles === member.roles.some(r => ["RotW Winner"].includes(r.name))) {
                        winners[1].removeRole(role1).catch(console.error);
                    }

                    msg.channel.send(`<@${mention}> has won Run of the Week! Check out their amazing video at ${commandArgs[2]}`);
                    break;
                }
                case ("war"): {//War---------------------------------------
                    if (commandArgs.length === 3) {
                        currency = parseInt(commandArgs[2]);
                        if (currency !== NaN) {
                            if (commandArgs[1].substr(0, 2) === "<@" && commandArgs[1].substr(commandArgs[1].length - 1, 1) === ">") {
                                WarHandler.InitiateWar(msg.author.id, commandArgs[1].substr(2, commandArgs[1].length - 3), currency, (e, c, w) => {
                                    if (e === true) {
                                        if (c === 200) {
                                            if (w.Winner === msg.author.id) {
                                                msg.reply(StringFormat("You have triumphed in the war against <@{0}>!", [w.Loser]));
                                            } else {
                                                msg.reply(StringFormat("<@{0}> has won the war.", [w.Winner]));
                                            }

                                        } else {
                                            msg.reply("Your war with {0} has begun!", [commandArgs[1]]);
                                        }
                                    } else {
                                        if (c === 0) {
                                            console.log("This should never happen");
                                        } else if (c === 1) {
                                            msg.reply("Insufficient glimmer to start war");
                                        } else {
                                            throw "Unhandled error code from WarHandler in war command";
                                        }
                                    }
                                });
                            } else {
                                msg.reply("Supplied username must be an `@` mention");
                            }
                        } else {
                            msg.reply("Invalid command. See help documentation");
                        }
                    } else {
                        msg.reply("This command requires more arguments");
                    }
                }
            }
        }
    }
});

var WarHandler = {
    InitiateWar: function (InitiateID, OpponentID, CurrencyAmount, callback) {
        //Error codes:
        //0: Success (no error)
        //1: Insufficient Currency
        //Success codes:
        //200: War has been decided 
        sql.get(`SELECT glimmer FROM scores WHERE userId ="${InitiateID}"`).then(row => {
            if (row.glimmer < CurrencyAmount) {
                callback(false, 1, null);
                return;
            } else {
                for (var i = 0; i < this.Data.OngoingWars.length; i++) {
                    var WarCheck = this.Data.OngoingWars[i];
                    if (WarCheck.Initiate[0] === InitiateID && WarCheck.Opponent[0] === OpponentID) {
                        this.Data.OngoingWars[i] = {
                            Initate: [WarCheck.Initiate[0], WarCheck.Initiate[1] + CurrencyAmount],
                            Opponent: [WarCheck.Opponent[0], WarCheck.Opponent[1]]
                        };
                    } else if (WarCheck.Initiate[0] === OpponentID && WarCheck.Opponent[0] === InitiateID) {
                        this.Data.OngoingWars[i] = {
                            Initate: [WarCheck.Initiate[0], WarCheck.Initiate[1]],
                            Opponent: [WarCheck.Opponent[0], WarCheck.Opponent[1] + CurrencyAmount]
                        };
                        var WarWinner = DoWar(i);
                        //If glimmer is added back into the winner, add it here using the returned Winner ID
                        callback(true, 200, DoWar(i));
                        return;
                    } else {
                        this.Data.OngoingWars.push({
                            Initate: [InitiateID, CurrencyAmount],
                            Opponent: [OpponentID, 0]
                        });
                    }
                }
                callback(true, 0);
            }
        }).catch(() => {
            console.log("Error fetching glimmer");
        });
    },
    DoWar: function (WarID) {
        var CurrentWar = this.Data.OngoingWars[WarID];
        var InitiateBid = CurrentWar.Initiate[1];
        var OpponentBid = CurrentWar.Opponent[1];
        var DecidingInteger = GetRandomIntInclusive(0, InitiateBid + OpponentBid);
        if (DecidingInteger > 0 && DecidingInteger <= InitiateBid) {
            this.Data.OngoingWars[WarID] = this.Data.OngoingWars[WarID].splice(WarID, 1);
            return { Winner: CurrentWar.Initiate[0], Loser: CurrentWar.Opponent[0] };
        } else if (DecidingInteger > InitiateBid && DecidingInteger <= OpponentBid) {
            this.Data.OngoingWars[WarID] = this.Data.OngoingWars[WarID].splice(WarID, 1);
            return { Winner: CurrentWar.Opponent[0], Loser: CurrentWar.Initiate[0] };
        } else {
            console.log("War error");
        }
    },
    Data: {
        //Structure
        //OngoingWars: [{
        //  Initate: [userid, currency],
        //  Opponent: [userid, currency]
        //}]
        OngoingWars: []
    }
}

var ScoreUpdate = {
    https: require('https'),
    cheerio: require('cheerio'),
    URIs: {
        IndividualLevels: "/destiny2/individual_levels",
        SoloLeaderboardNG: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48990&region=&console=&variable14561=48433&loadtimes=0&emulator=0&video=&obsolete=",
        SoloLeaderboardNGP: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48990&region=&console=&variable14561=48435&loadtimes=0&emulator=0&video=&obsolete=",
        DuoLeaderboardNG: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48991&region=&console=&variable14561=48433&loadtimes=0&emulator=0&video=&obsolete=",
        DuoLeaderboardNGP: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48991&region=&console=&variable14561=48435&loadtimes=0&emulator=0&video=&obsolete=",
        FireTeamNG: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48992&region=&console=&variable14561=48433&loadtimes=0&emulator=0&video=&obsolete=",
        FireTeamNGP: "/ajax_leaderboard.php?game=destiny2&verified=1&category=48992&region=&console=&variable14561=48435&loadtimes=0&emulator=0&video=&obsolete="
    },
    ScoreHolder: [],
    NumUpdatersDone: 0,
    UpdateScores: function () {
        console.log("Updated scores at " + (new Date(Number(new Date()))));
        this.ScoreHolder = [];
        this.NumUpdatersDone = 0;
        this.GetIndividualLevelsData();
        this.GetSoloDataNG();
        this.GetSoloDataNGP();
        this.GetDuoDataNG();
        this.GetDuoDataNGP();
        this.GetFireTeamNG();
        this.GetFireTeamNGP();
        this.TimerHolder = setInterval(function () { ScoreUpdate.CheckUpdaters() }, 500);
    },
    TimerHolder: null,
    CheckUpdaters: function () {
        if (this.NumUpdatersDone < 7) return;
        this.NumUpdatersDone = 0;
        clearInterval(this.TimerHolder);
    },
    GetIndividualLevelsData: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.IndividualLevels,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetSoloDataNG: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.SoloLeaderboardNG,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetSoloDataNGP: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.SoloLeaderboardNGP,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetDuoDataNG: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.DuoLeaderboardNG,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetDuoDataNGP: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.DuoLeaderboardNGP,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetFireTeamNG: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.FireTeamNG,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    },
    GetFireTeamNGP: function () {
        var options = {
            hostname: "www.speedrun.com",
            path: this.URIs.FireTeamNGP,
            method: "GET",
        }
        var req = this.https.request(options, (res) => {
            var data = "";
            res.on('data', (reqd) => {
                data += reqd;
            });
            res.on('end', () => {
                var $ = this.cheerio.load(data);
                $('.username').each(function (i, e) {
                    var CurrentName = $(this).text();
                    if (ScoreUpdate.ScoreHolder.hasOwnProperty(CurrentName)) {
                        ScoreUpdate.ScoreHolder[CurrentName] += 1;
                    } else {
                        ScoreUpdate.ScoreHolder[CurrentName] = 1;
                    }
                });
                ScoreUpdate.NumUpdatersDone++;
            });
        });

        req.on('error', (err) => {
            console.error("bot::Error loading data -> " + err);
            ScoreUpdate.NumUpdatersDone++;
        });
        req.end();
    }
}

ScoreUpdate.UpdateScores();
setTimeout(function () { ScoreUpdate.UpdateScores(); }, (ScoreUpdateIntervalMinutes) * 60 * 1000);
bot.login(botLoginToken);


//================
//Custom string functions
//================
function Replace(a, b, c) {
    return a.split(b).join(c);
}
function StringFormat(a, b) { //c# string.Format imeplementation using an array for b
    var count = b.length;
    var newstr = a;
    for (var i = 0; i < count; i++) {
        var currentelement = "{" + i + "}";
        newstr = Replace(newstr, currentelement, b[i]);
    }
    return newstr;
}
function pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
}
function padBack(string, size) {
    var s = string;
    while (s.length < size) s = s + " ";
    return s;
}
//================
//Custom string functions
//================

//================
//JS functions
//================
function getSortedKeys(obj) {
    var keys = []; for (var key in obj) keys.push(key);
    return keys.sort(function (a, b) { return obj[b] - obj[a] });
}
//================
//JS functions
//================
