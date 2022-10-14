import getConfig from './config';
import cluster from 'node:cluster';
import { cpus } from 'node:os';
import process from 'node:process';
import startServer from './server';

const config = getConfig(process.env)
const { USE_WORKERS, USE_CLUSTER } = config

if (USE_WORKERS && USE_CLUSTER) {
  throw new Error('cannot set both USE_WORKERS and USE_CLUSTER to true')
}

if (USE_CLUSTER && cluster.isPrimary) {
  console.log(`🚀 primary process started (PID: ${process.pid})`);

  for (let i = 0; i < cpus().length; i++) {
    cluster.fork();
  }

  cluster.on('fork', (worker) => {
    console.log(`${Math.random() < 0.5 ? '👷' : '👷‍♀️'} worker process started (PID: ${worker.process.pid})`)
  });

  cluster.on('exit', (worker, code, signal) => {
    console.log('worker is dead:', worker.isDead());
  });
} else {
  if (USE_WORKERS) {
    console.log(`🚀 primary process started (PID: ${process.pid})`);
  }

  startServer(config)
}
