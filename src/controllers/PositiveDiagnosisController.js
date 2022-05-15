const pool = require('../../helpers/database');

exports.reportPoisitiveExposure = async function(req, res) {
    try {
        
        const {exposed, user_id, date} = req.body;
       
        // report positive diagnosis
        const sqlQuery = 'UPDATE user_logs SET exposed=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [exposed, user_id, date]);

        // find user ids of people to whom we need to send a notification
        let exposed_ids = await getUserIdsToNotify(date, user_id); 

        getEmailsToNotify(exposed_ids, res);        

    } catch (error) {
        res.status(400).send(error.message);
    }
}

const getUserIdsToNotify = async (date, user_id) => {

    // 1. get the exposed user times
    const sqlQuery = 'SELECT in_time, out_time FROM user_logs WHERE user_id=? AND date=?';
    const result = await pool.query(sqlQuery, [user_id, date]);
    
    // 2. check by these times for other users and get their emails
    const sql2ndQuery = 'SELECT distinct(user_id) FROM user_logs WHERE (in_time<=? and out_time>?) AND date - 7 >= 0';
    const result2 = await pool.query(sql2ndQuery,[result[0].out_time, result[0].in_time]);
    
    return result2;    
}

const getEmailsToNotify = async (exposed_ids, res) => {
    let query = 'SELECT email FROM user WHERE id IN (';
    for(let i = 0; i < exposed_ids.length; i++) {
        console.log(exposed_ids[i].user_id);
        query+= exposed_ids[i].user_id;
        if(i < exposed_ids.length - 1) {
            query+= ',';
        }
    }
    query+=')';
    
    const resultEmails = await pool.query(query);

    let email_list = [];

    for (let i = 0; i<resultEmails.length;i++) {
        email_list.push(resultEmails[i].email);
    }
    console.log(email_list);
    res.status(200).json({notifyEmails: email_list});
}