export default {
  async fetch(req, env) {
    const res = await env.ASSETS.fetch(req);
    if (res.status !== 404) return res;
    const url = new URL(req.url);
    if (url.pathname.startsWith("/invite")) {
      return env.ASSETS.fetch(new Request(new URL("/invite.html", url), req));
    }
    if (url.pathname.startsWith("/share")) {
      return env.ASSETS.fetch(new Request(new URL("/share.html", url), req));
    }
    return env.ASSETS.fetch(new Request(new URL("/index.html", url), req));
  },
};
