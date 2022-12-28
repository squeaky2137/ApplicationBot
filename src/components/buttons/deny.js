const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "deny",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { deniedColor, deniedRoles, requiredRoles } = config;
      const { guild, message, user } = interaction;

      const applicant = await guild.members.fetch(
        message.embeds[0].fields[5].value
          .split("\n")[2]
          .split(" ")[4]
          .replace("`", "")
          .replace("`", "")
      );

      await applicant.roles.remove(requiredRoles);
      await applicant.roles.add(deniedRoles);

      message.edit({
        content: `Application denied by ${user}`,
        embeds: [EmbedBuilder.from(message.embeds[0]).setColor(deniedColor)],
        components: [],
      });

      applicant.send({
        content: `Your application has been denied.`,
      });

      if (!message.thread) return;

      if (message.thread.messages.cache.size <= 1) {
        message.thread.delete();
      } else {
        message.thread.setLocked(true, "Application denied");
        message.thread.setArchived(true, "Application denied");
      }
    } catch (error) {
      if (error.code === 10007) {
        interaction.reply({
          content: "The applicant is no longer in the server.",
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