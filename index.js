const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel, createAudioPlayer, createAudioResource } = require('@discordjs/voice');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

const silentBuffer = Buffer.from([0xF8, 0xFF, 0xFE]);

client.on('messageCreate', async message => {
    if (message.content === '!join') {
        const channel = message.member.voice.channel;
        if (!channel) return message.reply("先に VC に入ってください。");

        const connection = joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator
        });

        const player = createAudioPlayer();

        setInterval(() => {
            const resource = createAudioResource(silentBuffer);
            player.play(resource);
        }, 1000);

        connection.subscribe(player);
        message.reply("VC に入りました！（永遠に残ります）");
    }
});

client.login(process.env.BOT_TOKEN);
