const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
  TextDisplayBuilder,
  MessageFlags,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  SeparatorBuilder,
  AttachmentBuilder,
  SectionBuilder,
  ThumbnailBuilder,
  ContainerBuilder
} = require('discord.js');
const { detailPages } = require('../../utils/helpPages');

// ===== EMOJIS CENTRALISÉS =====
const EMOJIS = {
  // Catégories principales
  VOICE: '🔊',
  BLACKLIST: '⛔',
  WHITELIST: '✅',
  MANAGER: '🤝',
  FEATURES: '✨',
  SETUP: '🛠️',
  ADMIN: '🛡️',
  TASK: '📋',

  // Actions
  ADD: '➕',
  REMOVE: '➖',
  LIST: '📋',
  CLEAR: '🧹',
  ARROW: '➡️',

  // Commandes
  CHANNEL: '🔈',
  LIMIT: '👥',
  RESET: '♻️',
  INFO: 'ℹ️',
  OWNER: '👑',
  LOCK: '🔒',
  UNLOCK: '🔓',
  RENAME: '📝',
  SETTINGS: '⚙️',
  MUTE: '🔇',
  UNMUTE: '🔊',
  HIDE: '🙈',
  UNHIDE: '👁️',
  PERMIT: '✅',
  REJECT: '⛔',
  PERMITROLE: '🟢',
  REJECTROLE: '🔴',
  TLOCK: '💬',
  TUNLOCK: '💬',
  REQUEST: '📩',
  KICK: '👢',
  FM: '🔇',
  FUNM: '🔊',
  CLAIM: '🏆',
  TRANSFER: '👑',
  STATUS: '📝',
  CAM: '📷',
  STREAM: '😤',
  SB: '🔊',
  LISTLINK: '🔗'
};

// ===== MAPPING DES ALIAS =====
const aliasMap = {
  commands: 'commands',
  bl: 'blacklist',
  blacklist: 'blacklist',
  wl: 'whitelist',
  whitelist: 'whitelist',
  'co-owners': 'manager',
  coowners: 'manager',
  manager: 'manager',
  man: 'manager',
  setup: 'setup',
  admin: 'admin',
  features: 'features',
  task: 'task',
  lb: 'leaderboard',
  leaderboard: 'leaderboard'
};

