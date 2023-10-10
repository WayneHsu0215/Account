import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/root';
import Acc from './routes/acc';
import Patient from './routes/patient.jsx';
import './index.css';
import Layout from "./routes/layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
const App = () => {
    const checklogin = getCookie("loggedIn");
    return (
        <BrowserRouter>
            <ToastContainer />
            <Routes>
                <Route exact path="/" element={getCookie(checklogin)==="true"?<Patient/> : <Root/>} />
                {/*<Route path="/" element={<Layout><Root /></Layout>} />*/}
                <Route path="/acc" element={<Layout><Acc /></Layout>} />
                <Route path="/patient" element={<Layout><Patient /></Layout>} />
            </Routes>
        </BrowserRouter>
    );
};

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
