import React from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../Components/SideBar";
import { useState, useEffect } from "react";
import { fetchSession } from "../fetch-connections/account-connection";

export default function Unauthorized({ message = "You do not have permission to enter this page." }) {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loadSession = async () => {
            const sessionData = await fetchSession();
            // console.log("Session:", sessionData?.user);
            setUser(sessionData?.user || null);
        };
        loadSession();
    }, []);

    useEffect(() => {
        document.title = "Unauthorized";
    }, []);

    return (
        <>
            <div className="fixed top-0 left-0 right-0 z-50 w-full max-w-[1280px] mx-auto flex justify-between items-center py-5 px-8 bg-white">
                <a href="/" className="main-logo main-logo-text-nav">
                    <div className="main-logo-setup folder-logo"></div>
                    <div className="flex flex-col">
                        <p className="main-logo-text-nav-sub mb-[-1rem]">Unbound Manila Foundation Inc.</p>
                        <p className="main-logo-text-nav">Case Management System</p>
                    </div>
                </a>
            </div>

            <main className="min-h-[calc(100vh-4rem)] w-full flex mt-[9rem]">
                <SideBar user={user} />

                <div className="flex flex-col w-full gap-15 ml-[15rem] justify-center items-center transform -translate-y-1/5">

                    <div className="flex gap-10 items-center justify-center">
                        <div className="main-logo-setup unauthorized-logo !w-[6rem] !h-[8rem]"></div>
                        <h1 className="main-logo-text-nav !text-[4rem]">Unauthorized</h1>
                    </div>
                    <p className="font-label">{message}</p>
                    <button
                        onClick={() => navigate("/")}
                        className="btn-primary font-bold-label"
                    >
                        Go Home
                    </button>
                </div>
            </main>
        </>
    );
}
