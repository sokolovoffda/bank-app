async function register(req, res) {
  res.status(501).json({
    message: 'Register is not implemented yet',
  })
}

async function login(req, res) {
  res.status(501).json({
    message: 'Login is not implemented yet',
  })
}

module.exports = {
  register,
  login,
}
