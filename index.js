const { Client, GatewayIntentBits } = require('discord.js');
const { 
    joinVoiceChannel, 
    createAudioPlayer, 
    createAudioResource,
    NoSubscriberBehavior
} = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildVoiceStates
    ]
});

// 無音を流し続けるバッファ
const SILENCE = Buffer.from([0xF8, 0xFF, 0xFE]);

client.on('messageCreate', async (message) => {
    if (message.content === '!join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply("先にボイスチャンネルに入ってください！");

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play
            }
        });

        // 無音を再生し続ける
        setInterval(() => {
            const resource = createAudioResource(SILENCE);
            player.play(resource);
        }, 1000);

        connection.subscribe(player);
        message.reply("VC に入りました！（永遠に残ります）");
    }
});

client.login(process.env.BOT_TOKEN);
