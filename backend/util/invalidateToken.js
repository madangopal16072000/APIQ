const jwt = require("jsonwebtoken");

function invalidateToken(token) {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentTimestamp = Math.floor(Date.now() / 1000); // Current time in second
    decoded.exp = currentTimestamp;

    // Sign a new token with the updated expiration time
    const invalidatedToken = jwt.sign(decoded, process.env.JWT_SECRET);
    return invalidatedToken;
  } catch (error) {
    console.error("Error invalidating token:", error);
    return null;
  }
}
module.exports = invalidateToken;