// ===== FONCTION PRINCIPALE =====
module.exports = {
  name: 'help',
  description: 'Show help menu for voice channel commands',
  usage: '.v help [category]',

  async execute(message, args, client) {
    // Gestion des sous-commandes textuelles
    if (args[0]) {
      const key = args[0].toLowerCase();
      const pageKey = aliasMap[key];

      if (pageKey && detailPages[pageKey]) {
        const page = detailPages[pageKey];

        // === DISCORD COMPONENTS V2 RESPONSE (comme dans voiceStateUpdate.js) ===
        // Thumbnail pour les pages de détail (URL directe)

        const titleText = new TextDisplayBuilder().setContent(`# ${page.title}`);
        const contentText = new TextDisplayBuilder().setContent(page.content);
        const footerText = new TextDisplayBuilder().setContent(page.footer);

        // Section principale avec thumbnail (comme dans voiceStateUpdate.js)
        const detailSection = new SectionBuilder()
          .addTextDisplayComponents(titleText, contentText)
          .setThumbnailAccessory(
            thumbnail => thumbnail
              .setDescription(`${page.title} - Help System`)
              .setURL('https://cdn.discordapp.com/attachments/1406646913201209374/1414178170378125383/telechargement_2.gif')
          );

        const backButton = new ButtonBuilder()
          .setCustomId('help_back_to_main')
          .setLabel('← Back to Main Menu')
          .setStyle(ButtonStyle.Secondary)
          .setEmoji('🏠');

        const separator = new SeparatorBuilder().setDivider(true);
        const buttonActionRow = new ActionRowBuilder().addComponents(backButton);

        // Container principal (comme dans voiceStateUpdate.js)
        const detailContainer = new ContainerBuilder()
          .addSectionComponents(detailSection)
          .addTextDisplayComponents(footerText)
          .addSeparatorComponents(separator)
          .addActionRowComponents(buttonActionRow);

        return message.channel.update({
          flags: MessageFlags.IsComponentsV2,
          components: [detailContainer]
        });
      }
    }

    // Gestion du menu de sélection pour afficher toutes les commandes d'un type
    if (args[0] === 'all') {
      const commandType = args[1]?.toLowerCase();
      if (commandType) {
        const commands = getCommandsByType(commandType);
        if (commands.length > 0) {
          return displayAllCommands(message, commands, commandType);
        }
      }
    }

    // === PANEL PRINCIPAL HELP (DISCORD COMPONENTS V2) ===
    const serverName = message.guild.name;

    // Thumbnail pour le message help principal (URL directe)

    // --- Main Help Components (comme dans voiceStateUpdate.js) ---
    const titleText = new TextDisplayBuilder().setContent(`# <a:bitri9:1477098438876463306>  ${serverName} Help Commands`);

    const descriptionText = new TextDisplayBuilder().setContent(
      `> **<a:life:1477097354543763680> Welcome to Sorane OneTab Voice Management System!**
> **•  Create instant temporary voice channels with advanced controls**
> **•  Share management with trusted users and block unwanted guests**

**<a:fleche:1477101417696333934> My Prefix:** \`.v\``
    );

    const footerText = new TextDisplayBuilder().setContent(`<a:ta2ir:1477100378142015538> OneTab - Voice management | Use the menu below to navigate`);

    // Section principale avec thumbnail (comme dans voiceStateUpdate.js)
    const mainSection = new SectionBuilder()
      .addTextDisplayComponents(titleText, descriptionText)
      .setThumbnailAccessory(
        thumbnail => thumbnail
          .setDescription('Help System - Voice Management')
          .setURL('https://cdn.discordapp.com/attachments/1459203343472922688/1477099695242219614/telechargement.gif')
      );

    // --- Interactive Components ---
    const selectMenuOptions = [
      {
        label: 'Voice Commands',
        description: 'All voice channel management commands',
        value: 'voice',
        emoji: EMOJIS.VOICE
      },
      {
        label: 'Blacklist System',
        description: 'Block users from your voice channels',
        value: 'blacklist',
        emoji: EMOJIS.BLACKLIST
      },
      {
        label: 'Whitelist System',
        description: 'Allow only trusted users',
        value: 'whitelist',
        emoji: EMOJIS.WHITELIST
      },
      {
        label: 'Manager System',
        description: 'Share channel management with trusted users',
        value: 'manager',
        emoji: EMOJIS.MANAGER
      },
      {
        label: 'Voice Features',
        description: 'Enable activities, camera, soundboard, etc.',
        value: 'features',
        emoji: EMOJIS.FEATURES
      },
      {
        label: 'Setup Commands',
        description: 'Server administrator configuration',
        value: 'setup',
        emoji: EMOJIS.SETUP
      },
      {
        label: 'Admin Commands',
        description: 'Server-wide management tools',
        value: 'admin',
        emoji: EMOJIS.ADMIN
      },
      {
        label: 'Task System',
        description: 'Staff task management system',
        value: 'task',
        emoji: EMOJIS.TASK
      }
    ];

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('help-category-select')
      .setPlaceholder('🔍 Choose a help category')
      .addOptions(selectMenuOptions.map(option =>
        new StringSelectMenuOptionBuilder()
          .setLabel(option.label)
          .setValue(option.value)
          .setDescription(option.description)
          .setEmoji(option.emoji)
      ));

    const supportButton = new ButtonBuilder()
      .setLabel('Support Server')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/wyWGcKWssQ');

    const inviteButton = new ButtonBuilder()
      .setLabel('Invite Bot')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/wyWGcKWssQ');

    const voteButton = new ButtonBuilder()
      .setLabel('Vote')
      .setStyle(ButtonStyle.Link)
      .setURL('https://discord.gg/wyWGcKWssQ');

    const separator = new SeparatorBuilder().setDivider(true);

    const menuActionRow = new ActionRowBuilder().addComponents(selectMenu);
    const buttonActionRow = new ActionRowBuilder().addComponents(supportButton, inviteButton, voteButton);

    // === MESSAGE HELP PRINCIPAL AVEC DISCORD COMPONENTS V2 ===
    // Test si Discord Components V2 est supporté
    const isComponentsV2Supported = typeof MessageFlags.IsComponentsV2 !== 'undefined';

    if (isComponentsV2Supported) {
      try {
        // Container principal (comme dans voiceStateUpdate.js)
        const mainContainer = new ContainerBuilder()
          .addSectionComponents(mainSection)
          .addSeparatorComponents(separator)
          .addTextDisplayComponents(footerText)
          .addSeparatorComponents(separator)
          .addActionRowComponents(menuActionRow, buttonActionRow);

        const sentMessage = await message.channel.send({
          flags: MessageFlags.IsComponentsV2,
          components: [mainContainer]
        });

        // Création du collector pour les boutons et menus
        const collector = sentMessage.createMessageComponentCollector({
          time: 300_000 // 5 minutes
        });

        collector.on('collect', async interaction => {
          if (interaction.user.id !== message.author.id) {
            return interaction.reply({
              content: '❌ Only the command author can use these buttons.',
              ephemeral: true
            });
          }

          // Gestion des boutons d'action rapide
          if (interaction.isButton()) {
            // Gestion du bouton "Back to Main Menu"
            if (interaction.customId === 'help_back_to_main') {
              // Revenir au menu principal avec la méthode de voiceStateUpdate.js
              const serverName = message.guild.name;

              // Thumbnail pour le menu principal (URL directe)

              const titleText = new TextDisplayBuilder().setContent(`# <a:bitri9:1477098438876463306> Sorae Help `);
              const descriptionText = new TextDisplayBuilder().setContent(
                `> **<a:life:1477097354543763680> Welcome to OneTab Voice Management System!**
> **•  Create instant temporary voice channels with advanced controls**
> **•  Lock, hide, mute, and customize your private voice space**
> **•  Share management with trusted users and block unwanted guests**

**<a:fleche:1477101417696333934> My Prefix:** \`.v\``
              );
              const footerText = new TextDisplayBuilder().setContent(`<a:ta2ir:1477100378142015538> OneTab - Voice management | Use the menu below to navigate`);

              // Section principale avec thumbnail (comme dans voiceStateUpdate.js)
              const mainSection = new SectionBuilder()
                .addTextDisplayComponents(titleText, descriptionText)
                .setThumbnailAccessory(
                  thumbnail => thumbnail
                    .setDescription('Help System - Voice Management')
                    .setURL('https://cdn.discordapp.com/attachments/1406646913201209374/1414178170378125383/telechargement_2.gif')
                );

              const selectMenuOptions = [
                { label: 'Voice Commands', description: 'All voice channel management commands', value: 'voice', emoji: EMOJIS.VOICE },
                { label: 'Blacklist System', description: 'Block users from your voice channels', value: 'blacklist', emoji: EMOJIS.BLACKLIST },
                { label: 'Whitelist System', description: 'Allow only trusted users', value: 'whitelist', emoji: EMOJIS.WHITELIST },
                { label: 'Manager System', description: 'Share channel management with trusted users', value: 'manager', emoji: EMOJIS.MANAGER },
                { label: 'Voice Features', description: 'Enable activities, camera, soundboard, etc.', value: 'features', emoji: EMOJIS.FEATURES },
                { label: 'Setup Commands', description: 'Server administrator configuration', value: 'setup', emoji: EMOJIS.SETUP },
                { label: 'Admin Commands', description: 'Server-wide management tools', value: 'admin', emoji: EMOJIS.ADMIN },
                { label: 'Task System', description: 'Staff task management system', value: 'task', emoji: EMOJIS.TASK }
              ];

              const selectMenu = new StringSelectMenuBuilder()
                .setCustomId('help-category-select')
                .setPlaceholder('🔍 Choose a help category')
                .addOptions(selectMenuOptions.map(option =>
                  new StringSelectMenuOptionBuilder()
                    .setLabel(option.label)
                    .setValue(option.value)
                    .setDescription(option.description)
                    .setEmoji(option.emoji)
                ));

              const supportButton = new ButtonBuilder()
                .setLabel('Support Server')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/wyWGcKWssQ');

              const inviteButton = new ButtonBuilder()
                .setLabel('Invite Bot')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/wyWGcKWssQ');

              const voteButton = new ButtonBuilder()
                .setLabel('Vote')
                .setStyle(ButtonStyle.Link)
                .setURL('https://discord.gg/wyWGcKWssQ');

              const separator = new SeparatorBuilder().setDivider(true);
              const menuActionRow = new ActionRowBuilder().addComponents(selectMenu);
              const buttonActionRow = new ActionRowBuilder().addComponents(supportButton, inviteButton, voteButton);

              // Container principal (comme dans voiceStateUpdate.js)
              const mainContainer = new ContainerBuilder()
                .addSectionComponents(mainSection)
                .addSeparatorComponents(separator)
                .addTextDisplayComponents(footerText)
                .addSeparatorComponents(separator)
                .addActionRowComponents(menuActionRow, buttonActionRow);

              try {
                await interaction.update({
                  flags: MessageFlags.IsComponentsV2,
                  components: [mainContainer]
                });
                return;
              } catch (error) {
                if (error.code === 10062) {
                  return;
                }
                throw error;
              }
            }

            const pageKey = interaction.customId.replace('help_', '');
            const page = detailPages[pageKey];

            if (page) {
              // Page de détail avec la méthode de voiceStateUpdate.js
              // Thumbnail pour les pages de détail (URL directe)

              const titleText = new TextDisplayBuilder().setContent(`# ${page.title}`);
              const contentText = new TextDisplayBuilder().setContent(page.content);
              const footerText = new TextDisplayBuilder().setContent(page.footer);

              // Section principale avec thumbnail (comme dans voiceStateUpdate.js)
              const detailSection = new SectionBuilder()
                .addTextDisplayComponents(titleText, contentText)
                .setThumbnailAccessory(
                  thumbnail => thumbnail
                    .setDescription(`${page.title} - Help System`)
                    .setURL('https://cdn.discordapp.com/attachments/1406646913201209374/1414178170378125383/telechargement_2.gif')
                );

              const backButton = new ButtonBuilder()
                .setCustomId('help_back_to_main')
                .setLabel('← Back to Main Menu')
                .setStyle(ButtonStyle.Secondary)
                .setEmoji('🏠');

              const separator = new SeparatorBuilder().setDivider(true);
              const buttonActionRow = new ActionRowBuilder().addComponents(backButton);

              // Container principal (comme dans voiceStateUpdate.js)
              const detailContainer = new ContainerBuilder()
                .addSectionComponents(detailSection)
                .addTextDisplayComponents(footerText)
                .addSeparatorComponents(separator)
                .addActionRowComponents(buttonActionRow);

              try {
                await interaction.update({
                  flags: MessageFlags.IsComponentsV2,
                  components: [detailContainer]
                });
                return;
              } catch (error) {
                if (error.code === 10062) {
                  return;
                }
                throw error;
              }
            }
          }

          // Gestion du menu de sélection (géré dans interactionCreate.js)
          if (interaction.isStringSelectMenu()) {
            return;
          }
        });

        collector.on('end', async () => {
          try {
            // Ne rien faire à la fin du collector pour garder les boutons visibles
          } catch (_) { }
        });
      } catch (error) {
        console.error('[HELP] Discord Components V2 Error:', error);
        // Fallback vers un message simple
        return message.reply({
          content: `# <a:bitri9:1477098438876463306> Help Commands | ${serverName}

> **<a:life:1477097354543763680> Welcome to OneTab Voice Management System!**
> **•  Create instant temporary voice channels with advanced controls**
> **•  Lock, hide, mute, and customize your private voice space**
> **•  Share management with trusted users and block unwanted guests**

**<a:fleche:1477101417696333934> My Prefix:** \`.v\`

### 🔊 Voice Commands
• \`.v help commands\` — All voice channel commands

### ⛔ Blacklist System  
• \`.v help bl\` — Blacklist management commands

### ✅ Whitelist System
• \`.v help wl\` — Whitelist management commands

### 🤝 Manager System
• \`.v help manager\` — Co-owner management commands

### ✨ Voice Features
• \`.v help features\` — Activities, camera, streaming, soundboard

### 🛠️ Setup & Admin
• \`.v help setup\` — Setup commands
• \`.v help admin\` — Admin commands

### 🔗 Support & Links
• [Support Server](https://discord.gg/wyWGcKWssQ) — Get help
• [Invite Bot](https://discord.gg/wyWGcKWssQ) — Add to your server  
• [Vote](https://discord.gg/wyWGcKWssQ) — Support us

**OneTab - Voice management | Use .v help [category]**`
        });
      }
    } else {
      // Fallback si Discord Components V2 n'est pas supporté
      return message.reply({
        content: `# <a:bitri9:1477098438876463306> Help Commands | ${serverName}

> **<a:life:1477097354543763680> Welcome to OneTab Voice Management System!**
> **•  Create instant temporary voice channels with advanced controls**
> **•  Lock, hide, mute, and customize your private voice space**
> **•  Share management with trusted users and block unwanted guests**

**<a:fleche:1477101417696333934> My Prefix:** \`.v\`

### 🔊 Voice Commands
• \`.v help commands\` — All voice channel commands

### ⛔ Blacklist System  
• \`.v help bl\` — Blacklist management commands

### ✅ Whitelist System
• \`.v help wl\` — Whitelist management commands

### 🤝 Manager System
• \`.v help manager\` — Co-owner management commands

### ✨ Voice Features
• \`.v help features\` — Activities, camera, streaming, soundboard

### 🛠️ Setup & Admin
• \`.v help setup\` — Setup commands
• \`.v help admin\` — Admin commands

### 🔗 Support & Links
• [Support Server](https://discord.gg/wyWGcKWssQ) — Get help
• [Invite Bot](https://discord.gg/wyWGcKWssQ) — Add to your server  
• [Vote](https://discord.gg/wyWGcKWssQ) — Support us

**OneTab - Voice management | Use .v help [category]**`
      });
    }
  }
};

