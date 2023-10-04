import { Router } from "express";
import sql from 'mssql';

const router = Router();

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

export default router;
