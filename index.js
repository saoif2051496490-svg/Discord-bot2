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
        GatewayIntentBits.GuildVoiceStates,
    ]
});

// 本物の無音（Discord公式もこれ使う）
const SILENCE_FRAME = Buffer.from([0xF8, 0xFF, 0xFE]);

client.on('messageCreate', async (message) => {
    if (message.content === '!join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply("先に VC に入ってください。");

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfMute: false,
            selfDeaf: true,
        });

        const player = createAudioPlayer({
            behaviors: {
                noSubscriber: NoSubscriberBehavior.Play,
            }
        });

        // 無音フレームを連続的に送り続ける
        setInterval(() => {
            const resource = createAudioResource(SILENCE_FRAME);
            player.play(resource);
        }, 500); // 0.5秒に1回 → 確実に活動扱い

        connection.subscribe(player);
        message.reply('VC に入り続けます！');
    }
});

client.login(process.env.BOT_TOKEN);
