const {
  ButtonBuilder,
  ButtonStyle: { Success },
  EmbedBuilder,
  PermissionFlagsBits: { Administrator },
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("applymessage")
    .setDescription("Sends the apply message")
    .setDMPermission(false),
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { channel, guild, member } = interaction;
      const { acceptedColor, applyMessage } = client.config;

      if (!member.permissions.has(Administrator))
        return interaction.reply({
          content: "You don't have permission to use this command.",
          ephemeral: true,
        });

      const components = new ActionRowBuilder();
      if (Object.keys(config.Applications).length === 1) {
        components.setComponents(
          new ButtonBuilder()
            .setCustomId("application")
            .setLabel("Apply")
            .setStyle(Success)
        );
      } else {
        const selectMenu = new StringSelectMenuBuilder()
          .setCustomId("application")
          .setPlaceholder("Select an application")
          .setMaxValues(1);
        Object.entries(config.Applications).forEach(([key, value]) => {
          selectMenu.addOptions({
            label: key,
            description: value.description,
            value: key,
          });
        });
        components.setComponents(selectMenu);
      }
      await channel.send({
        embeds: [
          new EmbedBuilder()
            .setTitle(`${guild.name} | Application`)
            .setColor(acceptedColor)
            .setDescription(applyMessage)
            .setFooter({
              text: `${guild.name} | Application`,
              iconURL: guild.iconURL({ size: 512 }),
            })
            .setTimestamp(),
        ],
        components: [components],
      });

      interaction.reply({
        content: "Application message sent!",
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