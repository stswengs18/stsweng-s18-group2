import './App.css'
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchSession } from './fetch-connections/account-connection';
import HomeSDW from './pages/home-sdw';
import HomeLeader from './pages/home-leader';
import Login from './pages/login';
import Loading from './pages/loading';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await fetchSession();
        // console.log("Session:", res);

        if (res.user) {
          setUser(res.user);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();
  }, []);

  if (loading) return <Loading></Loading>;

  if (!user) {
    return <Login />;
  }

  if (user.role === 'head' || user.role === 'supervisor' ) {
    return <HomeLeader />;
  } else if (user.role === 'sdw') {
    return <HomeSDW />;
  } else {
    return <div>Unknown role</div>;
  }
}

export default App;
