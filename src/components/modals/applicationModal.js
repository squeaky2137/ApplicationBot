const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle: { Danger, Success },
  EmbedBuilder,
} = require("discord.js");
const { formatMilliseconds } = require("format-ms");

module.exports = {
  id: "applicationModal",
  async execute(interaction, client) {
    try {
      const { fields, guild, member, user } = interaction;
      const { config } = client;
      const { applicationChannel, pendingColor, mentionRole } = config;

      const question1 = fields.getTextInputValue("question1");
      const question2 = fields.getTextInputValue("question2");
      const question3 = fields.getTextInputValue("question3");
      const question4 = fields.getTextInputValue("question4");
      const question5 = fields.getTextInputValue("question5");

      await guild.channels.cache
        .get(applicationChannel)
        .send({
          content: `<@&${mentionRole}>`,
          embeds: [
            new EmbedBuilder()
              .setAuthor({
                name: guild.name,
                iconURL: guild.iconURL({ size: 512 }),
              })
              .setTitle(`**${user.tag}'s Application**`)
              .setColor(pendingColor)
              .setThumbnail(user.displayAvatarURL({ size: 512 }))
              .setFields(
                {
                  name: "Question 1",
                  value: question1,
                },
                {
                  name: "Question 2",
                  value: question2,
                },
                {
                  name: "Question 3",
                  value: question3,
                },
                {
                  name: "Question 4",
                  value: question4,
                },
                {
                  name: "Question 5",
                  value: question5,
                },
                {
                  name: "Application Statistics",
                  value: [
                    `> 📋 **Application Duration**: \`${formatMilliseconds(
                      Date.now() - user.startApplication,
                      { ignore: ["millisecond"] }
                    )}\``,
                    `> 🧑 **User**: ${user}`,
                    `> 💳 **User ID**: \`${user.id}\``,
                    `> 🤝 **Member Since**: <t:${parseInt(
                      member.joinedTimestamp / 1000
                    )}:R>`,
                    `> 📅 **Account Created**: <t:${parseInt(
                      user.createdTimestamp / 1000
                    )}:R>`,
                  ].join("\n"),
                }
              )
              .setFooter({
                text: `${guild.name} | Application`,
                iconURL: guild.iconURL({ size: 512 }),
              })
              .setTimestamp(),
          ],
          components: [
            new ActionRowBuilder().setComponents(
              new ButtonBuilder()
                .setCustomId("accept")
                .setLabel("Accept")
                .setStyle(Success),
              new ButtonBuilder()
                .setCustomId("deny")
                .setLabel("Deny")
                .setStyle(Danger),
              new ButtonBuilder()
                .setCustomId("denyWithReason")
                .setLabel("Deny With Reason")
                .setStyle(Danger)
            ),
          ],
        })
        .then(async (msg) => {
          msg.startThread({
            name: `${user.tag}'s Application`,
            autoArchiveDuration: 1440,
            reason: `${user.tag}'s Application`,
          });

          interaction.reply({
            content:
              "Thank you for submitting your application! We'll get back to you as soon as possible.",
            ephemeral: true,
          });
        });
    } catch (error) {
      console.log(error);
      interaction.reply({
        content: "An error occurred, please try again later.",
        ephemeral: true,
      });
    }
  },
};