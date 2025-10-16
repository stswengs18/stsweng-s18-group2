// SideBar.jsx
import React from "react";
import { useState } from "react";

import SideItem from "./SideItem";
import ProfileModal from "./ProfileModal";

export default function SideBar({ user, isMenuOpen = false, setIsMenuOpen }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleOverlayClick = () => {
        if (setIsMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            
            {/* Mobile overlay */}
            {isMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-30 z-30"
                    onClick={handleOverlayClick}
                    style={{ 
                        display: window.innerWidth <= 650 ? 'block' : 'none'
                    }}
                ></div>
            )}
            
            <div className={`side-nav fixed z-50 ${isMenuOpen ? 'mobile-open' : ''}`}>
                <SideItem
                    href="/"
                    iconClass="home-button"
                    label="Home"
                    isActive={false}
                />

                {(user?.role == "head") && <SideItem
                    href="/spu"
                    iconClass="spu-button"
                    label="SPU's"
                    isActive={false}
                />}

                {(user?.role == "supervisor" || user?.role == "head") && <SideItem
                    href="/case"
                    iconClass="case-button"
                    label="Cases"
                    isActive={false}
                />}

                {(user?.role == "supervisor" || user?.role == "head") && <SideItem
                    href="/archive"
                    iconClass="archive-button"
                    label="Archive"
                    isActive={false}
                />}

                {(user?._id) && <SideItem
                    href={`/profile/${user._id}`}
                    iconClass="identifying-button"
                    label="Profile"
                    isActive={false}
                />}
            </div>

            <style jsx>{`
                @media (max-width: 650px) {
                    .side-nav {
                        transform: translateX(-100%);
                        transition: transform 0.3s ease;
                        position: fixed;
                        top: 0;
                        left: 0;
                        height: 100vh;
                        width: 15rem;
                        z-index: 50 !important;
                        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
                        background: white;
                        padding-top: 8rem;
                    }
                    
                    .side-nav.mobile-open {
                        transform: translateX(0);
                    }
                    
                    .mobile-overlay {
                        display: block !important;
                        z-index: 20;
                    }
                }
            `}</style>
        </>
    );
}
