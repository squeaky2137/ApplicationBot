const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle: { Paragraph },
} = require("discord.js");

module.exports = {
  id: "denyWithReason",
  async execute(interaction) {
    try {
      interaction.showModal(
        new ModalBuilder()
          .setCustomId("reasonModal")
          .setTitle(`${interaction.guild.name} | Application`)
          .setComponents(
            new ActionRowBuilder().setComponents(
              new TextInputBuilder()
                .setCustomId("reason")
                .setLabel("Denial Reason")
                .setMinLength(1)
                .setMaxLength(1000)
                .setStyle(Paragraph)
            )
          )
      );
    } catch (error) {
      console.log(error);
      interaction.reply({
        content:
          "An unknown error occurred, check the console for more information.",
        ephemeral: true,
      });
    }
  },
};