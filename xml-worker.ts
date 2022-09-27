import { worker } from 'workerpool'
import { parse } from 'pixl-xml'
import { randomBytes } from 'crypto'

console.log(`👷 worker started (${randomBytes(4).toString('hex')})`)

worker({
  parse: (xml: string) => {
    return parse(xml)
  }
});