// ===== FONCTIONS AUXILIAIRES =====

// Fonction pour récupérer les commandes par type
function getCommandsByType(type) {
  const commands = {
    voice: [
      { name: 'lock', description: 'Lock your voice channel', usage: '.v lock' },
      { name: 'unlock', description: 'Unlock your voice channel', usage: '.v unlock' },
      { name: 'hide', description: 'Hide your voice channel', usage: '.v hide' },
      { name: 'unhide', description: 'Unhide your voice channel', usage: '.v unhide' },
      { name: 'limit', description: 'Set user limit for your channel', usage: '.v limit <number>' },
      { name: 'name', description: 'Rename your voice channel', usage: '.v name <new_name>' },
      { name: 'claim', description: 'Claim ownership of channel', usage: '.v claim' },
      { name: 'transfer', description: 'Transfer channel ownership', usage: '.v transfer <user>' },
      { name: 'kick', description: 'Kick user from channel', usage: '.v kick <user>' },
      { name: 'mute', description: 'Mute user in channel', usage: '.v mute <user>' },
      { name: 'unmute', description: 'Unmute user in channel', usage: '.v unmute <user>' }
    ],
    blacklist: [
      { name: 'blacklist add', description: 'Add user to blacklist', usage: '.v blacklist add <user>' },
      { name: 'blacklist remove', description: 'Remove user from blacklist', usage: '.v blacklist remove <user>' },
      { name: 'blacklist list', description: 'List blacklisted users', usage: '.v blacklist list' },
      { name: 'blacklist clear', description: 'Clear blacklist', usage: '.v blacklist clear' }
    ],
    whitelist: [
      { name: 'whitelist add', description: 'Add user to whitelist', usage: '.v whitelist add <user>' },
      { name: 'whitelist remove', description: 'Remove user from whitelist', usage: '.v whitelist remove <user>' },
      { name: 'whitelist list', description: 'List whitelisted users', usage: '.v whitelist list' },
      { name: 'whitelist clear', description: 'Clear whitelist', usage: '.v whitelist clear' }
    ],
    manager: [
      { name: 'manager add', description: 'Add co-owner', usage: '.v manager add <user>' },
      { name: 'manager remove', description: 'Remove co-owner', usage: '.v manager remove <user>' },
      { name: 'manager list', description: 'List co-owners', usage: '.v manager list' },
      { name: 'manager clear', description: 'Clear co-owners', usage: '.v manager clear' }
    ],
    features: [
      { name: 'activity on', description: 'Enable activities', usage: '.v activity on' },
      { name: 'activity off', description: 'Disable activities', usage: '.v activity off' },
      { name: 'cam on', description: 'Enable camera', usage: '.v cam on' },
      { name: 'cam off', description: 'Disable camera', usage: '.v cam off' },
      { name: 'stream on', description: 'Enable stream', usage: '.v stream on' },
      { name: 'stream off', description: 'Disable stream', usage: '.v stream off' },
      { name: 'sb on', description: 'Enable soundboard', usage: '.v sb on' },
      { name: 'sb off', description: 'Disable soundboard', usage: '.v sb off' }
    ],
    setup: [
      { name: 'setup', description: 'Setup the bot', usage: '.v setup' },
      { name: 'setup reset', description: 'Reset setup', usage: '.v setup reset' },
      { name: 'setup show', description: 'Show current setup', usage: '.v setup show' }
    ],
    admin: [
      { name: 'admin reset', description: 'Reset bot configuration', usage: '.v admin reset' },
      { name: 'admin stats', description: 'Show bot statistics', usage: '.v admin stats' }
    ],
    task: [
      { name: 'task add', description: 'Add a new task', usage: '.v task add <task>' },
      { name: 'task list', description: 'List all tasks', usage: '.v task list' },
      { name: 'task complete', description: 'Mark task as complete', usage: '.v task complete <id>' },
      { name: 'task delete', description: 'Delete a task', usage: '.v task delete <id>' }
    ]
  };

  return commands[type] || [];
}

