require("dotenv").config();
const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const Helpers = {
  /**DB Query
   * @param {string} text
   * @returns {Object} object
   */
  query(text) {
    return new Promise((resolve, reject) => {
      pool
        .query(text)
        .then(result => {
          resolve(result);
        })
        .catch(err => {
          reject(err);
        });
    });
  },

  /**Hash Password Method
   * @param {string} password
   * @returns {string} a hashed password
   */
  hashPassword(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
  },

  /**Compare password method
   * @param {string} hashedPassword password
   * @param {string} password supplied password
   */
  comparePassword(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  },

  /**isEmail valid helper method
   * @param {string} email
   * @returns {Boolean} True or false
   */
  isEmailValid(email) {
    return /\S+@\S+\.\S+/.test(email);
  },

  /**Generate Token
   * @param {string} id
   * @returns {string} token
   */
  generateToken(id, firstName) {
    const token = jwt.sign(
      {
        userId: id,
        firstName: firstName
      },
      process.env.SECRET_KEY,
      { expiresIn: 60 * 15 }
    );
    return token;
  }
};

module.exports = { Helpers };
