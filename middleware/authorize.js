const authorize = (requiredRole) => {
    return (req, res, next) => {
      const userRole = req.user.role;
  
      if (userRole === requiredRole) {
        next(); // User has the required role, proceed to the next middleware or route handler
      } else {
        res.status(403).json({ message: 'Unauthorized' });
      }
    };
  };
  
  module.exports = { authorize };
  