// Fonction pour afficher toutes les commandes d'un type
async function displayAllCommands(target, commands, type) {
  const typeNames = {
    voice: 'Voice Commands',
    blacklist: 'Blacklist System',
    whitelist: 'Whitelist System',
    manager: 'Manager System',
    features: 'Voice Features',
    setup: 'Setup Commands',
    admin: 'Admin Commands',
    task: 'Task System'
  };

  const titleText = new TextDisplayBuilder().setContent(`# ${typeNames[type] || type}`);
  const commandsText = new TextDisplayBuilder().setContent(
    commands.map(cmd => `**\`${cmd.usage}\`** — ${cmd.description}`).join('\n')
  );
  const footerText = new TextDisplayBuilder().setContent(`Use .v help to return to main menu`);

  const backButton = new ButtonBuilder()
    .setCustomId('help_back_to_main')
    .setLabel('← Back to Main Menu')
    .setStyle(ButtonStyle.Secondary)
    .setEmoji('🏠');

  const separator = new SeparatorBuilder().setDivider(true);
  const buttonActionRow = new ActionRowBuilder().addComponents(backButton);

  const commandsSection = new SectionBuilder()
    .addTextDisplayComponents(titleText, commandsText)
    .setThumbnailAccessory(
      thumbnail => thumbnail
        .setDescription(`${typeNames[type] || type} - All Commands`)
        .setURL('https://cdn.discordapp.com/attachments/1406646913201209374/1414178170378125383/telechargement_2.gif')
    );

  const commandsContainer = new ContainerBuilder()
    .addSectionComponents(commandsSection)
    .addTextDisplayComponents(footerText)
    .addSeparatorComponents(separator)
    .addActionRowComponents(buttonActionRow);

  // Check if target is interaction or message
  if (target.isStringSelectMenu && target.isStringSelectMenu()) {
    return target.update({
      flags: MessageFlags.IsComponentsV2,
      components: [commandsContainer]
    });
  } else {
    return target.channel.send({
      flags: MessageFlags.IsComponentsV2,
      components: [commandsContainer]
    });
  }
}

// Export the helper functions
module.exports.getCommandsByType = getCommandsByType;
module.exports.displayAllCommands = displayAllCommands;
