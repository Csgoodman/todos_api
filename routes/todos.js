var express = require('express');
var router = express.Router();
var db = require("../models")
var helpers = require("../helpers/todos");

// First and second routes
router.route('/')
    .get(helpers.getTodos)
    .post(helpers.createTodo)

// 3-5 routes
router.route('/:todoId')
    .get(helpers.getTodo)
    .put(helpers.updateTodo)
    .delete(helpers.deleteTodo)

module.exports = router;