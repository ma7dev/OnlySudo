module.exports = {
	name: 'ready',
	once: true,
	execute(client, mgs) {
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};