import { FastifyPluginCallback } from 'fastify'
import fp from 'fastify-plugin'
import { getParser } from './xml-parser'

export type XmlPluginOpts = {
  async: boolean
}

const xmlParserFp: FastifyPluginCallback<XmlPluginOpts> = (fastify, options, done) => {
  const parseXml = getParser(options.async)

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
        parseXml(buffer)
          .then((xml: any) => done(null, xml))
          .catch(done)
      } else {
        let result: any, err: any

        try {
          result = parseXml(buffer)
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