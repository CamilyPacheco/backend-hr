const pool = require('../config/db');
// Obtener todos los empleados
exports.getAllEmployees = async (req, res) => {
try {
const result = await pool.query('SELECT * FROM employees');
res.json(result.rows);
} catch (error) {
res.status(500).json({ message: error.message });
}
};

//endpoint para devolver un employes por id
exports.getEmpleId= async(req, res)=>{
    const {id} = req.params;
    const query = 'select * from employees where employee_id=$1';
    const values = [id];
    try{
        const client= await pool.connect();
        const result = await pool.query(query,values);
        client.release();

        if(result.rowCount>0){
            res.json(result.rows);
        }else{
            res.status(500).json({mierror: 'No existe el departamento'});
        }

    }catch(err){
        console.log(err);
        res.status(500).json({error:'Error en el servidor'});
    }
};


//ingresar
exports.postingresar= async(req, res)=> {
    const { employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;
    const query = 'INSERT INTO employees(employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *';
    const values = [employee_id, first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(500).json({ mierror: 'No se pudo insertar un employee' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};


//modificar
exports.putmodificar=async(req, res)=> {
    const { employee_id} = req.params;
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;
    const query = `
        UPDATE employees
	    SET first_name=$1, last_name=$2, email=$3, phone_number=$4, hire_date=$5, job_id=$6, salary=$7, commission_pct=$8, manager_id=$9, department_id=$10
        WHERE employee_id = $11
        RETURNING *`;
    const values = [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id,employee_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ mierror: 'No se pudo encontrar el employee para actualizar' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};

//eliminar
exports.deleteempleado=async(req, res) =>{
    const { employee_id } = req.params;
    const query = 'DELETE FROM employees WHERE employee_id = $1 RETURNING *';
    const values = [employee_id];

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();

        if (result.rowCount > 0) {
            res.json({ mensaje: 'employee eliminado correctamente', employe: result.rows[0] });
        } else {
            res.status(404).json({ mierror: 'No se encontró el employee para eliminar' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
};




