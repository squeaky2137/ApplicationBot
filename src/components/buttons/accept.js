const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "accept",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { acceptedColor } = config;
      const { guild, message, user } = interaction;
      const { acceptedRoles, requiredRoles } = config.Applications[message.embeds[0].footer.text.split(" | ")[0]];

      const applicant = await guild.members.fetch(
        message.embeds[0].fields[message.embeds[0].fields.length-1].value
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

      await applicant.send({
        content: `Congratulations, your application has been accepted!`,
      });
      
      if (!message.thread) return;

      if (message.thread.messages.cache.size <= 1) {
        await message.thread.delete();
      } else {
        await message.thread.setLocked(true, "Application accepted");
        await message.thread.setArchived(true, "Application accepted");
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