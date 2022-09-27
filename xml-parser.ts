import { pool } from 'workerpool'
import { join } from 'path'
import { parse } from 'pixl-xml';

const parserPool = pool(join(__dirname, 'xml-worker.js'), {
  workerType: 'thread',
})

export function parseXmlSync (xml: string) {
  return parse(xml)
}

export function parseXmlAsync (xml: string) {
  return parserPool.exec('parse', [xml])
}
