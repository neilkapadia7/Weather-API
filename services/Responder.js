let { validationResult } = require('express-validator')

module.exports = {
  respondWithSuccess(req, res, data, message = '', cache) {
    res?.status(200)
    return this.respond(req, res, true, message, data, "", cache)
  },

  respondWithFalseSuccess(req, res, data, message = '') {
    res?.status(200)
    return this.respond(req, res, false, message, data)
  },

  respondWithError(req, res, error) {
    res?.status(500)
    return this.respond(req, res, false, error.toString())
  },

  respondWithValidationError(req, res, errors) {
    res?.status(422)
    return this.respond(req, res, false, 'validation failed', undefined, errors)
  },

  respondWithCustomError(req, res, message, data) {
    res?.status(400)
    return this.respond(req, res, false, message.toString(), data)
  },

  respondWithUnauthorised(req, res, message = 'Unauthorised') {
    res?.status(401)
    return this.respond(req, res, false, message.toString())
  },

  respondWithNotFound(req, res, message = 'Data not found') {
    res?.status(404)
    return this.respond(req, res, false, message)
  },

  respondWithFileUploaded(req, res, data, message, error) {
    res?.status(422)
    return this.fileRespond(req, res, false, message, data, error)
  },

  respond(req, res, status, message, data, error, cache) {
    if (status) {
      const resJson = { status, data, message };
      
      return res?.json(resJson);
    } else {
      return res?.json({ status, message, data, error });
    }
  },

  fileRespond(req, res, status, message, data, error) {
    return res?.json({ status, data, error, message })
  },

  formatter({ location, msg, param, value, nestedErrors }) {
    return msg
  },

 
  respondWithValidationErrorV2(req, res, errors) {
    res?.status(400)
    return this.respond(req, res, false, 'Validation failed', undefined, errors)
  },

  validate(req, res, next) {
    const errors = validationResult(req).formatWith(this.formatter)
    if (!errors.isEmpty()) {
      return this.respondWithValidationError(req, res, errors.mapped())
    }
    next()
  },


  validateV2(req, res, next) {
    const errors = validationResult(req).formatWith(this.formatter)
    if (!errors.isEmpty()) {
      return this.respondWithValidationErrorV2(req, res, errors.mapped())
    }
    next()
  },

  redirect(req, res, url) {
    res?.redirect(url)
  }
}
