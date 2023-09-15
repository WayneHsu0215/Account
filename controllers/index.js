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

router.get('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const transId = req.params.TranID; // 从URL参数中获取TransID

        // 执行查询，使用参数化查询以避免SQL注入
        const query = `
            SELECT AccID, TranID, CONVERT(varchar, TranTime, 23) AS TranTime, AtmID, TranType, TranNote, CONVERT(varchar, UP_DATETIME, 23) AS UP_DATETIME, UP_USR
            FROM Trans
            WHERE TranID = @TranID;
        `;

        const result = await pool
            .request()
            .input('TranID', transId) // 使用输入参数传递TransID
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

export default router;
