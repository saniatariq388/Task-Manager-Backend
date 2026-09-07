export default (plugin: any) => {
  const originalCallback = plugin.controllers.auth.callback;

  plugin.controllers.auth.callback = async (ctx: any) => {
    await originalCallback(ctx);

    if (ctx.response.status === 200) {
      const setCookieHeader = ctx.response.get('Set-Cookie');
      let refreshToken: string | null = null;

      if (setCookieHeader) {
        const cookies = Array.isArray(setCookieHeader) ? setCookieHeader : [setCookieHeader];
        const match = cookies.join(';').match(/strapi_up_refresh=([^;]+)/);
        if (match) refreshToken = decodeURIComponent(match[1]);
      }

      if (refreshToken && ctx.body && typeof ctx.body === 'object') {
        ctx.body = { ...ctx.body, refreshToken };
      }
    }
  };

  return plugin;
};