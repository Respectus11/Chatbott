const jwt = require("jsonwebtoken");

/**
 * Authentication middleware with optional role enforcement.
 * @param {string|null} requiredRole - pass "admin" to restrict route to admins only.
 */
function authMiddleware(requiredRole = null) {
  return (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
      return res.status(401).json({ error: "Access denied. No token provided." });
    }

    // Strip "Bearer " prefix if present
    const token = authHeader.replace("Bearer ", "");

    try {
      // Verify token with secret
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified; // payload from JWT (e.g., { id, role })

      // If a role is required, check it
      if (requiredRole && req.user.role !== requiredRole) {
        return res.status(403).json({ error: "Forbidden. Insufficient privileges." });
      }

      next();
    } catch (err) {
      return res.status(403).json({ error: "Invalid or expired token." });
    }
  };
}

module.exports = authMiddleware;
