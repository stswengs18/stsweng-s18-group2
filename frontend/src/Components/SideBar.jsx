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
            
            {isMenuOpen && (
                <div 
                    className="mobile-overlay fixed inset-0 bg-black bg-opacity-50 z-30"
                    onClick={handleOverlayClick}
                    style={{ display: 'none' }}
                ></div>
            )}
            
            <div className={`side-nav fixed z-40 ${isMenuOpen ? 'mobile-open' : ''}`}>
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
                        position: absolute;
                        height: 100vh;
                        box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
                    }
                    
                    .side-nav.mobile-open {
                        transform: translateX(0);
                    }
                    
                    .mobile-overlay {
                        display: block !important;
                    }
                }
            `}</style>
        </>
    );
}
