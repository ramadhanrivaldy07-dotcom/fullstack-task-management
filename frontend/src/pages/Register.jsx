import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

function Register() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const redirectTimer = useRef(null);

    useEffect(() => {
        return () => clearTimeout(redirectTimer.current);
    }, []);

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setError("");
            setSuccess("");
            setIsSubmitting(true);

            await api.post("/auth/register", form);

            setSuccess("Registration successful. Please login.");

            redirectTimer.current = setTimeout(() => {
                navigate("/login");
            }, 1000);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Registration failed"
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <h1>Register</h1>

            {error && (
                <p className="alert alert-danger" role="alert">
                    {error}
                </p>
            )}
            {success && (
                <p className="alert alert-success" role="status">
                    {success}
                </p>
            )}

            <form onSubmit={handleSubmit}>
                <label htmlFor="register-name">Name</label>
                <input
                    id="register-name"
                    type="text"
                    name="name"
                    placeholder="Name"
                    value={form.name}
                    onChange={handleChange}
                    autoComplete="name"
                    required
                />

                <label htmlFor="register-email">Email</label>
                <input
                    id="register-email"
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                    autoComplete="email"
                    required
                />

                <label htmlFor="register-password">Password</label>
                <input
                    id="register-password"
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={form.password}
                    onChange={handleChange}
                    autoComplete="new-password"
                    required
                />

                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Registering..." : "Register"}
                </button>
            </form>

            <p>
                Already have an account?{" "}
                <Link to="/login">
                    Login
                </Link>
            </p>
        </div>
    );
}

export default Register;
