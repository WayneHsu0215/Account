import  {useEffect, useState} from 'react';
import Modal from './Modal'
//先npm install --save-dev @iconify/react
import { Icon } from '@iconify/react';
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
        AccID: '',
        Password: '',
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


    const getMaxID = () => {
        // 表中的最大ID
        const maxID = Math.max(...Accounts.map((Accounts) => Accounts.ID), 0);
        return maxID + 1; // 下一個可用的ID
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('/api/accounts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({...newAccount, ID: getMaxID()}),
            });
            if (!response.ok) {
                throw new Error('Failed to add new Account');
            }
            // 刷新交易列表
            fetchAccsData();
            setIsAddModalOpen(false);
            clearForm();
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
    const clearForm = () => {
        setNewAccount({
            AccID: '',
            Password: '',
            AccType: '',
            UP_User:'',
        });
        closeModal();
    }
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
        const maxPage = Math.ceil(Accounts.length / AccountsPerPage);
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
            <Modal isOpen={isAddModalOpen} onClose={() => closeModal()} >
                <div className="flex justify-center items-center h-full">
                    <form onSubmit={handleSubmit} className="w-full max-w-xl p-2 bg-white rounded-lg">
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2">ID:</label>
                            <input
                                type="text"
                                name="ID"
                                disabled
                                placeholder="ID"
                                value={getMaxID()}
                                onChange={handleInputChange}
                                className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                maxLength={10}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2">AccID:</label>
                            <input
                                type="text"
                                name="AccID"
                                placeholder="AccID"
                                value={newAccount.AccID}
                                onChange={handleInputChange}
                                className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                maxLength={10}
                                autoComplete={"off"}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2">Password:</label>
                            <input
                                type="text"
                                name="Password"
                                placeholder="Password"
                                value={newAccount.Password}
                                onChange={handleInputChange}
                                className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                maxLength={100}
                                autoComplete={"off"}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2">AccType:</label>
                            <input
                                type="text"
                                name="AccType"
                                placeholder="AccType"
                                value={newAccount.AccType}
                                onChange={handleInputChange}
                                className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                maxLength={3}
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-gray-700 text-lg font-bold mb-2">UP_User:</label>
                            <input
                                type="text"
                                name="UP_User"
                                placeholder="UP_User"
                                value={newAccount.UP_User}
                                onChange={handleInputChange}
                                className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                maxLength={20}
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-amber-200 text-black px-4 h-14 hover:bg-amber-400  mr-4 w-40 rounded-lg text-xl"
                        >新增
                        </button>
                        <button
                            type="submit"
                            className="bg-amber-200 text-black px-4 h-14 hover:bg-amber-400  w-40  rounded-lg text-lg"
                            onClick={() => clearForm()}>取消
                        </button>
                        </form>
                </div>
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

            {/*列表*/}
            <div className="h-96 w-full overflow-y-scroll  bg-slate-50 rounded-lg">

                <table className="min-w-full border-2 ">
                    <thead>
                    <tr>
                        {searchAccs ? (null) : (
                            <th className="px-2 py-2 border-b text-center">Check</th>
                        )}
                        <th className="px-6 py-2 border-b text-center">ID</th>
                        <th className="px-3 py-2 border-b text-center">AccID</th>
                        <th className="px-4 py-2 border-b text-center">Password</th>
                        <th className="px-4 py-2 border-b text-center">AccType</th>
                        <th className="px-4 py-2 border-b text-center">UP_Date</th>
                        <th className="px-4 py-2 border-b text-center">UP_User</th>
                        {searchAccs ? (null) : (
                            <>
                                <th className="px-4 py-2 border-b">EDIT</th>
                            </>
                        )}
                    </tr>
                    </thead>
                    <tbody>

                    {searchAccs ? ( // 如果有查詢結果
                        <tr>
                            <td className="py-2 px-4 border-b text-center">{searchAccs.ID}</td>
                            <td className="py-2 px-4 border-b text-center">{searchAccs.AccID}</td>
                            <td className="border-b px-4 py-2 text-center">
                                <span>{'*'.repeat(5)}</span>
                            </td>
                            <td className="py-2 px-4 border-b text-center">{searchAccs.AccType}</td>
                            <td className="border-b px-4 py-2 text-center">{searchAccs.UP_Date}</td>
                            <td className="border-b px-4 py-2 text-center">{searchAccs.UP_User}</td>
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
                                <td className="border-b px-4 py-2 text-center">{account.ID}</td>
                                <td className="border-b px-4 py-2 text-center">{account.AccID}</td>
                                {/*<td className="border-b px-4 py-2 text-center">*/}
                                {/*    <span style={{ WebkitTextSecurity: 'disc' }}>{account.Password.slice(0, 1)}</span>*/}
                                {/*</td>*/}
                                <td className="border-b px-4 py-2 text-center">
                                    <span>{'*'.repeat(5)}</span>
                                </td>
                                <td className="border-b px-4 py-2 text-center">{account.AccType}</td>
                                <td className="border-b px-4 py-2 text-center">{account.UP_Date}</td>
                                <td className="border-b px-4 py-2 text-center">{account.UP_User}</td>
                                {/*刪除按鈕*/}
                                <td className="border-b px-4 py-4" style={{ whiteSpace: 'nowrap' }}>
                                    <div className="flex justify-center" >
                                        <Icon icon="mdi:trash-can-circle" color="red" width="36" height="36" onClick={() => deleteAccount(account.ID)}>刪除</Icon>
                                        <div className="mx-1"></div>
                                        <Icon icon="iconoir:edit" color="green" width="36" height="36" onClick={() => openEditModal(account)}>修改</Icon>
                                    </div>

                                    {/*EditModal內的顯示*/}
                                    <Modal isOpen={isEditModalOpen}  onClose={() => closeModal()} >
                                        <div className="flex justify-center items-center h-full">
                                        <form className="w-full max-w-xl p-2 bg-white rounded-lg">
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-lg font-bold mb-2">ID:</label>
                                                <input
                                                    type="text"
                                                    disabled
                                                    name="ID"
                                                    placeholder="ID"
                                                    value={editAccount?.ID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'ID')}
                                                    className="border border-black w-full md:w-80 rounded-lg p-2 text-center text-lg"
                                                    maxLength={10}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-lg font-bold mb-2">AccID:</label>
                                                <input
                                                    type="text"
                                                    id="AccID"
                                                    name="AccID"
                                                    value={editAccount?.AccID || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AccID')}
                                                    className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                                    maxLength={10}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-lg font-bold mb-2">Password:</label>
                                                <input
                                                    type="text"
                                                    id="Password"
                                                    name="Password"
                                                    value={editAccount?.Password || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'Password')}
                                                    className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                                    maxLength={100}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-lg font-bold mb-2">AccType:</label>
                                                <input
                                                    type="text"
                                                    id="AccType"
                                                    name="AccType"
                                                    value={editAccount?.AccType || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'AccType')}
                                                    className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                                    maxLength={3}
                                                />
                                            </div>
                                            <div className="mb-4">
                                                <label className="block text-gray-700 text-lg font-bold mb-2">UP_User:</label>
                                                <input
                                                    type="text"
                                                    id="UP_User"
                                                    name="UP_User"
                                                    value={editAccount?.UP_User || ''}
                                                    onChange={(e) => handleEditInputChange(e, 'UP_User')}
                                                    className="border border-black w-full rounded-lg p-2 text-center text-lg"
                                                    maxLength={20}
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                onClick={(e) => handleEditSubmit(e,editAccount?.ID)}
                                                className="bg-amber-200 text-black px-4 h-14 hover:bg-amber-400  w-full  rounded-lg text-lg">
                                                修改完成
                                            </button>
                                        </form>
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
