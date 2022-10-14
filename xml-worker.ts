import { worker } from 'workerpool'
import { parse } from 'pixl-xml'
import { randomBytes } from 'crypto'

console.log(`${Math.random() < 0.5 ? '👷' : '👷‍♀️'}🧵 worker thread started (ID: ${randomBytes(4).toString('hex')})`)

worker({
  parse: (xml: string) => {
    return parse(xml, {
      forceArrays: true
    })
  }
});