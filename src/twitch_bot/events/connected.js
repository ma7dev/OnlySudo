module.exports = { 
    name: 'connected',
    once: true,
    async execute(client, address, port) {
        console.log(`Logged in as ${address, port}!`);
    } 
};
