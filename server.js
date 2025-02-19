const express = require('express');
const { Client, GatewayIntentBits } = require('discord.js');
const app = express();
const port = 3000;

const botToken = 'YOUR_BOT_TOKEN';  
const guildId = 'YOUR_GUILD_ID';    

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

client.login(botToken);

app.get('/updateRole', async (req, res) => {
    const { userId, status, message } = req.query;

    try {
        const guild = await client.guilds.fetch(guildId);
        const member = await guild.members.fetch(userId);

        if (status === 'success') {
            const role = guild.roles.cache.find(role => role.name === '인증됨');  
            if (role) {
                await member.roles.add(role);
                res.json({ success: true, message: '인증 성공, 역할 부여 완료' });
            } else {
                res.json({ success: false, message: '역할을 찾을 수 없습니다.' });
            }
        } else if (status === 'error') {
            res.json({ success: false, message: `인증 실패: ${message}` });
            const logChannel = await guild.channels.fetch('YOUR_LOG_CHANNEL_ID');  
            logChannel.send(`<@${userId}>님의 인증이 실패하였습니다. 이유: ${message}`);
        } else {
            res.json({ success: false, message: '잘못된 상태 값입니다.' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: '서버 오류' });
    }
});

app.listen(port, () => {
    console.log(`서버가 http://localhost:${port}에서 실행 중입니다.`);
});
