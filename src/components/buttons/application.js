const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle: { Short },
} = require("discord.js");

module.exports = {
  id: "application",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { acceptedRoles, requiredRoles, restrictedRoles } = config;
      const {
        guild,
        member: { roles },
        user,
      } = interaction;

      if (roles.cache.some((role) => acceptedRoles.includes(role.id))) {
        return interaction.reply({
          content: "You already have the accepted role(s).",
          ephemeral: true,
        });
      } else if (
        roles.cache.some((role) => restrictedRoles.includes(role.id))
      ) {
        return interaction.reply({
          content: "You're restricted from applying for this application.",
          ephemeral: true,
        });
      } else if (!roles.cache.some((role) => requiredRoles.includes(role.id))) {
        return interaction.reply({
          content: "You don't have the required role(s) to apply.",
          ephemeral: true,
        });
      }

      user.startApplication = Date.now();
      interaction.showModal(
        new ModalBuilder()
          .setCustomId("applicationModal")
          .setTitle(`${guild.name} | Application`)
          .setComponents(
            new ActionRowBuilder().addComponents(
              new TextInputBuilder()
                .setCustomId("question1")
                .setLabel("Question 1")
                .setMinLength(3)
                .setMaxLength(16)
                .setStyle(Short)
                .setRequired(true)
            )
          )
      );
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "An error occurred, please try again.",
        ephemeral: true,
      });
    }
  },
};
