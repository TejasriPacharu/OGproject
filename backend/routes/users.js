const { getAllUsers, getUserByID, createUser, editUser, deleteUser } = require("../controllers/users");


const router = require("express").Router();

router.route("/")
      .get(getAllUsers)
      .post(createUser)

router.route("/:id")
      .get(getUserByID)
      .put(editUser)
      .delete(deleteUser)


module.exports = router;