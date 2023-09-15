import React, { useEffect, useState } from 'react';

const Root = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransData = async () => {
        try {
            const response = await fetch('/api/trans');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    useEffect(() => {
        fetchTransData();
    }, []);

    const [newTransaction, setNewTransaction] = useState({
        AccID: '',
        AtmID: '',
        TranType: '',
        TranNote: '',
        UP_USR: '',
        TranID: 0, // 初始值为0，后续会更新
    });

    const getMaxTransID = () => {
        // 获取当前列表中的最大TransID
        const maxTransID = Math.max(...transactions.map((transaction) => transaction.TranID), 0);
        return maxTransID + 1; // 返回下一个可用的TransID
    };


    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setNewTransaction({
            ...newTransaction,
            [name]: value,
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/trans', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...newTransaction, TranID: getMaxTransID() }), // 设置新的TransID
            });

            if (!response.ok) {
                throw new Error('Failed to add new transaction');
            }

            // 清空表單字段
            setNewTransaction({
                AccID: '',
                AtmID: '',
                TranType: '',
                TranNote: '',
                UP_USR: '',
                TranID: 0, // 重置TransID
            });

            // 刷新交易列表
            fetchTransData();
        } catch (error) {
            console.error('Error adding new transaction:', error);
        }
    };

    const [searchTranID, setSearchTranID] = useState('');
    const [searchTrans, setSearchTrans] = useState(null);
    const searchTransaction = () => {
        if (!searchTranID) {
            return;
        }

        fetch(`/api/trans/${searchTranID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setSearchTrans(data);
            })
            .catch((error) => {
                console.error('Error searching transaction:', error);
            });
    };




    return (
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 w-2/3">
            <h1 className="text-3xl font-semibold mb-4 m-8">Transaction List</h1>

            <form onSubmit={handleSubmit} className="w-full flex  justify-between">
                <input
                    type="text"
                    name="AccID"
                    placeholder="AccID"
                    value={newTransaction.AccID}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="AtmID"
                    placeholder="AtmID"
                    value={newTransaction.AtmID}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="TranType"
                    placeholder="TranType"
                    value={newTransaction.TranType}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="TranNote"
                    placeholder="TranNote"
                    value={newTransaction.TranNote}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="UP_USR"
                    placeholder="UP_USR"
                    value={newTransaction.UP_USR}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />

                {/* 在这里添加其他输入字段 */}
                <button type="submit" className="bg-amber-200 text-black px-4 h-8  hover:bg-amber-400 w-1/6 m-1 rounded-lg">新增</button>
            </form>


            <div className="flex flex-col md:flex-row justify-center items-center">
                <input
                    className="border  text-center m-2  rounded-lg  border-black "
                    type="text"
                    placeholder="TranID"
                    value={searchTranID}
                    onChange={(e) => setSearchTranID(e.target.value)}
                />
                <button
                    className=" px-4 h-8 rounded-lg m-2  text-black bg-amber-200 hover:bg-amber-400"
                    onClick={searchTransaction}>查詢
                </button>
                <button
                    className=" px-4 h-8 rounded-lg  text-black bg-amber-200 hover:bg-amber-400"
                    onClick={() => setSearchTrans(null)}>顯示全部
                </button>
            </div>
            <div className="mb-4">

            </div>







            <div className="h-96 overflow-y-scroll mt-4 ">
                <table className="min-w-full border-2">
                    <thead>
                    <tr>
                        <th className="px-4 py-2">AccID</th>
                        <th className="px-4 py-2">TranID</th>
                        <th className="px-4 py-2">TranTime</th>
                        <th className="px-4 py-2">AtmID</th>
                        <th className="px-4 py-2">TranType</th>
                        <th className="px-4 py-2">TranNote</th>
                        <th className="px-4 py-2">UP_DATETIME</th>
                        <th className="px-4 py-2">UP_USR</th>
                    </tr>
                    </thead>
                    <tbody>
                    {searchTrans ? ( // 如果有查詢結果
                        <tr>
                            <td className="py-2 px-4 border">{searchTrans.AccID}</td>
                            <td className="py-2 px-4 border">{searchTrans.TranID}</td>
                            <td className="py-2 px-4 border">{searchTrans.TranTime}</td>
                            <td className="py-2 px-4 border">{searchTrans.AtmID}</td>
                            <td className="py-2 px-4 border">{searchTrans.TranType}</td>
                            <td className="py-2 px-4 border">{searchTrans.TranNote}</td>
                            <td className="border px-4 py-2">{searchTrans.UP_DATETIME}</td>
                            <td className="border px-4 py-2">{searchTrans.UP_USR}</td>

                        </tr>
                    ) : (
                        transactions.map((transaction) => (
                            <tr key={transaction.AccID}>
                                <td className="border px-4 py-2">{transaction.AccID}</td>
                                <td className="border px-4 py-2">{transaction.TranID}</td>
                                <td className="border px-4 py-2">{transaction.TranTime}</td>
                                <td className="border px-4 py-2">{transaction.AtmID}</td>
                                <td className="border px-4 py-2">{transaction.TranType}</td>
                                <td className="border px-4 py-2">{transaction.TranNote}</td>
                                <td className="border px-4 py-2">{transaction.UP_DATETIME}</td>
                                <td className="border px-4 py-2">{transaction.UP_USR}</td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default Root;
