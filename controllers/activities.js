require("dotenv").config();
const moment = require("moment");
const { Helpers } = require("./helpers");
const uuid = require("uuid/v4");

const Activity = {
  /**create an activity
   * @param {Object} req
   * @param {Object} res
   * @returns {Object} activity
   */

  async createActivity(req, res) {
    const { activityName } = req.body;
    const dateCreated = moment().format();
    const dateModified = moment().format();
    const id = uuid();
    const ownerId = req.ownerId;
    if (!activityName || !id || !dateModified || !dateModified) {
      res
        .status(400)
        .send({ statusCode: 400, message: "some values are missing" });
    } else {
      const createQuery = `INSERT INTO activities(id, activityName, ownerId, dateCreated, dateModified) VALUES('${id}', '${activityName}','${ownerId}', '${dateCreated}', '${dateModified}')`;
      const searchQuery = `SELECT * FROM activities WHERE id='${id}'`;
      try {
        await Helpers.query(createQuery);
        let { rows } = await Helpers.query(searchQuery);
        return res.status(201).send({
          statusCode: 201,
          message: "activity successfully created",
          activity: rows[0]
        });
      } catch (er) {
        res.status(400).send({ statusCode: 400, message: er });
      }
    }
  },

  /**
   * Get all activities
   *
   * @param {Object} req
   * @param {Object} res
   * @param {Object} activities
   */

  async getAllActivities(req, res) {
    const findAllQuery = `SELECT * FROM activities`;
    try {
      let { rows } = await Helpers.query(findAllQuery);
      if (rows.length === 0) {
        return res
          .status(404)
          .send({ statusCode: 404, message: "no activity added!" });
      } else {
        return res
          .status(200)
          .send({ statusCode: 200, message: "success", activities: rows });
      }
    } catch (error) {}
  },
  /**
   * Get a specific activity
   * @param {Object} req
   * @param {Object} res
   */
  async getOneActivity(req, res) {
    const id = req.params.id;
    const findOneQuery = `SELECT * FROM activities WHERE id::text='${id}'`;

    try {
      let { rows } = await Helpers.query(findOneQuery);
      if (!rows[0]) {
        res.status(404).send({
          statusCode: 404,
          message: "activity not found"
        });
      }
      return res
        .status(200)
        .send({ statusCode: 200, message: "success", activity: rows });
    } catch (error) {
      res.status(400).send({
        statusCode: 400,
        message: error
      });
    }
  },

  /**
   * @param {Object} req
   * @param {Object} res
   */

  async updateActivity(req, res) {
    const id = req.params.id;
    const dateModified = moment().format();
    let { activityName } = req.body;
    const findOneQuery = `SELECT * FROM activities WHERE id::text='${id}'`;
    const updateQuery = `UPDATE activities SET activityName='${activityName}', dateModified='${dateModified}' WHERE id::text='${id}'`;

    try {
      await Helpers.query(updateQuery);
      let { rows } = await Helpers.query(findOneQuery);
      if (!rows[0]) {
        res.status(404).send({
          statusCode: 404,
          message: "activity not found"
        });
      }
      return res.status(200).send({
        statusCode: 200,
        message: "activity successfully updated",
        activity: rows[0]
      });
    } catch (er) {}
  },
  /**
   *
   * @param {Object} req
   * @param {*Object} res
   */

  async deleteActivity(req, res) {
    const id = req.params.id;
    const deleteQuery = `DELETE FROM activities WHERE id::text='${id}'`;

    try {
      await Helpers.query(deleteQuery);
      res.status(200).send({ statusCode: 200, message: "activity deleted" });
    } catch (error) {}
  }
};

module.exports = { Activity };
