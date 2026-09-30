import { spawn } from "node:child_process";
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const outDir = path.join(root, "dist");
const port = Number(process.env.PORT) || 4173;
const watchRoots = ["content", "css", "js", "assets", "scripts/build.mjs", "favicon.svg", "app-ads.txt", "robots.txt", "_headers", "CNAME"];

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".woff2": "font/woff2",
};

const reloadScript = `<script>
(() => {
  const show = (message) => {
    let bar = document.getElementById("zx-dev-error");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "zx-dev-error";
      bar.style.cssText = "position:fixed;z-index:9999;left:16px;right:16px;bottom:16px;padding:14px 16px;border-radius:14px;background:#3b0d16;color:#fff;font:600 14px/1.45 ui-sans-serif,sans-serif;white-space:pre-wrap";
      document.body.appendChild(bar);
    }
    bar.textContent = message;
  };
  const listen = () => {
    const source = new EventSource("/__dev/reload");
    source.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "reload") location.reload();
      else show("构建失败，页面还是上一版。\\n" + data.message);
    };
  };
  listen();
})();
</script>`;

const clients = new Set();
let building = false;
let queued = false;
let lastEvent = null;
let lastSnapshot = snapshot();

function snapshot() {
  const rows = [];
  const walk = (target) => {
    if (!fs.existsSync(target)) return;
    const stat = fs.statSync(target);
    if (stat.isDirectory()) {
      for (const name of fs.readdirSync(target)) walk(path.join(target, name));
      return;
    }
    rows.push(`${path.relative(root, target)}:${stat.mtimeMs}:${stat.size}`);
  };
  for (const item of watchRoots) walk(path.join(root, item));
  return rows.sort();
}

function notify(payload) {
  lastEvent = payload;
  const body = `data: ${JSON.stringify(payload)}\n\n`;
  for (const client of clients) client.write(body);
}

function build({ reload = true } = {}) {
  if (building) {
    queued = true;
    return;
  }
  building = true;
  const child = spawn(process.execPath, [path.join(root, "scripts", "build.mjs")], { cwd: root });
  let output = "";
  child.stdout.on("data", (chunk) => {
    output += chunk;
    process.stdout.write(chunk);
  });
  child.stderr.on("data", (chunk) => {
    output += chunk;
    process.stderr.write(chunk);
  });
  child.on("close", (code) => {
    building = false;
    if (queued) {
      queued = false;
      build();
      return;
    }
    if (code === 0) {
      if (reload) notify({ type: "reload" });
    } else {
      const text = output.trim();
      const message = text.split("\n").find((line) => line.startsWith("Error:")) || text.slice(-500);
      notify({ type: "error", message });
    }
  });
}

function send(res, status, body, type) {
  res.writeHead(status, {
    "Content-Type": type,
    "Cache-Control": "no-store",
  });
  res.end(body);
}

function serve(req, res) {
  const url = new URL(req.url, `http://127.0.0.1:${port}`);
  if (url.pathname === "/__dev/reload") {
    res.writeHead(200, {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-store",
      Connection: "keep-alive",
    });
    res.write("retry: 1000\n\n");
    if (lastEvent?.type === "error") res.write(`data: ${JSON.stringify(lastEvent)}\n\n`);
    clients.add(res);
    req.on("close", () => clients.delete(res));
    return;
  }

  let pathname = decodeURIComponent(url.pathname);
  if (pathname.endsWith("/")) pathname += "index.html";
  const file = path.resolve(outDir, "." + pathname);
  if (file !== outDir && !file.startsWith(outDir + path.sep)) {
    send(res, 403, "Forbidden", "text/plain; charset=utf-8");
    return;
  }
  const target = fs.existsSync(file) && fs.statSync(file).isFile() ? file : path.join(outDir, "404.html");
  const status = target.endsWith(`${path.sep}404.html`) && file !== target ? 404 : 200;
  let body;
  try {
    body = fs.readFileSync(target);
  } catch {
    send(res, 500, "The file changed while it was being read. Refresh.", "text/plain; charset=utf-8");
    return;
  }
  const type = types[path.extname(target).toLowerCase()] || "application/octet-stream";
  if (type.startsWith("text/html")) {
    body = Buffer.from(body.toString("utf8").replace("</body>", `${reloadScript}</body>`));
  }
  send(res, status, body, type);
}

function watch() {
  const current = snapshot();
  const previous = new Set(lastSnapshot);
  const next = new Set(current);
  const changed = [
    ...current.filter((row) => !previous.has(row)),
    ...lastSnapshot.filter((row) => !next.has(row)),
  ];
  lastSnapshot = current;
  if (!changed.length) return;
  const files = changed.map((row) => row.slice(0, row.indexOf(":")));
  console.log(files.map((file) => `changed ${file}`).join("\n"));
  build();
}

const server = http.createServer(serve);
server.listen(port, "127.0.0.1", () => {
  console.log(`Dev server http://127.0.0.1:${port}`);
  console.log("Watching content/, css/, js/, assets/. Ctrl+C to stop.");
  build({ reload: false });
});
server.on("error", (error) => {
  if (error.code === "EADDRINUSE") console.error(`Port ${port} is already in use.`);
  else console.error(error.message);
  process.exit(1);
});

setInterval(watch, 400);
setInterval(() => {
  for (const client of clients) client.write(": ping\n\n");
}, 15000);
