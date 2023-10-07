

import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";
import Logout from "./logout.jsx";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [activeLink, setActiveLink] = useState(0);

    const handleLinkClick = (index) => {
        setActiveLink(index);
    };

    // 假设您有一个存储登录者名称的变量，例如currentUser
    const currentUser = "管理者";

    return (
        <div className={`flex h-screen ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
            <aside className={`bg-stone-200 w-64 min-h-screen p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>


                <div className="flex flex-col justify-between h-full">
                    <div>
                        <ul className="mt-6">

                            <div className="mb-4 text-center text-xl font-semibold">
                                <div className="flex flex-col items-center">
                                    <Icon icon="carbon:user-avatar-filled" style={{ fontSize: '70px' }} />
                                    <span style={{ marginTop: '8px' }}>{currentUser}</span>
                                </div>
                            </div>

                            <li className={`h-8 mt-12 text-center flex justify-center items-center ${activeLink === 1 ? 'bg-slate-500 border border-slate-500 rounded-lg text-white' : ''}`}>
                                <Link to="/acc" onClick={() => handleLinkClick(1)}>
                                    <Icon icon="icon-park-outline:people" style={{ marginRight: '8px', fontSize: '24px' }} /></Link>
                                <Link to="/acc" onClick={() => handleLinkClick(1)}>帳號設置</Link>
                            </li>
                            <li className={`h-8 mt-4 text-center flex justify-center items-center ${activeLink === 2 ? 'bg-slate-500 border border-slate-500 rounded-lg text-white' : ''}`}>
                                <Link to="/patient" onClick={() => handleLinkClick(2)}>
                                    <Icon icon="gridicons:clipboard" style={{ marginRight: '8px', fontSize: '24px' }} /></Link>
                                <Link to="/patient" onClick={() => handleLinkClick(2)}>病患名單</Link>
                            </li>



                        </ul>
                    </div>
                    <div>

                        <button className="w-full hover:bg-red-500 text-black font-bold py-2 px-4 rounded-full " onClick={Logout}>
                            登出
                        </button>

                    </div>
                </div>
            </aside>

            <div className="flex-grow flex flex-col">
                <header className="bg-gray-100 p-2">
                    <button className="p-2" onClick={toggleSidebar}>
                        <Icon icon="carbon:menu" width="24" height="24" />
                    </button>
                </header>
                <main className="bg-gray-100 flex-grow">{children}</main>
                <footer className="text-center p-2 bg-gray-100">HELLO!!!!!</footer>
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;

