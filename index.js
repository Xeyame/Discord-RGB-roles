const Discord = require("discord.js");
const client = new Discord.Client();
const config = require("./config.json");

client.on("ready", () => {
  console.log(`Bot has started.`);
  client.user.setActivity(`RGBhelp | RGBifing ${client.guilds.size} servers`);
});

client.on("message", async message => {
  if(message.author.bot) return;

  if(message.content.toUpperCase().indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(message.author.id != message.guild.ownerID) {
    message.reply("This bot can only be used by the server owner.")
    return;
  }

  if (command === "help") {
    const Embed = new Discord.RichEmbed()
        .setTitle("Command help")
        .addField("`" + config.prefix + 'addRoles <name> <amount>`', 'Add <amount> of roles in rainbow, called "<name> <count>". Add "true" to the end to seperate the roles in the user list.')
        .addField("`" + config.prefix + 'removeRoles <name> <amount>`', 'Remove <amount> of roles , called "<name> <count>"')
        .addField("`" + config.prefix + 'invite`', 'Get an invite link for me!')
        .setFooter('All <amounts> are limited to 100. | Bot made by Xeyame#7391')
        .setColor("#fffa00")
    await message.channel.send({ embed: Embed });
  }

  if (command === "invite") {
    const Embed = new Discord.RichEmbed()
        .addField("Add me", "https://discordapp.com/api/oauth2/authorize?client_id=" + config.client_id + "&permissions=8&scope=bot", true)
        .setColor("#fffa00")
    await message.channel.send({ embed: Embed });
  }

  if (command === "addroles") {
    if (typeof args[0] != 'string') {
      message.reply("Usage: `" + config.prefix + 'addRoles <name> <amount>`');
      return
    }

    var amount = Number(args[1]);

    if (amount > 100) {
      message.reply("Invalid amount.");
      return
    }
    if (amount < 5) {
      message.reply("Invalid amount.");
      return
    }

message.reply("Adding " + args[1] + " roles named " + args[0] + " <count>")

var hsl = require('hsl-to-rgb-for-reals')
const rgbHex = require('rgb-hex');
    var count;
    var multiplier = 360 / amount;
    //add from last to first so its ordered correctly
    for (var count=amount;count >= 1;count--) {
      var step = count * multiplier - 1;
      var color = "#" + rgbHex(hsl(step, 1, 0.5).toString())

      if (message.guild.roles.find('name', args[0] + " " + count)) {
        message.reply("Role `" + args[0] + " " + count + "` Already found.")
        return
      }

      if (args[2]) {
        message.guild.createRole({
          name: args[0] + " " + count,
          color: color,
          hoist: true,
        })
      } else {
        message.guild.createRole({
          name: args[0] + " " + count,
          color: color,
        })
      }

      const addColorEmbed = new Discord.RichEmbed()
          .setTitle("Added role")
          .setColor(color)
          .setDescription(args[0] + " " + count)
      await message.channel.send({ embed: addColorEmbed });
    }
  }


  if (command === "removeroles") {
    if (typeof args[0] != 'string') {
      message.reply("Usage: `" + config.prefix + 'removeRoles <name> <amount>`');
      return
    }

    var amount = Number(args[1]);

    if (amount > 100) {
      message.reply("Invalid amount.");
      return
    }
    if (amount < 5) {
      message.reply("Invalid amount.");
      return
    }

message.reply("Removing " + args[1] + " roles named " + args[0] + " <count>")

var hsl = require('hsl-to-rgb-for-reals')
const rgbHex = require('rgb-hex');
    var count;
    var multiplier = 360 / amount;
    for (var count=amount;count >= 1;count--) {
      var step = count * multiplier - 1;
      var color = "#" + rgbHex(hsl(step, 1, 0.5).toString())

      if (message.guild.roles.find('name', args[0] + " " + count)) {
        message.guild.roles.find('name', args[0] + " " + count).delete()
        const removeColorEmbed = new Discord.RichEmbed()
            .setTitle("Deleted role")
            .setColor(color)
            .setDescription(args[0] + " " + count)
        await message.channel.send({ embed: removeColorEmbed });
      } else {
        message.reply("Couldn't find role `" + args[0] + " " + count + "`.")
      }
    }
  }
});

client.login(process.env.rgbbot_token); //export rgbbot_token=TOKEN
