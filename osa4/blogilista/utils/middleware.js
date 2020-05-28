const morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const requestLogger = morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]')

// olemattomien osoitteiden käsittely
const unknownEndpoint = (req, res) => {
  res.status(404).send({ error: 'unknown endpoint' })
}

// virheellisten pyyntöjen käsittely
const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformed id' })
  }
  else if (error.name === 'ValidationError') {
    return res.status(400).send({ error: error.message })
  } else if (error.name === 'JsonWebTokenError') {
    return res.status(401).json({
      error: 'invalid token'
    })
  }

  next(error)
}

module.exports = { requestLogger, unknownEndpoint, errorHandler }