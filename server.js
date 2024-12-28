import { createServer } from 'node:http';
import { app } from './src/app.js';

// Config
const port = 2605;

const server = createServer(app);
server.listen(port, () => {
  console.log(`Backend started at http://localhost:${port}`);
});
