import React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { motion, AnimatePresence } from 'framer-motion';

function getColorFromId(id) {
    let hash = 0;
    const strId = id.toString();
    for (let i = 0; i < strId.length; i++) {
        hash = strId.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = (hash % 360 + 360) % 360;
    return `hsl(${hue}, 70%, 50%)`;
}

function hslToRgb(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
        l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function getTextColorForBackground(hsl) {
    const match = hsl.match(/hsl\((.+), (.+)%, (.+)%\)/);
    if (!match) return "white";
    const [, h, s, l] = match.map(Number);
    const [r, g, b] = hslToRgb(h, s, l);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "black" : "white";
}

export default function ProfileModal({ isOpen, onClose }) {
    const userData = {
        id: "1234567890",
        username: "Employee.Yippee",
        email: "hello@email.com",
        role: "supervisor",
        spu: "MNL",
        contact_number: "0917-123-4567"
    };


    const [projectLocation, setProjectLocation] = useState([
        {
            name: "Manila",
            projectCode: "MNL",
        },
        {
            name: "Cebu",
            projectCode: "CEB",
        },
        {
            name: "Davao",
            projectCode: "DVO",
        },
        {
            name: "Baguio",
            projectCode: "BAG",
        },
        {
            name: "Iloilo",
            projectCode: "ILO",
        },
        {
            name: "Zamboanga",
            projectCode: "ZAM",
        }
    ]);

    const initials = userData.username?.charAt(0).toUpperCase();
    const bgColor = getColorFromId(userData.username || '');
    const textColor = getTextColorForBackground(bgColor);

    const navigate = useNavigate();

    const handleLogout = () => {
        onClose();
        navigate('/login');
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <div className="absolute inset-0 bg-black/50" onClick={onClose}></div>

                    <div className="relative bg-white rounded-lg drop-shadow-card max-w-[60rem] w-full min-h-[30rem] z-10 overflow-hidden flex flex-col">
                        <div className="w-full p-5 drop-shadow-base bg-gray-100">
                            <h2 className="header-sub">My Profile</h2>
                        </div>

                        <div className="flex flex-col items-center gap-10 flex-1 p-10">
                            <div className='flex gap-20 items-center'>
                                <div
                                    className="rounded-full h-[8rem] w-[8rem] flex justify-center items-center header-sub text-[3rem]"
                                    style={{ backgroundColor: bgColor, color: textColor }}
                                >
                                    {initials}
                                </div>

                                <div className="grid grid-cols-2 gap-x-10 gap-y-4">
                                    <div className="flex flex-col">
                                        <p className="header-sub">Username:</p>
                                        <p className="header-plain">{userData.username}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="header-sub">SDW ID:</p>
                                        <p className="header-plain">{userData.id}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="header-sub">Email:</p>
                                        <p className="header-plain">{userData.email}</p>
                                    </div>
                                    <div className="flex flex-col">
                                        <p className="header-sub">Contact Number:</p>
                                        <p className="header-plain">{userData.contact_number}</p>
                                    </div>
                                </div>


                            </div>
                            <div className="w-full flex gap-3 justify-around">
                                <p className='header-plain'><span className="header-sub">Role:</span> {userData.role === "sdw" ? "SDW" : userData.role === "supervisor" ? "Supervisor" : "Admin"}</p>
                                <p className='header-plain'><span className="header-sub">SPU:</span> {userData.spu}</p>
                            </div>

                            <div className='flex gap-20'>
                                <button
                                    onClick={onClose}
                                    className="btn-outline font-bold-label mt-4"
                                >
                                    Close
                                </button>

                                <button
                                    onClick={handleLogout}
                                    className="btn-primary font-bold-label mt-4"
                                >
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
