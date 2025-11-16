import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSession } from '../fetch-connections/account-connection';

export default function Authorization({ allowedRoles, children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();


    useEffect(() => {
        const check = async () => {
            const res = await fetchSession();

            // console.log(res);

            if (!res.user) {
                navigate('/login');
            } else if (!allowedRoles.includes(res.user.role)) {
                navigate('/login');
            } else {
                setUser(res.user);
            }
            setLoading(false);
        };
        check();
    }, [allowedRoles, navigate]);

    if (loading) return <p>Loading...</p>;

    return children;
}
