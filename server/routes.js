const { Router } = require('express');
const TaskController = require('./controller');

const router = new Router();

router.route('/tasks').get(TaskController.getTasks);
router.route('/task/:id').get(TaskController.getTask);
router.route('/task/update/:id/:title/:description').put(TaskController.updateTask);
router.route('/task/create/:title/:description').post(TaskController.addTask);
router.route('/task/delete/:id').delete(TaskController.deleteTask);

module.exports = router;