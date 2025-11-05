// SideBar.jsx
import React from "react";
import { useState } from "react";

import SideItem from "./SideItem";
import ProfileModal from "./ProfileModal";

export default function SideBar({ user, isMenuOpen = false, setIsMenuOpen, isMobile = false }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    const handleOverlayClick = () => {
        if (setIsMenuOpen) {
            setIsMenuOpen(false);
        }
    };

    const sidebarClasses = isMobile 
        ? `side-nav fixed z-50 ${isMenuOpen ? 'mobile-open' : 'mobile-closed'}` 
        : 'side-nav fixed z-20';

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            
            {/* Mobile overlay */}
            {isMobile && isMenuOpen && (
                <div 
                    className="fixed inset-0 z-30"
                    onClick={handleOverlayClick}
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.3)',
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 30
                    }}
                ></div>
            )}
            
            <div className={sidebarClasses}>
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
                .mobile-closed {
                    transform: translateX(-100%);
                    transition: transform 0.3s ease;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 15rem;
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
                    background: white;
                    padding-top: 8rem;
                }
                
                .mobile-open {
                    transform: translateX(0);
                    transition: transform 0.3s ease;
                    position: fixed;
                    top: 0;
                    left: 0;
                    height: 100vh;
                    width: 15rem;
                    box-shadow: 2px 0 8px rgba(0, 0, 0, 0.15);
                    background: white;
                    padding-top: 8rem;
                }
            `}</style>
        </>
    );
}

//