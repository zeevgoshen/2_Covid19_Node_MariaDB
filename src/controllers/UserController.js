const pool = require('../../helpers/database');
const bcrypt = require('bcrypt');

exports.getUserbyId = async function(req,res){

    try {
        const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.getAllUserRecordsById = async function(req,res){

    try {
        const sqlQuery = 'SELECT * FROM user_logs WHERE user_id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
}

exports.login = async function(req,res) {
    try {
        const {id, password} = req.body;

        const sqlGetUser = 'SELECT password FROM user WHERE id=?';
        const rows = await pool.query(sqlGetUser, id);

        if (rows) {
            
            const isValid = await bcrypt.compare(password, rows[0].password)
            res.status(200);
        }
        res.status(200).send(`User with id ${id} was not found`)
    } catch (error) {
        res.status(400).send(error.message);
    }
}

exports.register = async function(req, res) {
    try {
        const {email, password} = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10)
        const sqlQuery = 'INSERT INTO user (email, password) VALUES (?,?)';
        const result = await pool.query(sqlQuery, [email, encryptedPassword]);

        //return result;
        //res.status(200).json(result);
        res.status(200).json({userId: result.insertId});
    } catch (error) {
        res.status(400).send(error.message);
    }
}