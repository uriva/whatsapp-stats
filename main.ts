/// <reference lib="deno.ns" />
import { serveDir, serveFile } from "jsr:@std/http/file-server";

Deno.serve(async (req: Request) => {
  const url = new URL(req.url);
  const pathname = url.pathname;

  const res = await serveDir(req, {
    fsRoot: "out",
    showIndex: true,
    quiet: true,
  });

  if (res.status !== 404) {
    return res;
  }

  if (pathname.startsWith("/invite")) {
    return serveFile(req, "out/invite.html");
  }

  if (pathname.startsWith("/share")) {
    return serveFile(req, "out/share.html");
  }

  return serveFile(req, "out/index.html");
});
