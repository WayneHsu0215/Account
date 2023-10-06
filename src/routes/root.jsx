import {useState } from 'react';
import { useNavigate } from 'react-router-dom';
const Login = () => {
    const [AccID, setAccID] = useState('');
    const [password, setPassword] = useState('');
    const [AccType, setAccType] = useState('');
    const [UP_User, setUP_User] = useState('');
    const [showAdditionalFields, setShowAdditionalFields] = useState(false);
    const navigate = useNavigate();
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
            console.log('data:',data);
            if(AccID===''||password==='')
            {
                alert('請輸入帳號密碼');
            }else if (data.success) {
                window.localStorage.setItem("loggedIn", true);
                navigate('/patient');
                alert(`登入成功，歡迎!${AccID}`,);
                console.log('localstorage:',window.localStorage);
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
    };


    const handleSignUp = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('/api/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ AccID, password}),
            });

            const data = await response.json();
            console.log('DATA ；',data);

            if (data.success) {
                navigate('/');
                alert(`歡迎!${AccID}`,);
                setShowAdditionalFields(false);
                console.log('localstorage:',window.localStorage);
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
                            <div className="py-10 px-8 text-base leading-6 space-y-4 text-gray-700 sm:text-lg sm:leading-7 ">
                                <div className=" relative w-80">
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={AccID}
                                        required
                                        onChange={(e) => setAccID(e.target.value)}
                                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none "
                                        placeholder="Username"
                                    />
                                    <label htmlFor="Username"
                                           className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                        Username
                                    </label>
                                </div>
                                <div className="relative w-80">
                                    <input
                                        type="password"
                                        id="password"
                                        name="password"
                                        className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                        required
                                        placeholder="Password"
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    <label htmlFor="password" className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">Password</label>
                                </div>
                                {showAdditionalFields && (
                                    <>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                id="accType"
                                                name="accType"
                                                required
                                                value={AccType}
                                                onChange={(e) => setAccType(e.target.value)}
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
                                                id="upUser"
                                                name="upUser"
                                                required
                                                value={UP_User}
                                                onChange={(e) => setUP_User(e.target.value)}
                                                className="peer placeholder-transparent h-12 w-full border-b-2 border-gray-300 text-gray-900 focus:outline-none focus:borer-rose-600"
                                                placeholder="UP_User"
                                            />
                                            <label htmlFor="UP_User"
                                                   className="absolute left-0 -top-3.5 text-gray-600 text-sm peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-440 peer-placeholder-shown:top-2 transition-all peer-focus:-top-3.5 peer-focus:text-gray-600 peer-focus:text-sm">
                                                UP_User
                                            </label>
                                        </div>
                                        <div>
                                            <button type="submit" className="w-full bg-blue-500 text-white p-3 rounded-md hover:bg-blue-600 " onClick={handleSignUp}>建立新帳戶</button>
                                        </div>
                                    </>)}
                                <div className="relative flex justify-between">
                                    {!showAdditionalFields && (
                                        <>
                                            <button type="submit" className="bg-blue-500 text-white rounded-md px-5 py-3 hover:bg-blue-600 mt-8" onClick={handleLogin}>登入</button>
                                            <button type="submit" className="bg-blue-500 text-white rounded-md px-3 py-3 hover:bg-blue-600 mt-8" onClick={handleOpenSignUpform}>建立帳戶</button>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
