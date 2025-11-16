import { useEffect, useState } from 'react';

function Loading({ color = "red" }) {
    // --- NEW: Track if loading is taking too long ---
    const [showTimeoutWarning, setShowTimeoutWarning] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setShowTimeoutWarning(true), 10000);
        return () => clearTimeout(timer);
    }, []);
    // --- END NEW ---

    const colorMap = {
        green: "var(--color-green)",
        blue: "var(--color-blue)",
        red: "var(--color-primary)",
    };

    const ringColor = colorMap[color] || "var(--color-primary)";

    return <div className="w-full h-screen flex flex-col items-center justify-center bg-white gap-10">
        <div className="flex items-center gap-10">
            <p style={{ color: "var(--color-black)" }} className="header-main">
                Loading...
            </p>
            <div
                className="loader-conic"
                style={{
                    background: `conic-gradient(${ringColor} 0deg 270deg, transparent 270deg 360deg)`
                }}
            ></div>
        </div>
        {/* --- NEW: Timeout warning message --- */}
        {showTimeoutWarning && (
            <div className="mt-8 text-center font-label">
                The page appears to be taking too long to load.<br />
                Please refresh the page or try again later.
            </div>
        )}
    </div>;
}

export default Loading;
