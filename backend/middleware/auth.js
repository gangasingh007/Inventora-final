const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Admin = require('../models/Admin');

const auth = (roles = []) => {
  return async (req, res, next) => {
    try {
      const token = req.header('Authorization')?.replace('Bearer ', '');
      if (!token) {
        return res.status(401).json({ message: 'No token provided' });
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      let user;

      if (decoded.role === 'admin') {
        user = await Admin.findById(decoded.id);
      } else {
        user = await User.findById(decoded.id);
      }

      if (!user) {
        return res.status(401).json({ message: 'User not found' });
      }

      if (roles.length && !roles.includes(user.role)) {
        return res.status(403).json({ message: 'Access denied' });
      }

      req.user = user;
      next();
    } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
    }
  };
};

module.exports = auth;