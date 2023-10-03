import { Router } from "express";
import sql from 'mssql';

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
        const result = await pool.request().query('SELECT ID, AccID, Password, Balance, BranchID,AccType,CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User\n' +
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

//ID, AccID, Password, Balance, BranchID,AccType,CONVERT(varchar, UP_Date, 23) AS UP_DATETIME, UP_User
router.post('/accounts', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const newAcc = req.body; // 從請求主體中獲取新的交易資料
        // 將新的交易資料保存到資料庫
        const result = await pool.request()
            .input('ID', sql.Int, newAcc.ID)
            .input('AccID', sql.NVarChar, newAcc.AccID)
            .input('Password', sql.NVarChar, newAcc.Password)
            .input('Balance', sql.Int, newAcc.Balance)
            .input('BranchID', sql.Int, newAcc.BranchID)
            .input('AccType', sql.NVarChar, newAcc.AccType)
            .input('UP_User', sql.NVarChar, newAcc.UP_User)
            .query('INSERT INTO Account (ID, AccID, Password, Balance, BranchID, AccType, UP_User) VALUES (@ID,  @AccID, @Password, @Balance, @BranchID, @AccType,@UP_User)');

        res.status(201).json({ message: 'Transaction added successfully' });
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
            SELECT ID, AccID, Password, Balance, BranchID,AccType,CONVERT(varchar, UP_Date, 23) AS UP_Date, UP_User
            FROM Account
            WHERE ID = @ID;
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
            res.json(result.recordset[0]);
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

//ID, AccID, Password, Balance, BranchID,AccType,CONVERT(varchar, UP_Date, 23) AS UP_DATETIME, UP_User
router.put('/accounts/:ID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { ID } = req.params;
        const updatedTrans = req.body;

        const result = await pool.request()
            .input('ID', sql.Int, ID)
            .input('AccID', sql.NVarChar, updatedTrans.AccID)
            .input('Password', sql.NVarChar, updatedTrans.Password)
            .input('Balance', sql.Int, updatedTrans.Balance)
            .input('BranchID', sql.Int, updatedTrans.BranchID)
            .input('AccType', sql.NVarChar, updatedTrans.AccType)
            .input('UP_User', sql.NVarChar, updatedTrans.UP_User)
            .query('UPDATE Account SET AccID = @AccID, Password = @Password, Balance = @Balance,BranchID = @BranchID, AccType = @AccType, UP_Date = GETDATE(),UP_User = @UP_User WHERE ID = @ID');

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
        const result = await pool.request().query('SELECT ID, PName, PGender, CONVERT(VARCHAR(10), PBirth, 126) as PBirth, PAge, CONVERT(varchar, Examinedate, 23) AS Examinedate, ExamineID, Examine, PPay, Diagnosis, DName, type FROM Patient');
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
        const { ID, PName , ExamineID, Examine, Diagnosis, DName} = req.query;

        // 构建 SQL 查询字符串
        let queryString = 'SELECT ID, PName, PGender, CONVERT(VARCHAR(10), PBirth, 126) as PBirth, PAge, CONVERT(varchar, Examinedate, 23) AS Examinedate,ExamineID, Examine, PPay, Diagnosis, DName, type\n' +
            'FROM Patient';

        // 构建查询条件
        const conditions = [];
        if (ID) {
            conditions.push(`ID = '${ID}'`);
        }
        if (PName) {
            conditions.push(`PName = '${PName}'`);
        }
        if (ExamineID) {
            conditions.push(`ExamineID = '${ExamineID}'`);
        }
        if (Examine) {
            conditions.push(`Examine = '${Examine}'`);
        }
        if (Diagnosis) {
            conditions.push(`Diagnosis = '${Diagnosis}'`);
        }
        if (DName) {
            conditions.push(`DName = '${DName}'`);
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

export default router;
