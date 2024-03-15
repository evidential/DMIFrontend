const back = require('androidjs').back;
const { startFileServer, closeFileServer } = require('./backend/fileServer');
const { startSocketServer, closeSocketServer, emitMessage } = require('./backend/socketServer');

const webServerPort = 4201;
const socketServerPort = 3334;

async function initialiseBackend() {
	// Cleanup in case
	closeSocketServer();
	closeFileServer();

	startSocketServer(socketServerPort, back);
	const fileServerPath = await startFileServer(webServerPort);
	console.log(fileServerPath);

	back.send('file server started', fileServerPath);
}

back.on('ready', async () => {
	await initialiseBackend();
});

back.on('FireToggle', Payload => {
	emitMessage('FireToggle', Payload);
});


