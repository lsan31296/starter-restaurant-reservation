/**
 * Defines the router for tables resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./tables.controller");

router.route("/").post(controller.create).get(controller.list);

module.exports = router;