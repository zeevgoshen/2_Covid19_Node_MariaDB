const pool = require('../../helpers/database');


exports.reportTimeInByDate = async function(req, res) {
    try {
        const {in_time, user_id, date} = req.body;
       
        const sqlQuery = 'UPDATE user_logs SET in_time=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [in_time, user_id, date]);

        res.status(200).json({affectedRows: result.affectedRows});
    } catch (error) {
        res.status(400).send(error.message);
    }
}


exports.reportTimeOutByDate = async function(req, res) {
    try {
        const {out_time, user_id, date} = req.body;
       
        const sqlQuery = 'UPDATE user_logs SET out_time=? WHERE user_id=? AND date=?';
        const result = await pool.query(sqlQuery, [out_time, user_id, date]);

        res.status(200).json({userId: result.insertId});
    } catch (error) {
        res.status(400).send(error.message);
    }
}
