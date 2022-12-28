const { EmbedBuilder } = require("discord.js");

module.exports = {
  id: "reasonModal",
  async execute(interaction, client) {
    try {
      const { config } = client;
      const { deniedColor } = config;
      const { fields, guild, message, user } = interaction;
      const { deniedRoles, requiredRoles } = config.Applications[message.embeds[0].footer.text.split(" | ")[0]];

      const reason = fields.getTextInputValue("reason");

      const applicant = await guild.members.fetch(
        message.embeds[0].fields[message.embeds[0].fields.length-1].value
          .split("\n")[2]
          .split(" ")[4]
          .replace("`", "")
          .replace("`", "")
      );

      await applicant.roles.add(deniedRoles);
      await applicant.roles.remove(requiredRoles);

      message.edit({
        content: [
          `Application denied by ${user}`,
          `**Reason**: ${reason}`,
        ].join("\n"),
        embeds: [EmbedBuilder.from(message.embeds[0]).setColor(deniedColor)],
        components: [],
      });

      await applicant.send({
        content: [
          "Your application has been denied.",
          `**Reason**: ${reason}`,
        ].join("\n"),
      });

      interaction.reply({
        content: [
          "The citizenship application has been denied.",
          `**Reason**: ${reason}`,
        ].join("\n"),
        ephemeral: true,
      });
      
      if (!message.thread) return;

      if (message.thread.messages.cache.size <= 1) {
        await message.thread.delete();
      } else {
        await message.thread.setLocked(true, "Application denied");
        await message.thread.setArchived(true, "Application denied");
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