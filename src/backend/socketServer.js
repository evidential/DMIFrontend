const http = require('http');
const httpServer = http.createServer();
const { Server } = require('socket.io');
const devIP = 'http://localhost:3333';
const io = new Server(httpServer, {
	cors: {
		origin: [`${devIP}`]
	}
});

function startSocketServer(socketServerPort, back) {
	io.on('connection', socket => {
		console.log('a user connected');

		socket.on('ItemSeized', data => {
			console.log('ItemSeized: ', JSON.parse(data));

			back.send('item seized', JSON.parse(data));
		});

		socket.on('ItemUnseized', data => {
			console.log('ItemUnseized: ', JSON.parse(data));

			back.send('item unseized', JSON.parse(data));
		});

		socket.on('TeleportedToArea', data => {
			console.log('Area: ', JSON.parse(data));

			back.send('teleported to area', JSON.parse(data));
		});

		socket.on('ResetForNewUser', () => {
			console.log('Reset for new user');

			back.send('reset for new user');
		});
	});

	httpServer.listen(socketServerPort, () => {
		console.log(`Socket Server listening on *:${socketServerPort}`);
	});
}

function emitMessage(name, payload = null) {
	const stringifiedPayload = JSON.stringify(payload);
	console.log(`Emit message ${name}. Payload: ${stringifiedPayload}`);
	io.emit(name, stringifiedPayload);
}

function closeSocketServer() {
	httpServer.close();
	console.log('Socket Server closed');
}

module.exports = { startSocketServer, closeSocketServer, emitMessage };
