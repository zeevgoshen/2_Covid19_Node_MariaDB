const express = require('express');
const pool = require('../helpers/database');
const router = express.Router();
const bcrypt = require('bcrypt');

router.get('/:id', async function(req,res){

    try {
        const sqlQuery = 'SELECT id, email, password, created_at FROM user WHERE id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.get('/getallrecords/:id', async function(req,res){

    try {
        const sqlQuery = 'SELECT * FROM user_logs WHERE user_id=?';
        const rows = await pool.query(sqlQuery, req.params.id);
        res.status(200).json(rows);
    } catch (error) {
        res.status(400).send(error.message)
    }
});

router.post('/report_in', async function(req, res) {
    try {
        const {in_time, user_id, date} = req.body;
       
        const sqlQuery = 'UPDATE user_logs SET in_time=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [in_time, user_id, date]);

        //res.status(200).json(result);
        res.status(200).json({userId: result.insertId});  // insertId ?
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/report_out', async function(req, res) {
    try {
        
        const {out_time, user_id, date} = req.body;
       
        const sqlQuery = 'UPDATE user_logs SET out_time=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [out_time, user_id, date]);

        //res.status(200).json(result);
        res.status(200).json({userId: result.insertId}); // insertId ?
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/report_exposure', async function(req, res) {
    try {
        
        console.log('exposed');

        const {exposed, user_id, date} = req.body;
       
        const sqlQuery = 'UPDATE user_logs SET exposed=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [exposed, user_id, date]);

        //res.status(200).json(result);
        
        // need to query concurrent times of this specific user+date+time
        // with other user-times in the same date
        secondQuery(date, user_id);

        res.status(200).json({userId: result.insertId}); // insertId ?
    } catch (error) {
        res.status(400).send(error.message);
    }
})

const secondQuery = async (date, user_id) => {

    // in here we will calculate the time of this exposed user on this date
    // with other users times on this date
    console.log('secondQuery');
    console.log(date);
    console.log(user_id);
    // 1. get the exposed user times
    const sqlQuery = 'SELECT in_time, out_time FROM user_logs WHERE user_id=? AND date=?';
    const result = await pool.query(sqlQuery, [user_id, date]);
    console.log(result.in_time);
    //return res.status(200).json({userId: result.insertId});
    // 2. check by these times for other users and get their emails

}

////////////////////////////////////////////////////
////////////////////////////////////////////////////
////////////////////////////////////////////////////

router.post('/register', async function(req, res) {
    try {
        const {email, password} = req.body;

        const encryptedPassword = await bcrypt.hash(password, 10)
        const sqlQuery = 'INSERT INTO user (email, password) VALUES (?,?)';
        const result = await pool.query(sqlQuery, [email, encryptedPassword]);

        //res.status(200).json(result);
        res.status(200).json({userId: result.insertId});
    } catch (error) {
        res.status(400).send(error.message);
    }
})

router.post('/login', async function(req,res) {
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
})
module.exports = router;