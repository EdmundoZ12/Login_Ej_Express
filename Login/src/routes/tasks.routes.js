const {Router} = require('express');
const {authRequired} = require('../middlewares/validateToken');
const { getTasks, getTask, createTask, deleteTask, updateTask } = require('../controllers/tasks.controllers');

const router=Router()

router.get('/tasks',authRequired,getTasks);
router.get('/tasks/:id',authRequired,getTask);
router.post('/tasks',authRequired,createTask);
router.delete('/tasks/:id',authRequired,deleteTask);
router.put('/tasks/:id',authRequired,updateTask);

module.exports = router;