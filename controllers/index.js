import {response, Router} from "express";
import sql from 'mssql';
import bcrypt from 'bcrypt';

const router = Router();


router.get('/trans', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 執行查詢
        const result = await pool.request().query('SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR\n' +
            'FROM Trans;');

        // 在控制台中打印結果
        console.log(result);

        // 也可以將結果發送到客戶端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});


router.post('/trans', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const newTrans = req.body; // 從請求主體中獲取新的交易資料
        // 將新的交易資料保存到資料庫
        const result = await pool.request()
            .input('AccID', sql.NVarChar, newTrans.AccID)
            .input('AtmID', sql.NVarChar, newTrans.AtmID)
            .input('TranType', sql.NVarChar, newTrans.TranType)
            .input('TranNote', sql.NVarChar, newTrans.TranNote)
            .input('UP_USR', sql.NVarChar, newTrans.UP_USR)
            .query('INSERT INTO Trans (AccID, AtmID, TranType, TranNote, UP_USR) VALUES (@AccID,  @AtmID, @TranType, @TranNote, @UP_USR)');

        res.status(201).json({ message: 'Transaction added successfully' });
    } catch (err) {
        console.error('Error adding new transaction', err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/list', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 获取查询字符串参数
        const { AccID, TranType } = req.query;

        // 构建 SQL 查询字符串
        let queryString = 'SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR FROM Trans';

        // 构建查询条件
        const conditions = [];
        if (AccID) {
            conditions.push(`AccID = '${AccID}'`);
        }
        if (TranType) {
            conditions.push(`TranType = '${TranType}'`);
        }

        // 如果有条件，将它们添加到查询中
        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }

        // 执行查询
        const result = await pool.request().query(queryString);

        // 在控制台中打印结果
        console.log(result);

        // 也可以将结果发送到客户端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('DELETE FROM Trans WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Transaction not found!!!!');
            return;
        }

        res.status(200).json({ message: 'Transaction deleted successfully' });
    } catch (err) {
        console.error('Error deleting transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;
        const updatedTrans = req.body;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .input('AccID', sql.NVarChar, updatedTrans.AccID)
            .input('AtmID', sql.NVarChar, updatedTrans.AtmID)
            .input('TranType', sql.NVarChar, updatedTrans.TranType)
            .input('TranNote', sql.NVarChar, updatedTrans.TranNote)
            .input('UP_USR', sql.NVarChar, updatedTrans.UP_USR)
            .query('UPDATE Trans SET AccID = @AccID, AtmID = @AtmID, TranType = @TranType, TranNote = @TranNote, UP_USR = @UP_USR, UP_DATETIME = GETDATE() WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Transaction not found');
            return;
        }

        res.status(200).json({ message: 'Transaction updated successfully' });
    } catch (err) {
        console.error('Error updating transaction', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/accounts', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 執行查詢
        const result = await pool.request().query('SELECT ID, AccID, Password, AccType,CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User\n' +
            'FROM Account;');

        // 在控制台中打印結果
        console.log(result);

        // 也可以將結果發送到客戶端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/accounts', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {ID,AccID, Password, AccType, UP_User} = req.body; // 從請求主體中獲取新的交易資料
        const hashedPassword = await bcrypt.hash(Password,10);
        // 將新的交易資料保存到資料庫
        const result = await pool.request()
            .input('ID', sql.INT, ID)
            .input('AccID', sql.NVarChar, AccID)
            .input('Password', sql.NVarChar,hashedPassword)
            .input('AccType', sql.NVarChar, AccType)
            .input('UP_User', sql.NVarChar, UP_User)
            .query('INSERT INTO Account (ID,AccID, Password, AccType, UP_User) VALUES (@ID,@AccID, @Password,@AccType,@UP_User)');
        res.status(201).json({ message: `Transaction added successfully${ID}` });
    } catch (err) {
        console.error('Error adding new transaction', err);
        res.status(500).send('Internal Server Error');
    }

});


