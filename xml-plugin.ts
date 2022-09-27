import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { parseXmlAsync, parseXmlSync } from './xml-parser'

export type XmlPluginOpts = {
  async: boolean
}

const xmlParserFp: FastifyPluginCallback<XmlPluginOpts> = (fastify, options, done) => {
  fastify.addContentTypeParser('text/xml', (req, payload, done) => {
    let buffer = ''

    payload.on('error', function onXmlPayloadError (err) {
      done(err)
    })

    payload.on('data', function onXmlPayloadData (data) {
      buffer += data
    })

    payload.on('end', function onXmlPayloadEnd () {
      if (options.async) {
        parseXmlAsync(buffer)
          .then((xml) => done(null, xml))
          .catch(done)
      } else {
        let result: any, err: any

        try {
          result = parseXmlSync(buffer)
        } catch (e) {
          err = e
        }

        done(err, result)
      }
    })
  })

  done()
}

export default fp(xmlParserFp, '4.x')