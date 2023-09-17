import  {useEffect, useState} from 'react';
import Modal from './Model'

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
        const {name, value} = event.target;
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
                body: JSON.stringify({...newTransaction, TranID: getMaxTransID()}), // 设置新的TransID
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

    //刪除
    const deleteTransaction = async (tranID) => {
        try {
            const response = await fetch(`/api/trans/${tranID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete transaction');
            }
            fetchTransData();
        } catch (error) {
            console.error('Error deleting transaction:', error);
        }
    };

    //編輯
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editTransaction, setEditTransaction] = useState(null);
    const openEditModal = (transaction) => {
        setEditTransaction(transaction);
        setIsModalOpen(true);
    };
    const handleEditInputChange = (event, name) => {
        const newValue = event.target.value;
        setEditTransaction((prevTransaction) => ({
            ...prevTransaction,
            [name]: newValue,
        }));
    };
    const handleEditSubmit = async (event, tranID) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/trans/${tranID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editTransaction),
            });
            if (!response.ok) {
                throw new Error('Failed to update transaction');
            }
            setIsModalOpen(false);
            fetchTransData();
        } catch (error) {
            console.error('Error updating transaction:', error);
            alert('資料錯誤，請再檢查一次(注意長度限制)');
        }
    };

    //查詢
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
                alert('查無此交易ID');
            });
    };

    return (

        <div className="container mx-auto px-6 sm:px-6 lg:px-8 w-auto">
            <h1 className="text-3xl font-semibold mb-4 m-8">Transaction List</h1>
            {/*新增表單*/}
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
                <button type="submit"
                        className="bg-amber-200 text-black px-4 h-8  hover:bg-amber-400 w-1/6 m-1 rounded-lg">新增
                </button>
            </form>

            {/*查詢框框 + 按鈕*/}
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

            {/*交易列表*/}
            <div className="h-screen w-full overflow-y-scroll mt-4 ">
                <table className="min-w-full border-2 ">
                    <thead>
                    <tr>
                        <th className="px-6 py-2 bg-green-500">AccID</th>
                        <th className="px-3 py-2 bg-green-500">TranID</th>
                        <th className="px-8 py-2 bg-green-500">TranTime</th>
                        <th className="px-6 py-2 bg-green-500">AtmID</th>
                        <th className="px-6 py-2 bg-green-500">TranType</th>
                        <th className="px-12 py-2 bg-green-500">TranNote</th>
                        <th className="px-6 py-2 bg-green-500">UP_DATETIME</th>
                        <th className="px-6 py-2 bg-green-500">UP_USR</th>
                        {/*如果全部顯示就出現按鈕*/}
                        {searchTrans ? (null) : (
                            <>
                                <th className="px-4 py-2 bg-green-500">DELETE</th>
                                <th className="px-4 py-2 bg-green-500">EDIT</th>
                            </>
                        )}
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
                                {/*刪除按鈕*/}
                                <td className="border px-4 py-4" style={{ whiteSpace: 'nowrap' }}>
                                    <button
                                        className="select-none px-8 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400"
                                        onClick={() => deleteTransaction(transaction.TranID)}>刪除
                                    </button>
                                </td>
                                {/*修改按鈕 + 打開modal*/}
                                <td className="border px-4 py-4" style={{ whiteSpace: 'nowrap' }}>
                                    <button
                                        className="select-none px-8 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400"
                                        onClick={() => openEditModal(transaction)}>修改
                                    </button>
                                    {/*Modal內的顯示*/}
                                    <Modal isOpen={isModalOpen}  onClose={() => setIsModalOpen(false)}>
                                        <form className={"text-xl"}>
                                            <div className="flex items-center text-yellow-500 text-4xl">
                                                <p>TranID:</p>
                                                <input
                                                    type="text"
                                                    disabled
                                                    name="TranID"
                                                    placeholder="TranID"
                                                    value={editTransaction?.TranID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'TranID')}
                                                    className="p-5 mb-4"
                                                />
                                            </div>
                                            <div>
                                                <p>AccID(10):</p>
                                                <input
                                                    type="text"
                                                    id="AccID"
                                                    name="AccID"
                                                    value={editTransaction?.AccID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AccID')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>AtmID(3):</p>
                                                <input
                                                    type="text"
                                                    id="AtmID"
                                                    name="AtmID"
                                                    value={editTransaction?.AtmID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AtmID')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>TranType(3):</p>
                                                <input
                                                    type="text"
                                                    id="TranType"
                                                    name="TranType"
                                                    value={editTransaction?.TranType || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'TranType')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>TranNote(100):</p>
                                                <input
                                                    type="text"
                                                    id="TranNote"
                                                    name="TranNote"
                                                    value={editTransaction?.TranNote || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'TranNote')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>UP_USR(20):</p>
                                                <input
                                                    type="text"
                                                    id="UP_USR"
                                                    name="UP_USR"
                                                    value={editTransaction?.UP_USR || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'UP_USR')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                        </form>
                                        <div className="flex justify-center">
                                        <button
                                            type="submit"
                                            onClick={(e) => handleEditSubmit(e, editTransaction?.TranID)}
                                            className="grid place-items-center mt-4  text-xl bg-amber-200 text-black px-4 h-10 hover:bg-amber-400 rounded-lg">
                                            修改完成
                                        </button>
                                        </div>
                                    </Modal>
                                </td>
                            </tr>
                        )))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};


export default Root;
