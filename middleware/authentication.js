const jwt = require('jsonwebtoken');

const authenticateUser = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized - Missing JWT token in cookie' });
  }

  try {
    const decoded = jwt.verify(token, 'defaultSecretKey');
    req.user = { authorId: decoded.authorId };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Unauthorized - Invalid JWT token' });
  }
};

module.exports = { authenticateUser };
