require('dotenv').config()
const { Client, Intents } = require('discord.js');
const { exec } = require("child_process");

const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MESSAGE_REACTIONS] });

client.once('ready', () => {
	console.log('Ready');
});

client.on('message', (message) => {
// console.log(message);
	// console.log(message.channelId);
//	console.log(client.channels.fetch(message.channelId));
	//	Check if message is from specified channel on server
	// console.log(message.author.bot)

	// If Message Is Not From Bot
	if (!message.author.bot)
	{
		client.channels.fetch(message.channelId)
		.then(channel => {
			console.log(channel.name)

			// Clear tmux.log File
			exec(`cat /dev/null > /tmp/tmux.log`, (error, stdout, stderr) => {
				if (error) {
					console.log(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					console.log(`stderr: ${stderr}`);
				}
				console.log(`stdout: ${stdout}`);

				// Send Command to Server
				exec(`tmux send -t mc_server ${message.content} ENTER`, (error, stdout, stderr) => {
					if (error) {
						console.log(`error: ${error.message}`);
						return;
					}
					if (stderr) {
						console.log(`stderr: ${stderr}`);
					}
					console.log(`stdout: ${stdout}`);

					// Read Server Command Output After Timeout
					setTimeout(() => {
						exec(`cat /tmp/tmux.log`, (error, stdout, stderr) => {
							if (error) {
								console.log(`error: ${error.message}`);
								return;
							}
							if (stderr) {
								console.log(`stderr: ${stderr}`);
							}
							console.log(`stdout: ${stdout}`);
							message.channel.send(stdout);
						})
					}, 1000);
					// exec(`cat /tmp/tmux.log`, (error, stdout, stderr) => {
					// 	if (error) {
					// 		console.log(`error: ${error.message}`);
					// 		return;
					// 	}
					// 	if (stderr) {
					// 		console.log(`stderr: ${stderr}`);
					// 	}
					// 	console.log(`stdout: ${stdout}`);
					// })
				})
			})

		});
	}
	else {
		return;
	}
});

client.login(process.env.BOT_KEY);
