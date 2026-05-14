import http from "http";
import app from "./app";
import { initSocket } from "./socket";

const port = process.env.PORT || 4000;
const server = http.createServer(app);

initSocket(server);

server.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});
