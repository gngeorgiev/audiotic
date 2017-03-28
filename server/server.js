const Koa = require('koa');
const route = require('koa-route');

const audiotic = require('../core/audiotic-node');

const app = new Koa();

const PORT = 3000;

app.use(route.get('/suggest/:resolver/:substring', async (ctx, resolver, substring) => {
    ctx.body = await audiotic[resolver].suggest(substring);
}));

app.use(route.get('/search/:resolver/:substring', async (ctx, resolver, substring) => {
    ctx.body = await audiotic[resolver].search(substring);
}));

app.use(route.get('/resolve/:resolver/:link', async (ctx, resolver, link) => {
    ctx.body = await audiotic[resolver].resolve(link);
}));

app.listen(PORT);
console.log(`Listening on port: ${PORT}`);