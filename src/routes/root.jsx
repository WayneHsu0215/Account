import {useState,useContext} from 'react';
import { useNavigate } from 'react-router-dom';
import {toast} from 'react-toastify';
import AuthContext  from "./AuthContext.jsx";


const Login = () => {
    const {setAuth} = useContext(AuthContext);
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        AccID: '',
        password: '',
        AccType: '',
        UP_User: '',
    });

    const { AccID, password, AccType, UP_User } = formData;


    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };
    const notify = () =>
        toast.success(`登入成功，歡迎回來${AccID}!`, {
            className: "font-semibold",
        });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ AccID, password}),
            });

            const data = await response.json();
            console.log('DATA:',data);
            if(AccID===''||password==='')
            {
                alert('請輸入帳號密碼');
            }else if (data.success) {
                setAuth({loggedIn:true});
                navigate('/patient');
                document.cookie = `AccID=${AccID}`;
                document.cookie = "loggedIn=true";
                window.localStorage.setItem('loggedIn', true);
                notify();
            } else {
                console.error('login failed');
                alert('帳號密碼錯誤');
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };
    const handleOpenSignUpform = (e) => {
        e.preventDefault();
        setShowAdditionalFields(true);
        setFormData({
            AccID: '',
            password: '',
            AccType: '',
            UP_User: '',
        });
    };

    const backToLogin = (e) => {
        e.preventDefault();
        setShowAdditionalFields(false);
        setFormData({
            AccID: '',
            password: '',
            AccType: '',
            UP_User: '',
        });
    }
    const clearInput = (e) => {
        e.preventDefault();
        setFormData({
            AccID: '',
            password: '',
            AccType: '',
            UP_User: '',
        });
    }

    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const accountCountResponse = await fetch('/api/usercount');
            const accountCountData = await accountCountResponse.json();
            const currentAccountCount = accountCountData.count;

            // 生成新的ID
            const newID = currentAccountCount + 1;

            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ID: newID,
                    AccID,
                    password,
                    AccType,
                    UP_User,
                }),
            });

            const data = await response.json();
            console.log('DATA ；',data);
            if (data.success) {
                navigate('/');
                setShowAdditionalFields(false);
                alert('帳戶建立成功，請重新登入');
                setFormData({
                    AccID: '',
                    password: '',
                    AccType: '',
                    UP_User: '',
                });
            } else {
                console.error('Signup failed');
                alert('帳戶建立失敗');
            }
        } catch (error) {
            console.error('Error during login:', error);
            alert('帳號名稱已有人使用');
        }
    };




    return (

        <div className="min-h-screen bg-gray-100 py-4 flex flex-col justify-center sm:py-12">
            <div className="relative py-12 sm:max-w-xl sm:mx-auto">
                <div
                    className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl">
                </div>
                {/*白色外框*/}
                <div className="relative px-6 py-6 bg-white shadow-lg sm:rounded-3xl sm:p-10">
                    {/*含login框*/}
                    <div className=" mx-auto" >
                        {!showAdditionalFields && (
                            <>
                                <div><h1 className=" py-2 text-3xl font-semibold">登入</h1></div>
                            </>)}
                        {showAdditionalFields && (
                            <>
                                <div><h1 className="text-3xl font-semibold">建立帳戶</h1></div>
                            </>)}
                        <div className="divide-y divide-gray-200">
                            {/*form框*/}
                            <form onSubmit={handleLogin}>
                            <div className="py-10 px-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 ">
                                    <div className=" relative w-80">
                                        <input
                                            type="text"
                                            id="AccID"
                                            name="AccID"
                                            value={AccID}
                                            required
                                            onChange={handleChange}
                                            className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none "
                                            placeholder="Username"
                                        />
                                        <label htmlFor="AccID"
                                               className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            Username
                                        </label>
                                    </div>
                                    <div className="relative w-80">
                                        <input
                                            type="password"
                                            id="password"
                                            name="password"
                                            value={password}
                                            onChange={handleChange}
                                            placeholder="Password"
                                            className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none "
                                        />
                                        <label htmlFor="password"
                                               className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                            Password
                                        </label>
                                    </div>
                                        {showAdditionalFields && (
                                        <>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="AccType"
                                                    name="AccType"
                                                    required
                                                    value={AccType}
                                                    onChange={handleChange}
                                                    className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                                    placeholder="AccType"
                                                />
                                                <label htmlFor="AccType"
                                                       className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                                    AccType
                                                </label>
                                            </div>
                                            <div className="relative">
                                                <input
                                                    type="text"
                                                    id="UP_User"
                                                    name="UP_User"
                                                    required
                                                    value={UP_User}
                                                    onChange={handleChange}
                                                    className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                                    placeholder="UP_User"
                                                />
                                                <label htmlFor="UP_User"
                                                       className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                                    UP_User
                                                </label>
                                            </div>
                                            <div>
                                                <button type="submit" className="mr-1 w-40 bg-blue-500 text-white p-2.5 rounded-md hover:bg-blue-600 font-semibold" onClick={clearInput}>清除</button>
                                                <button type="submit" className="w-40 bg-blue-500 text-white p-2.5 rounded-md hover:bg-blue-600 font-semibold" onClick={backToLogin}>取消</button>
                                            </div>
                                            <div>
                                                <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 font-semibold" onClick={handleSignUp}>建立新帳戶</button>
                                            </div>
                                        </>)}
                                    <div className="relative flex justify-between">
                                        {!showAdditionalFields && (
                                            <>
                                                <button type="submit" className="bg-blue-500 text-white rounded-md px-5 py-3 hover:bg-blue-600 mt-8 font-semibold" onClick={handleLogin}>登入</button>
                                                <button type="submit" className="bg-blue-500 text-white rounded-md px-3 py-3 hover:bg-blue-600 mt-8 font-semibold" onClick={handleOpenSignUpform}>建立帳戶</button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
