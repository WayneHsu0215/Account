import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import Logout from "./logout.jsx";
import {getCookie} from "../main.jsx";

const Layout = ({ children }) => {
    const [activeLink, setActiveLink] = useState(0);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    const handleLinkClick = (index) => {
        setActiveLink(index);
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const handleSidebarMouseEnter = () => {
        setIsSidebarHovered(true);
    };

    const handleSidebarMouseLeave = () => {
        setIsSidebarHovered(false);
    };

    const cu = getCookie("AccID");
    return (
        <div className={`flex h-screen`}>
            <aside
                onMouseEnter={handleSidebarMouseEnter}
                onMouseLeave={handleSidebarMouseLeave}
                className={`${
                    (isSidebarOpen || isSidebarHovered) ? 'w-64' : 'w-16'
                } bg-stone-200 min-h-screen p-4 transition-all duration-300`}
            >
                <div className="flex flex-col justify-between h-full">
                    <div>
                        <ul className="mt-6">
                            <div className="mb-4 text-center text-xl font-semibold">
                                <div className="flex flex-col items-center">
                                    <Icon
                                        icon="carbon:user-avatar-filled"
                                        style={{ fontSize: (isSidebarOpen || isSidebarHovered) ? '70px' : '40px' }}
                                    />
                                    {(isSidebarOpen || isSidebarHovered) && <span style={{ marginTop: '8px' }}>{cu}</span>}
                                </div>
                            </div>
                            <li
                                className={`h-8 mt-12  text-center flex justify-center items-right ${
                                    activeLink === 2
                                        ? 'bg-slate-500 border border-slate-500 rounded-lg text-white'
                                        : ''
                                }`}
                            >
                                <Link to="/patient" onClick={() => handleLinkClick(2)}>
                                    <div className="flex items-center  pl-2 pt-1">
                                        <Icon
                                            icon="gridicons:clipboard"
                                            style={{ marginRight: '8px', fontSize: '24px' }}
                                        />
                                        {(isSidebarOpen || isSidebarHovered) && <span>病患名單</span>}
                                    </div>
                                </Link>
                            </li>
                            <li
                                className={`h-8 mt-4 text-center flex justify-center items-center ${
                                    activeLink === 1
                                        ? 'bg-slate-500 border border-slate-500 rounded-lg text-white'
                                        : ''
                                }`}
                            >
                                <Link to="/acc" onClick={() => handleLinkClick(1)}>
                                    <div className="flex items-center pl-2 ">
                                        <Icon
                                            icon="icon-park-outline:people"
                                            style={{ marginRight: '8px', fontSize: '24px' }}
                                        />
                                        {(isSidebarOpen || isSidebarHovered) && <span>帳號設置</span>}
                                    </div>
                                </Link>
                            </li>
                        </ul>
                    </div>
                    <div>
                        <button
                            className="w-full hover:bg-red-500 text-black font-bold py-2 px-4 rounded-full flex items-center justify-center " onClick={Logout}
                        >
                            {(isSidebarOpen || isSidebarHovered) ? (
                                <span>登出</span>
                            ) : (
                                <div>
                                    <Icon icon="tabler:logout" style={{ fontSize: '24px' }} />
                                </div>
                            )}
                        </button>
                    </div>
                </div>
            </aside>
            <div className="flex-grow flex flex-col overflow-hidden"> {/* Added 'overflow-hidden' */}
                <header className="bg-gray-100 p-2">

                </header>
                <main className="bg-gray-100 overflow-y-auto flex-grow"> {/* Added 'overflow-y-auto' */}
                    {children}

             </main>
                <button
                    className="font-bold py-2 px-4 rounded-full"
                    onClick={toggleSidebar}
                >
                    <Icon
                        icon="icon-park-outline:nail-polish"
                        width="12"
                        height="12"
                        style={{ transform: isSidebarOpen ? 'rotate(180deg)' : '' }}
                    />
                </button>
                <footer className="text-center  bg-gray-100 ">Copyrights © All Rights Reserved </footer>
            </div>
        </div>
    );
};

Layout.propTypes = {
    children: PropTypes.node.isRequired,
};

export default Layout;
