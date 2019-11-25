require("dotenv").config();
const jwt = require("jsonwebtoken");
const { Helpers } = require("../controllers/helpers");

const Auth = {
  /**verify token
   * @param {object} req
   * @param {object} res
   * @param {object} next
   * @returns {object/void} response object
   */

  async verifyToken(req, res, next) {
    if (typeof req.headers["authorization"] === "undefined") {
      res
        .status(401)
        .send({ statusCode: 401, message: "access token missing in header" });
    } else {
      const token = req.headers["authorization"].replace("Bearer ", "");
      try {
        console.log(req.headers);
        const decoded = await jwt.verify(token, process.env.SECRET_KEY);
        const searchQuery = `SELECT * FROM users WHERE id::text='${decoded.userId}'`;
        const { rows } = await Helpers.query(searchQuery);
        if (!rows[0]) {
          return res
            .status(401)
            .send({ statusCode: 401, message: "provided token invalid" });
        }
        req.ownerId = decoded.userId;
        req.firstName = decoded.firstName;
        next();
      } catch (err) {
        res.status(401).send({ statusCode: 401, message: err.message });
      }
    }
  }
};

module.exports = { Auth };
