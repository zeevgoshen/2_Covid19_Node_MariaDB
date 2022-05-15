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


////////////////////////////////////////////////////
////////////////////// Level 2 /////////////////////
////////////////////////////////////////////////////

router.post('/report_exposure', async function(req, res) {
    try {
        
        const {exposed, user_id, date} = req.body;
       
        // report positive diagnosis
        const sqlQuery = 'UPDATE user_logs SET exposed=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [exposed, user_id, date]);

        // find user ids of people to whom we need to send a notification
        let exposed_ids = await getUserIdsToNotify(date, user_id); 

        
        let emails = getEmailsToNotify(exposed_ids);

        console.log(emails);
        let query = 'SELECT email FROM user WHERE id IN (';
        for(let i = 0; i < exposed_ids.length; i++) {
            console.log(exposed_ids[i].user_id);
            query+= exposed_ids[i].user_id;
            if(i < exposed_ids.length - 1) {
                query+= ',';
            }
        }
        query+=')';
        console.log(query);
        const result3 = await pool.query(query);

        console.log(result3);
      
        res.status(200).json({userEmail: result3}); // insertId ?

    } catch (error) {
        res.status(400).send(error.message);
    }
})

const getUserIdsToNotify = async (date, user_id) => {

    // 1. get the exposed user times
    const sqlQuery = 'SELECT in_time, out_time FROM user_logs WHERE user_id=? AND date=?';
    const result = await pool.query(sqlQuery, [user_id, date]);
    
    // 2. check by these times for other users and get their emails
    const sql2ndQuery = 'SELECT distinct(user_id) FROM user_logs WHERE (in_time<=? and out_time>?) AND date - 7 >= 0';
    const result2 = await pool.query(sql2ndQuery,[result[0].out_time, result[0].in_time]);
    
    return result2;    
}

const getEmailsToNotify = async (exposed_ids) => {
    
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

        //return result;
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