const { Client, Partials } = require("discord.js");

const client = new Client({
  intents: ["Guilds", "GuildMembers", "GuildMessages", "MessageContent"],
  partials: [Partials.Channel],
});

client.config = require("./config.json");
console.clear();

client.login(client.config.token);
console.log("Ready");