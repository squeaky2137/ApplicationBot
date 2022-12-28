const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "accept",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { acceptedColor, acceptedRoles, requiredRoles } = config;
      const { guild, message, user } = interaction;

      const applicant = await guild.members.fetch(
        message.embeds[0].fields[5].value
          .split("\n")[2]
          .split(" ")[4]
          .replace("`", "")
          .replace("`", "")
      );

      await applicant.roles.remove(requiredRoles);
      await applicant.roles.add(acceptedRoles);

      message.edit({
        content: `Application accepted by ${user}`,
        embeds: [EmbedBuilder.from(message.embeds[0]).setColor(acceptedColor)],
        components: [],
      });

      applicant.send({
        content: `Congratulations, your application has been accepted!`,
      });
      
      if (!message.thread) return;

      if (message.thread.messages.cache.size <= 1) {
        message.thread.delete();
      } else {
        message.thread.setLocked(true, "Application accepted");
        message.thread.setArchived(true, "Application accepted");
      }
    } catch (error) {
      if (error.code === 10007) {
        interaction.reply({
          content: "The applicant is no longer in the server",
          ephemeral: true,
        });
      } else {
        console.log(error);
        interaction.reply({
          content:
            "An unknown error occurred, check the console for more information.",
          ephemeral: true,
        });
      }
    }
  },
};