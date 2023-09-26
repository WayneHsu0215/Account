import  {useEffect, useState} from 'react';
import Modal from './Modal'

const Acc = () => {
    const [Accounts, setAccounts] = useState([]);

    const fetchAccsData = async () => {
        try {
            const response = await fetch('/api/accounts');
            if (!response.ok) {
                throw new Error('Failed to fetch data');
            }
            const data = await response.json();
            setAccounts(data);
        } catch (error) {
            console.error('Error fetching data:', error);

        }
    };

    useEffect(() => {
        fetchAccsData();
    }, []);
    const [newAccount, setNewAccount] = useState({
        ID: '',
        AccID: '',
        Password: '',
        Balance: '',
        BranchID: '',
        AccType: '',
        UP_User:'',
    });


    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editAccount, setEditAccount] = useState(null);
    //打開新增交易Modal
    const openAddModal = () => {
        setIsAddModalOpen(true);
        setIsEditModalOpen(false);
    };
    //打開修改交易Modal
    const openEditModal = (account) => {
        setEditAccount(account);
        setIsEditModalOpen(true);
        setIsAddModalOpen(false);
    };
    //關閉Modal
    const closeModal = () => {
        setIsAddModalOpen(false);
        setIsEditModalOpen(false);
    };

    const handleInputChange = (event) => {
        const {name, value} = event.target;
        setNewAccount({
            ...newAccount,
            [name]: value,
        });
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...newAccount}),
            });

            if (!response.ok) {
                throw new Error('Failed to add new Account');
            }

            // 清空表單字段
            setNewAccount({
                ID: '',
                AccID: '',
                Password: '',
                Balance: '',
                BranchID: '',
                AccType: '',
                UP_User:'',
            });

            // 刷新交易列表
            fetchAccsData();
            setIsAddModalOpen(false);
        } catch (error) {
            console.error('Error adding new Account:', error);
            alert('輸入錯誤');
        }
    };

    //刪除
    const deleteAccount = async (ID) => {
        try {
            const response = await fetch(`/api/accounts/${ID}`, {
                method: 'DELETE',
            });

            if (!response.ok) {
                throw new Error('Failed to delete account');
            }
            fetchAccsData();
        } catch (error) {
            console.error('Error deleting account:', error);
        }
    };

    //編輯


    const handleEditInputChange = (event, name) => {
        const newValue = event.target.value;
        setEditAccount((prevAccount) => ({
            ...prevAccount,
            [name]: newValue,
        }));
    };
    const handleEditSubmit = async (event, ID) => {
        event.preventDefault();
        try {
            const response = await fetch(`/api/accounts/${ID}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editAccount),
            });
            if (!response.ok) {
                throw new Error('Failed to update account');
            }
            closeModal();
            fetchAccsData();
        } catch (error) {
            console.error('Error updating account:', error);
            alert('資料錯誤，請再檢查一次(注意長度限制)');
        }
    };

    //checkbox
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    // 一次刪除多筆資料
    const handleCheckboxChange = (ID) => {
        //把勾選的交易加入陣列
        if (selectedAccounts.includes(ID)) {
            // 如果交易ID已有勾選，就取消勾選
            setSelectedAccounts(selectedAccounts.filter(id => id !== ID));
        } else {
            // 勾選的交易放入列
            setSelectedAccounts([...selectedAccounts, ID]);
        }
    };
    // 刪除勾選的交易
    const handleDeleteSelected = () => {
        selectedAccounts.forEach(deleteAccount);
        //刪除後已勾選交易陣列清空
        setSelectedAccounts([]);
    };

    //查詢
    const [searchAccID, setSearchAccID] = useState('');
    const [searchAccs, setSearchAccs] = useState(null);
    const searchAccount = () => {
        if (!searchAccID ) {
            return;
        }

        fetch(`/api/accounts/${searchAccID}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch data');
                }
                return response.json();
            })
            .then((data) => {
                setSearchAccs(data);
                setSearchAccID('');
            })
            .catch((error) => {
                console.error('Error searching account:', error);
                alert('查無此AccID');
            });

    };


    const [currentPage, setCurrentPage] = useState(1);
    const AccountsPerPage = 10;
    const indexOfLastTransaction = currentPage * AccountsPerPage;
    const indexOfFirstTransaction = indexOfLastTransaction - AccountsPerPage;
    const currentAccounts = Accounts.slice(indexOfFirstTransaction, indexOfLastTransaction);


    const handlePageInputChange = (e) => {
        const value = e.target.value;
        const maxPage = Math.ceil(transactions.length / transactionsPerPage);
        if (value === "" || (Number(value) > 0 && !isNaN(value) && value <= maxPage)) {
            setCurrentPage(value === "" ? "" : parseInt(value));
        } else {
            // 如果输入无效、为负数或大于最大页数，将当前页设置为1
            setCurrentPage(1);
        }
    };



    const nextPage = () => {
        if (currentPage < Math.ceil(Accounts.length / AccountsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }else if(currentPage < 1)
        {
            setCurrentPage(1);
        }
    };


    return (
        <div className="container mx-auto px-6 sm:px-6 lg:px-8 w-auto">
            <h1 className="text-3xl font-semibold mb-4 m-4">Account List</h1>
            {/*新增表單*/}
            <Modal isOpen={isAddModalOpen}  onClose={() => closeModal()}>
            <form onSubmit={handleSubmit} className="w-full flex  justify-between">
                <input
                    type="text"
                    name="ID"
                    placeholder="ID"
                    value={newAccount.ID}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="AccID"
                    placeholder="AccID"
                    value={newAccount.AccID}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="Password"
                    placeholder="Password"
                    value={newAccount.Password}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="Balance"
                    placeholder="Balance"
                    value={newAccount.Balance}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="BranchID"
                    placeholder="BranchID"
                    value={newAccount.BranchID}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="AccType"
                    placeholder="AccType"
                    value={newAccount.AccType}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />
                <input
                    type="text"
                    name="UP_User"
                    placeholder="UP_User"
                    value={newAccount.UP_User}
                    onChange={handleInputChange}
                    className="border border-black  w-1/6 m-2 rounded-lg text-center"
                />

                <button type="submit"
                        className="bg-amber-200 text-black px-4 h-8  hover:bg-amber-400 w-1/6 m-1 rounded-lg">新增
                </button>
            </form>
            </Modal>

            {/*查詢框框 + 按鈕*/}
            <div className="flex flex-col md:flex-row justify-center items-center bg-slate-50 rounded-lg">
                <input
                    className="border  text-center m-2  rounded-lg  border-black "
                    type="text"
                    placeholder="ID"
                    value={searchAccID}
                    onChange={(e) => setSearchAccID(e.target.value)}
                />
                <button
                    className=" px-4 h-8 rounded-lg m-2  text-black bg-amber-200 hover:bg-amber-400"
                    onClick={searchAccount}>查詢
                </button>
                <button
                    className=" px-4 h-8 rounded-lg  text-black bg-amber-200 hover:bg-amber-400"
                    onClick={() => setSearchAccs(null)}>顯示全部
                </button>
            </div>

            {/*刪除與新增 + 按鈕*/}
            <div className=" justify-left  bg-slate-50 rounded-lg mt-4">
                {searchAccs ? (null) : (
                    <>
                        <button type="submit"
                                className="bg-amber-200 text-black px-4 h-8  hover:bg-amber-400 w-24 m-1 rounded-lg justify-items-start " onClick={handleDeleteSelected}>刪除
                        </button>
                        <button type="submit"
                                className="bg-green-300 text-black px-4 h-8  hover:bg-amber-400 w-24 m-1 rounded-lg" onClick={() => openAddModal()}>新增
                        </button>
                    </>
                )}</div>

            {/*交易列表*/}
            <div className="h-96 w-full overflow-y-scroll  bg-slate-50 rounded-lg">

                <table className="min-w-full border-2 ">
                    <thead>
                    <tr>
                        {searchAccs ? (null) : (
                            <th className="px-6 py-2 border-b">Check</th>
                        )}
                        <th className="px-6 py-2 border-b">ID</th>
                        <th className="px-3 py-2 border-b">AccID</th>
                        <th className="px-8 py-2 border-b">Password</th>
                        <th className="px-6 py-2 border-b">Balance</th>
                        <th className="px-6 py-2 border-b">BranchID</th>
                        <th className="px-12 py-2 border-b">AccType</th>
                        <th className="px-6 py-2 border-b">UP_Date</th>
                        <th className="px-6 py-2 border-b">UP_User</th>
                        {searchAccs ? (null) : (
                            <>
                                <th className="px-4 py-2 border-b">DELETE</th>
                                <th className="px-4 py-2 border-b">EDIT</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>

                    {searchAccs ? ( // 如果有查詢結果
                        <tr>
                            <td className="py-2 px-4 border-b">{searchAccs.ID}</td>
                            <td className="py-2 px-4 border-b">{searchAccs.AccID}</td>
                            <td className="py-2 px-4 border-b">{searchAccs.Password}</td>
                            <td className="py-2 px-4 border-b">{searchAccs.Balance}</td>
                            <td className="py-2 px-4 border-b">{searchAccs.BranchID}</td>
                            <td className="py-2 px-4 border-b">{searchAccs.AccType}</td>
                            <td className="border-b px-4 py-2">{searchAccs.UP_Date}</td>
                            <td className="border-b px-4 py-2">{searchAccs.UP_User}</td>
                        </tr>
                    ) : (
                        currentAccounts.map((account) => (
                            <tr key={account.ID}>
                                <td className="py-2 px-4 border-b text-center">
                                    <input
                                        type="checkbox"
                                        className="transform scale-150"
                                        checked={selectedAccounts.includes(account.ID)}
                                        onChange={() => handleCheckboxChange(account.ID)}
                                    />
                                </td>
                                <td className="border-b px-4 py-2">{account.ID}</td>
                                <td className="border-b px-4 py-2">{account.AccID}</td>
                                <td className="border-b px-4 py-2">{account.Password}</td>
                                <td className="border-b px-4 py-2">{account.Balance}</td>
                                <td className="border-b px-4 py-2">{account.BranchID}</td>
                                <td className="border-b px-4 py-2">{account.AccType}</td>
                                <td className="border-b px-4 py-2">{account.UP_Date}</td>
                                <td className="border-b px-4 py-2">{account.UP_User}</td>
                                {/*刪除按鈕*/}
                                <td className="border px-4 py-4" style={{ whiteSpace: 'nowrap' }}>
                                    <button
                                        className="select-none px-8 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400"
                                        onClick={() => deleteAccount(account.ID)}>刪除
                                    </button>
                                </td>
                                {/*修改按鈕 + 打開modal*/}
                                <td className="border-b px-4 py-4" style={{ whiteSpace: 'nowrap' }}>
                                    <button
                                        className="select-none px-8 h-8 rounded-lg text-black bg-amber-200 hover:bg-amber-400"
                                        onClick={() => openEditModal(account)}>修改
                                    </button>
                                    {/*Modal內的顯示*/}
                                    <Modal isOpen={isEditModalOpen}  onClose={() => closeModal()}>
                                        <form className={"text-xl"}>
                                            <div className="flex items-center text-yellow-500 text-4xl">
                                                <p>ID:</p>
                                                <input
                                                    type="text"
                                                    disabled
                                                    name="ID"
                                                    placeholder="ID"
                                                    value={editAccount?.ID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'ID')}
                                                    className="p-5 mb-4"
                                                />
                                            </div>
                                            <div>
                                                <p>AccID(10):</p>
                                                <input
                                                    type="text"
                                                    id="AccID"
                                                    name="AccID"
                                                    value={editAccount?.AccID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AccID')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>Password(100):</p>
                                                <input
                                                    type="text"
                                                    id="Password"
                                                    name="Password"
                                                    value={editAccount?.Password || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'Password')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>Balance:</p>
                                                <input
                                                    type="text"
                                                    id="Balance"
                                                    name="Balance"
                                                    value={editAccount?.Balance || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'Balance')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>BranchID:</p>
                                                <input
                                                    type="text"
                                                    id="BranchID"
                                                    name="BranchID"
                                                    value={editAccount?.BranchID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'BranchID')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>AccType(3):</p>
                                                <input
                                                    type="text"
                                                    id="AccType"
                                                    name="AccType"
                                                    value={editAccount?.AccType || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AccType')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <p>UP_User(20):</p>
                                                <input
                                                    type="text"
                                                    id="UP_User"
                                                    name="UP_User"
                                                    value={editAccount?.UP_User || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'UP_User')}
                                                    className="border border-black w-full mb-4 p-1.5 rounded-lg"
                                                />
                                            </div>
                                        </form>
                                        <div className="flex justify-center">
                                            <button
                                                type="submit"
                                                onClick={(e) => handleEditSubmit(e,editAccount?.ID)}
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
            {/*分頁*/}
            <div className="flex justify-end  mr-10 mt-4 ">
                <button onClick={prevPage} disabled={currentPage === 1} className="mr-4">
                    上一頁
                </button>

                <input
                    type="number"
                    value={currentPage}
                    onChange={(e) => handlePageInputChange(e)}
                    className="border border-black text-center w-14 rounded-lg mr-4"
                />

                <button onClick={nextPage} disabled={currentPage === Math.ceil(Accounts.length / AccountsPerPage)}>
                    下一頁
                </button>
            </div>
        </div>
    );
};


export default Acc;
