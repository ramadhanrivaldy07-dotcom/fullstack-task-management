import { useEffect, useState } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Tasks from "./pages/Tasks";

function App() {
    const [token, setToken] = useState(
        () => localStorage.getItem("token")
    );

    const handleLogin = (newToken) => {
        localStorage.setItem("token", newToken);
        setToken(newToken);
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        setToken(null);
    };

    useEffect(() => {
        window.addEventListener("auth:unauthorized", handleLogout);

        return () => {
            window.removeEventListener(
                "auth:unauthorized",
                handleLogout
            );
        };
    }, []);

    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/login"
                    element={
                        token
                            ? <Navigate to="/tasks" replace />
                            : <Login onLogin={handleLogin} />
                    }
                />

                <Route
                    path="/register"
                    element={
                        token
                            ? <Navigate to="/tasks" replace />
                            : <Register />
                    }
                />

                <Route
                    path="/tasks"
                    element={
                        token
                            ? <Tasks onLogout={handleLogout} />
                            : <Navigate to="/login" replace />
                    }
                />

                <Route
                    path="*"
                    element={
                        <Navigate
                            to={token ? "/tasks" : "/login"}
                            replace
                        />
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default App;