router.get('/accounts/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const accId = req.params.ID; // 从URL参数中获取TransID

        // 执行查询，使用参数化查询以避免SQL注入
        const query = `
            SELECT ID, AccID, Password,AccType,CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User
            FROM Account
            WHERE ID LIKE '%'+@ID+'%';
        `;

        const result = await pool
            .request()
            .input('ID', accId) // 使用输入参数传递TransID
            .query(query);

        if (result.recordset.length === 0) {
            // 如果找不到匹配的记录，返回404
            res.status(404).json({ message: 'TransID not found' });
        } else {
            // 找到匹配的记录，将结果发送到客户端
            res.json(result.recordset);
        }
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});

router.delete('/accounts/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { ID } = req.params;

        const result = await pool.request()
            .input('ID', sql.NVarChar, ID)
            .query('DELETE FROM Account WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Account not found!!!!');
            return;
        }

        res.status(200).json({ message: 'Account deleted successfully' });
    } catch (err) {
        console.error('Error deleting Account', err);
        res.status(500).send('Internal Server Error');
    }
});

router.put('/accounts/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { ID } = req.params;
        const {AccID, Password, AccType, UP_User} = req.body; // 從請求主體中獲取新的交易資料
        const hashedPassword = await bcrypt.hash(Password,10);

        const result = await pool.request()
            .input('ID', sql.Int, ID)
            .input('AccID', sql.NVarChar, AccID)
            .input('Password', sql.NVarChar, hashedPassword)
            .input('AccType', sql.NVarChar, AccType)
            .input('UP_User', sql.NVarChar, UP_User)
            .query('UPDATE Account SET AccID = @AccID, Password = @Password,AccType = @AccType, UP_Date = GETDATE(),UP_User = @UP_User WHERE ID = @ID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Account not found');
            return;
        }

        res.status(200).json({ message: 'Account updated successfully' });
    } catch (err) {
        console.error('Error updating Account', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/list', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 获取查询字符串参数
        const { AccID, TranType } = req.query;

        // 构建 SQL 查询字符串
        let queryString = 'SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR FROM Trans';

        // 构建查询条件
        const conditions = [];
        if (AccID) {
            conditions.push(`AccID = '${AccID}'`);
        }
        if (TranType) {
            conditions.push(`TranType = '${TranType}'`);
        }

        // 如果有条件，将它们添加到查询中
        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }

        // 执行查询
        const result = await pool.request().query(queryString);

        // 在控制台中打印结果
        console.log(result);

        // 也可以将结果发送到客户端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});


router.get('/patient', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 執行查詢
        const result = await pool.request().query('SELECT NID,ID, PName, PGender, CONVERT(VARCHAR(10), PBirth, 126) as PBirth, PAge, CONVERT(varchar, Examinedate, 23) AS Examinedate, ExamineID, Examine, PPay, Diagnosis, DName, type FROM Patient');
        // 在控制台中打印結果
        console.log(result);

        // 也可以將結果發送到客戶端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying Trans table', err);
        res.status(500).send('Internal Server Error');
    }
});

