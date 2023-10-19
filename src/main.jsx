import React ,{useState, useEffect} from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/root';
import Acc from './routes/acc';
import Patient from './routes/patient.jsx';
import Layout from "./routes/layout";
import './index.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {AuthProvider} from "./routes/AuthContext";
import { BrowserRouter, Route, Routes,useNavigate,Navigate} from 'react-router-dom';

// eslint-disable-next-line react-refresh/only-export-components
export function getCookie(name) {
    const cDecoded = decodeURIComponent(document.cookie);
    const cArray = cDecoded.split('; ');
    let  result = null;
    cArray.forEach((val)=>{
        if(val.split('=')[0]===name){
            result = val.split('=')[1];
        }
    })
    return result;
}

export function UnLoginText_Move() {
    const navigate = useNavigate();
    const [countdown, setCountdown] = useState(5); // 初始倒计时秒数

    useEffect(() => {
        const interval = setInterval(() => {
            setCountdown((prevCountdown) => prevCountdown - 1);
        }, 1000);

        // 倒數结束跳轉到登入畫面
        if (countdown === 0) {
            clearInterval(interval); //倒數完清除interval
            navigate('/');
        }

        // 清除 interval
        return () => {
            clearInterval(interval);
        };
    }, [countdown, navigate]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="flex flex-col items-center border-4 border-gray-400 p-8 rounded-lg shadow-lg">
                <h1 className="text-5xl font-semibold text-gray-800">請先登入!!</h1>
                <p className="text-2xl text-gray-600 mt-4">{countdown}秒後轉至登入畫面...</p>
            </div>
        </div>
    );
}

const App = () => {

    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route path="/" element={<Navigate to="/root"/>}/>
                <Route path="/root" element={<Root/>}/>
                <Route path="/acc" element={<Layout><Acc /></Layout>} />
                <Route path="/patient" element={<Layout><Patient /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
        <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById('root')
);
