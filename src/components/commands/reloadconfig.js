const {
  PermissionFlagsBits: { Administrator },
  SlashCommandBuilder,
} = require("discord.js");
const fs = require("fs");
const yaml = require("yaml");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reloadconfig")
    .setDescription("Reload the configuration file")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const { member } = interaction;

      if (!member.permissions.has(Administrator))
        return interaction.reply({
          content: "You don't have permission to use this command.",
          ephemeral: true,
        });
      const configFile = fs.readFileSync("./config.yml", "utf8");
      client.config = yaml.parse(configFile);
      interaction.reply({
        content: "Reloaded configuration file",
        ephemeral: true,
      });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "An error occurred, check the console for more information.",
        ephemeral: true,
      });
    }
  },
};