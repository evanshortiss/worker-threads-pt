import fastify from 'fastify';
import xmlPlugin, { XmlPluginOpts } from './xml-plugin';
import getConfig from './config';
import '@fastify/view'

const app = fastify()
const {
  HTTP_HOST,
  HTTP_PORT,
  USE_WORKERS
} = getConfig(process.env)

app.register(require('@fastify/view'), {
  engine: {
    ejs: require('ejs'),
  },
});

app.register(
  xmlPlugin,
  { async: USE_WORKERS } as XmlPluginOpts
)

app.get('/', (req, res) => {
  res.view('/templates/index.ejs', {
    header: 'Fun with Worker Threads',
    text: 'Hello!'
  });
})

app.post('/upload', (req, res) => {
  res.send({
    data: Object.keys(req.body as any).length
  })
})

app.listen({
  host: HTTP_HOST,
  port: HTTP_PORT
})