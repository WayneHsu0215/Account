import React from 'react';
import ReactDOM from 'react-dom';
import Root from './routes/root';
import Acc from './routes/acc';
import './index.css';
import Layout from "./routes/layout";
import {BrowserRouter, Route, Routes} from "react-router-dom";

// eslint-disable-next-line react-refresh/only-export-components
const App = () => {

    return (
        <BrowserRouter>
            <Routes>

                <Route path="/" element={<Layout><Root /></Layout>} />
                <Route path="/acc" element={<Layout><Acc /></Layout>} />
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