router.get('/patientsearch', async (req, res) => {
    try {
        // 假設連接池在 app.locals.pool 中可用
        const pool = req.app.locals.pool;

        // 获取查询字符串参数
        const { ID, PName, ExamineID, Examine, Diagnosis, DName, startDate, endDate } = req.query;

        // 构建 SQL 查询字符串
        let queryString = 'SELECT NID,ID, PName, PGender, CONVERT(VARCHAR(10), PBirth, 126) as PBirth, PAge, CONVERT(varchar, Examinedate, 23) AS Examinedate,ExamineID, Examine, PPay, Diagnosis, DName, type\n' +
            'FROM Patient';

        // 构建查询条件
        const conditions = [];
        if (ID) {
            conditions.push(`ID LIKE '%${ID}%'`);
        }
        if (PName) {
            conditions.push(`PName LIKE '%${PName}%'`);
        }
        if (ExamineID) {
            conditions.push(`ExamineID LIKE '%${ExamineID}%'`);
        }
        if (Examine) {
            conditions.push(`Examine LIKE '%${Examine}%'`);
        }
        if (Diagnosis) {
            conditions.push(`Diagnosis LIKE '%${Diagnosis}%'`);
        }
        if (DName) {
            conditions.push(`DName LIKE '%${DName}%'`);
        }
        if (startDate && endDate) {
            // Adjust dates to UTC and add date range condition
            const startDateUTC = startDate ? new Date(startDate + 'T00:00:00Z') : null;
            const endDateUTC = endDate ? new Date(endDate + 'T23:59:59Z') : null;

            if (startDateUTC && endDateUTC) {
                // Format the UTC dates as strings in ISO 8601 format
                const formattedStartDate = startDateUTC.toISOString();
                const formattedEndDate = endDateUTC.toISOString();

                // Add the timezone-adjusted date range condition to your query
                conditions.push(`Examinedate BETWEEN '${formattedStartDate}' AND '${formattedEndDate}'`);
            }
        }

        // 如果有条件，将它们添加到查询中
        if (conditions.length > 0) {
            queryString += ' WHERE ' + conditions.join(' AND ');
        }

        // 执行查询
        const result = await pool.request().query(queryString);

        // 在控制台中打印结果
        console.log(result);

        // 也可以将结果发送到客户端
        res.json(result.recordset);
    } catch (err) {
        console.error('Error querying patient table', err);
        res.status(500).send('Internal Server Error');
    }
});



router.post('/signup', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const {ID,AccID, password, AccType, UP_User} = req.body; // 從請求主體中獲取新的交易資料
        const hashedPassword = await bcrypt.hash(password,10);
        // 將新的交易資料保存到資料庫
        const result = await pool.request()
            .input('ID', sql.INT, ID)
            .input('AccID', sql.NVarChar, AccID)
            .input('Password', sql.NVarChar,hashedPassword)
            .input('AccType', sql.NVarChar, AccType)
            .input('UP_User', sql.NVarChar, UP_User)
            .query('INSERT INTO Account (ID,AccID, Password, AccType, UP_User) VALUES (@ID,@AccID, @Password,@AccType,@UP_User)');
        res.status(201).json({ success: true,message: 'Transaction added successfully' });
    } catch (err) {
        console.error('Error adding new transaction', err);
        res.status(500).send('Internal Server Error');
    }
});
router.post('/login', async (req, res) => {
    try {
        const { AccID,password } = req.body;
        const pool = req.app.locals.pool;
        const query = `SELECT AccID, password FROM Account WHERE AccID = @username;`;

        const result = await pool.request()
            .input('username', AccID)
            .query(query);

        if (result.recordset.length > 0) {
            if (AccID === 'admin' && password === 'admin') {
                req.session.user = { AccID: AccID };
                res.json({ success: true, message: 'Login successful'});
            } else {
                const isValid = await bcrypt.compare(password, result.recordset[0].password)
                if (isValid) {
                    req.session.user = {AccID: AccID};
                    res.json({success: true, message: `Login successful ${AccID}}`});
                } else {
                    res.status(400).json({success: false, message: 'Missing Username or Password'});
                }
            }
        } else {
            res.status(401).json({ success: false, message: 'Unauthorized' });
        }
    } catch (err) {
        console.error('Error during login:', err);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/logout', async (req, res) => {
    try {
        if (req.session.user) {
            req.session.destroy((err) => {
                if (err) {
                    console.error('Error destroying session:', err);
                    res.status(500).json({success: false, message: 'Internal Server Error' });
                } else {
                    res.status(200).json({success: true,message:'logout成功'});
                }
            });
        } else {
            // 用户未登录，返回未经授权的状态码
            res.status(401).json({ message: 'Unauthorized' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/usercount', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const query = 'SELECT COUNT(*) AS total_rows FROM Account;';
        const result = await pool.request().query(query);
        if (result) {
            const total_rows = result.recordset[0].total_rows;
            res.json({ count: total_rows });
        } else {
            res.status(400).send('123');
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
    }
});


export default router;
