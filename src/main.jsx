import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/root';
import Acc from './routes/acc';
import Patient from './routes/patient.jsx';
import './index.css';
import Layout from "./routes/layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {
    //window.localStorage.clear();
    // window.localStorage.setItem("loggedIn",false);
    const isLoggedIn = window.localStorage.getItem("loggedIn");
    console.log(isLoggedIn);
    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={isLoggedIn=="true"?<Patient/> : <Root/>} />
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


