import { createServer } from 'node:http';

import { app } from '#app/app.ts';
import { env } from '#app/env.ts';

// Config
const port = env.PORT;

const server = createServer(app);
server.listen(port, () => {
  console.log(`Backend started at http://localhost:${port}`);
});
