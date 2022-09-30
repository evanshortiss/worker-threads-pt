import fastify from 'fastify';
import xmlPlugin, { XmlPluginOpts } from './xml-plugin';
import getConfig from './config';
import '@fastify/view'
import { PointOfViewOptions } from '@fastify/view';

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
  layout: 'templates/layouts/layout.ejs'
} as PointOfViewOptions);

app.register(require('@fastify/formbody'))

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

app.get('/signup', (req, res) => {
  res.view('/templates/index.ejs', {
    header: 'Fun with Worker Threads',
    text: 'Hello!'
  });
})

app.post('/signup', (req, res) => {
  const { username } = req.body as any
  res.view('/templates/welcome.ejs', {
    username
  });
})

app.post('/upload', (req, res) => {
  const topLevelKeys = Object.keys(req.body as any)
  const keyCount = topLevelKeys.reduce((prev, cur) => {
    return prev + (req.body as any)[cur].length
  }, 0)

  res.send({ keyCount });
})

app.listen({
  host: HTTP_HOST,
  port: HTTP_PORT
})