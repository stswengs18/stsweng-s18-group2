import React from "react";
import { useNavigate } from "react-router-dom";
import SideBar from "../Components/SideBar";
import { useState, useEffect } from "react";
import { fetchSession } from "../fetch-connections/account-connection";
import SideItem from "../Components/SideItem";

export default function NotFound({ message = "The page you're looking for does not exist." }) {
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
        document.title = "404 - Page Not Found";
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
                    <h1 className="main-logo-text-nav !text-[4rem]">404 - Page Not Found</h1>
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
