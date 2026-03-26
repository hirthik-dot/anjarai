const jwt    = require('jsonwebtoken')
const SECRET = process.env.JWT_SECRET || 'tmc_jwt_secret_change_in_prod'

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token      = authHeader && authHeader.split(' ')[1]
  if (!token) return res.status(401).json({ error: 'No token — access denied' })
  try {
    req.admin = jwt.verify(token, SECRET)
    next()
  } catch (err) {
    res.status(401).json({ error: 'Token expired or invalid — please log in again' })
  }
}
