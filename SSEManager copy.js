// services/SSEManager.js
 let clients = new Map();
class SSEManager {
  constructor() {
  }

  connect(userId, res) {
    res.setHeader("Content-Type", "text/event-stream");
res.setHeader("Cache-Control", "no-cache");
res.setHeader("Connection", "keep-alive");
res.setHeader("X-Accel-Buffering", "no");

res.flushHeaders();

    clients.set(userId, res);

    // Initial event
    this.send(userId, "connected", {
      message: "SSE Connected"
    });

    reqCleanup(res, () => {
      clients.delete(userId);
    });
  }

  send(userId, event, payload) {
    const client = clients.get(userId);

    if (!client) return false;

    client.write(`event: ${event}\n`);
    client.write(`data: ${JSON.stringify(payload)}\n\n`);

    return true;
  }

  start(userId, taskId, message = "Started") {
    return this.send(userId, "progress", {
      taskId,
      status: "STARTED",
      progress: 0,
      message,
    });
  }

  progress(userId, taskId, progress, message) {

    console.log("clients",clients.keys())
    return this.send(userId, "progress", {
      taskId,
      status: "IN_PROGRESS",
      progress,
      message,
    });
  }

  complete(userId, taskId, message = "Completed") {
    return this.send(userId, "progress", {
      taskId,
      status: "COMPLETED",
      progress: 100,
      message,
    });
  }

  error(userId, taskId, message) {
    return this.send(userId, "progress", {
      taskId,
      status: "FAILED",
      progress: 0,
      message,
    });
  }

  disconnect(userId) {
    const client = clients.get(userId);

    if (!client) return;

    client.end();
    clients.delete(userId);
  }
}

function reqCleanup(res, callback) {
  res.on("close", callback);
}

module.exports = new SSEManager();