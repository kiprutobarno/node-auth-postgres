require("dotenv").config();
const moment = require("moment");
const { Helpers } = require("./helpers");
const uuid = require("uuid/v4");

const User = {
  /**create a user
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} user
   */
  async register(req, res) {
    const { firstName, lastName, email, password } = req.body;
    const dateCreated = moment().format();
    const dateModified = moment().format();
    const id = uuid();

    if (!firstName || !lastName || !email || !password) {
      res.status(400).send({ message: "some values are missing" });
    }

    if (!Helpers.isEmailValid(email)) {
      res.status(400).send({ message: "please enter a valid password" });
    }

    const hashedPassword = Helpers.hashPassword(password);
    const createQuery = `INSERT INTO users(id, firstName, lastName, email, password, dateCreated, dateModified) VALUES('${id}', '${firstName}', '${lastName}', '${email}', '${hashedPassword}', '${dateCreated}', '${dateModified}')`;
    const searchQuery = `SELECT * FROM users WHERE id='${id}'`;

    try {
      await Helpers.query(createQuery);
      let { rows } = await Helpers.query(searchQuery);
      return res.status(201).send({
        statusCode: 201,
        message: "user successfully created",
        user: rows[0],
        token: Helpers.generateToken(rows[0].id, rows[0].firstName)
      });
    } catch (er) {
      if (er.routine === "_bt_check_unique") {
        return res
          .status(409)
          .send({ statusCode: 409, message: "email already registered" });
      } else {
        res.status(400).send({ message: "error", er: er });
      }
    }
  },

  /**user login
   * @param {Object} req
   * @param {Object} res
   * @param {Object} the logged in user
   */
  async login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
      res
        .status(400)
        .send({ statusCode: 400, message: "some values are missing" });
    }
    if (!Helpers.isEmailValid(email)) {
      res
        .status(400)
        .send({ statusCode: 400, message: "invalid email address" });
    }
    const queryText = `SELECT * FROM users WHERE email='${email}'`;

    try {
      const { rows } = await Helpers.query(queryText);
      if (!rows[0]) {
        res
          .status(401)
          .send({ statusCode: 401, message: "wrong email address!" });
      }

      if (!Helpers.comparePassword(password, rows[0].password)) {
        res.status(401).send({ statusCode: 401, message: "wrong password!" });
      } else {
        token = Helpers.generateToken(rows[0].id, rows[0].firstname);
        res.status(200).send({
          statusCode: 200,
          message: "user logged in successfully!",
          token: token
        });
        console.log(req.cookies);
      }
    } catch (er) {
      res.status(400).send({ message: "error", er: er });
    }
  },

  /**
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} logged in user
   */
  async welcome(req, res) {
    console.log(req);
    res.status(200).send({ message: "Welcome " + req.firstName });
  }
};

module.exports = { User };
