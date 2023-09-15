import { Router } from "express";

const router = Router();
router.delete('/trans/:TranID', async (req, res) => {
    try {
        const pool = req.app.locals.pool;
        const { TranID } = req.params;

        const result = await pool.request()
            .input('TranID', sql.NVarChar, TranID)
            .query('DELETE FROM Trans WHERE TranID = @TranID');

        if (result.rowsAffected[0] === 0) {
            res.status(404).send('Transaction not found');
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
