const { 
  EmbedBuilder, 
  PermissionFlagsBits,
  TextDisplayBuilder,
  ContainerBuilder,
  MessageFlags
} = require('discord.js');

module.exports = {
  name: 'task',
  description: 'Manage voice channel tasks',
  usage: '.v task [info]',
  async execute(message, args, client) {
    const { redis } = require('../../redisClient');
    
    const voiceChannel = message.member.voice.channel;
    if (!voiceChannel) {
      // === DISCORD COMPONENTS V2 ERROR PANEL ===
      const titleText = new TextDisplayBuilder()
        .setContent('# ⚠️ Voice Channel Required');
        
      const contentText = new TextDisplayBuilder()
        .setContent(`
> **You must be in a voice channel to manage tasks!**

**What to do:**
• Join any voice channel in this server
• Make sure you're connected to voice
• Then use the task command again

**Usage:** \`.v task [info]\`
        `);
        
      const footerText = new TextDisplayBuilder()
        .setContent('OneTab - Voice management | Join a voice channel to continue');

      const container = new ContainerBuilder()
        .addTextDisplayComponents(titleText, contentText, footerText);

      return message.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container]
      });
    }

    try {
      // Get task information from Redis
      const taskInfo = await redis.get(`task:${voiceChannel.id}`);
      
      if (!taskInfo) {
        // === DISCORD COMPONENTS V2 INFO PANEL ===
        const titleText = new TextDisplayBuilder()
          .setContent('# ℹ️ No Active Tasks');
          
        const contentText = new TextDisplayBuilder()
          .setContent(`
> **No active tasks found for this channel!**

**Channel:** <#${voiceChannel.id}>

**What this means:**
• No tasks are currently running
• Channel is operating normally
• Tasks will be created automatically when needed
          `);
          
        const footerText = new TextDisplayBuilder()
          .setContent('OneTab - Voice management | No active tasks');

        const container = new ContainerBuilder()
          .addTextDisplayComponents(titleText, contentText, footerText);

        return message.reply({
          flags: MessageFlags.IsComponentsV2,
          components: [container]
        });
      }

      // Parse task information
      const task = JSON.parse(taskInfo);
      
      // === DISCORD COMPONENTS V2 SUCCESS PANEL ===
      const titleText = new TextDisplayBuilder()
        .setContent('# 📋 Task Information');
        
      const contentText = new TextDisplayBuilder()
        .setContent(`
> **Active Task Information**

**Channel:** <#${voiceChannel.id}>
**Task Type:** ${task.type || 'Unknown'}
**Status:** ${task.status || 'Active'}
**Started:** <t:${Math.floor(task.startTime / 1000)}:R>

**Task Details:**
• **Duration:** ${task.duration || 'N/A'}
• **Progress:** ${task.progress || 'N/A'}
• **Last Update:** <t:${Math.floor((task.lastUpdate || Date.now()) / 1000)}:R>

**Note:** Tasks are managed automatically by the system.
        `);
        
      const footerText = new TextDisplayBuilder()
        .setContent('OneTab - Voice management | Task information');

      const container = new ContainerBuilder()
        .addTextDisplayComponents(titleText, contentText, footerText);

      return message.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container]
      });
      
    } catch (error) {
      console.error('[TASK] Error:', error);
      
      // === DISCORD COMPONENTS V2 ERROR PANEL ===
      const titleText = new TextDisplayBuilder()
        .setContent('# ❌ Error');
        
      const contentText = new TextDisplayBuilder()
        .setContent(`
> **Failed to get task information!**

**Error:** ${error.message}

**What to do:**
• Try again in a few moments
• Contact an administrator if the problem persists
        `);
        
      const footerText = new TextDisplayBuilder()
        .setContent('OneTab - Voice management | Error getting task info');

      const container = new ContainerBuilder()
        .addTextDisplayComponents(titleText, contentText, footerText);

      return message.reply({
        flags: MessageFlags.IsComponentsV2,
        components: [container]
      });
    }
  }
};
