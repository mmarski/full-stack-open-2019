const morgan = require('morgan')

morgan.token('body', function (req, res) { return JSON.stringify(req.body) })
const requestLogger = morgan(':method :url :status :response-time ms - :res[content-length] :body - :req[content-length]')

// Authorization token
function tokenExtractor(req, res, next) {
  const authorization = req.get('authorization')
  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    req.token = authorization.substring(7)
  }
  next()
}

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

module.exports = { requestLogger, tokenExtractor, unknownEndpoint, errorHandler }