import { pool } from 'workerpool'
import { join } from 'path'
import { parse } from 'pixl-xml';
import { cpus } from 'os';

type PRT = (xml: string) => Promise<any>
type CRT = (xml: string) => any

export function getParser (async: boolean): PRT|CRT {
  if (async) {
    const parserPool = pool(join(__dirname, 'xml-worker.js'), {
      workerType: 'thread',
      minWorkers: cpus().length - 1
    })

    return function parseXmlAsync (xml: string) {
      return parserPool.exec('parse', [xml])
    }
  } else {
    return function parseXmlSync (xml: string) {
      return parse(xml, {
        forceArrays: true
      })
    }
  }
}