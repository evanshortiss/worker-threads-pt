import { worker } from 'workerpool'
import { parse } from 'pixl-xml'
import { randomBytes } from 'crypto'

console.log(`👷 worker started (ID: ${randomBytes(4).toString('hex')})`)

worker({
  parse: (xml: string) => {
    return parse(xml, {
      forceArrays: true
    })
  }
});