// SideBar.jsx
import React from "react";
import { useState } from "react";

import SideItem from "./SideItem";
import ProfileModal from "./ProfileModal";

export default function SideBar({ user }) {
    const [isProfileOpen, setIsProfileOpen] = useState(false);

    return (
        <>
            <ProfileModal
                isOpen={isProfileOpen}
                onClose={() => setIsProfileOpen(false)}
            />
            <div className="side-nav fixed z-20">
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
        </>
    );
}
