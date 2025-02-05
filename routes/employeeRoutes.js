const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const authenticateToken = require('../middleware/auth');
router.get('/empleados', authenticateToken, employeeController.getAllEmployees);
router.get ('/empleados/:id',authenticateToken, employeeController.getEmpleId);
router.post ('/employee', authenticateToken, employeeController.postingresar);
router.put('/employee/:employee_id', authenticateToken, employeeController.putmodificar);
router.delete('/employee/:employee_id', authenticateToken, employeeController.deleteempleado);
module.exports = router;
