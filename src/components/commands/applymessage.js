const {
  ButtonBuilder,
  ButtonStyle: { Success },
  EmbedBuilder,
  PermissionFlagsBits: { Administrator },
  SlashCommandBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("applymessage")
    .setDescription("Sends the apply message")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const { channel, guild, member } = interaction;
      const { acceptedColor, applicationMessage } = client.config;

      if (!member.permissions.has(Administrator))
        return interaction.reply({
          content: "You don't have permission to use this command.",
          ephemeral: true,
        });

      channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${guild.name} | Application`)
            .setColor(acceptedColor)
            .setDescription(applicationMessage)
            .setFooter({
              text: `${guild.name} | Application`,
              iconURL: guild.iconURL({ size: 512 }),
            })
            .setTimestamp(),
        ],
        components: [
          new ButtonBuilder()
            .setCustomId("application")
            .setLabel("Apply")
            .setStyle(Success),
        ],
      });

      interaction.reply({
        content: "Application message sent!",
        ephemeral: true,
      });
    } catch (error) {
      interaction.reply({
        content: ["**Error**", `\`\`\`js\n${error}\`\`\``].join("\n"),
        ephemeral: true,
      });
    }
  },
};
