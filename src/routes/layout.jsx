// eslint-disable-next-line no-unused-vars
import React, { useState } from 'react';
import PropTypes from "prop-types";
import { Icon } from "@iconify/react";
import { Link } from "react-router-dom";

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    const [activeLink, setActiveLink] = useState(0); // 用於跟蹤當前活動的鏈接狀態
    const handleLinkClick = (index) => {
        setActiveLink(index);
    };


    return (
        <div className={`flex h-screen ${isSidebarOpen ? 'overflow-hidden' : ''}`}>
            {/* 側邊欄 */}
            <aside className={`bg-stone-200 w-64 min-h-screen p-4 ${isSidebarOpen ? 'block' : 'hidden'}`}>
                {/* 在這裡添加側邊欄的內容 */}
                <ul className="mt-8">
                    <li className={`text-center ${activeLink === 0 ? 'bg-slate-500 border border-slate-500 rounded-lg text-white' : ''}`}>
                        <Link to="/" onClick={() => handleLinkClick(0)}>病患名單</Link>
                    </li>
                    <li className={`text-center mt-4 ${activeLink === 1 ? 'bg-slate-500 border border-slate-500 rounded-lg text-white' : ''}`}>
                        <Link to="/acc" onClick={() => handleLinkClick(1)}>帳號設置</Link>
                    </li>
                </ul>
            </aside>

            <div className="flex-grow flex flex-col">
                {/* 頁面內容 */}
                <header className="bg-gray-100 p-2">
                    {/* 切換側邊欄按鈕 */}
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
