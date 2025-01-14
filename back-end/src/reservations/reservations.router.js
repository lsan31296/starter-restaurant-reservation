/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router({ mergeParams: true });
const controller = require("./reservations.controller");


router.route("/:reservation_id/status").put(controller.updateStatus);
router.route("/:reservation_id").get(controller.read).put(controller.update);
router.route("/").post(controller.create).get(controller.list);


module.exports = router;
