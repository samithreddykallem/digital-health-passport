
import { useState } from "react";
import API_URL from "../services/api";

function Login({ onSignupClick }) {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("");
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Login failed. Please check your details."
                );
            }

            if (!data.token) {
                throw new Error("Login response did not contain a token.");
            }

            localStorage.setItem("token", data.token);
            setMessage("Login successful! Opening your dashboard...");

            window.setTimeout(() => {
                window.location.reload();
            }, 500);
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page">
            <section
                className="auth-shell"
                aria-label="Login to Digital Health Passport"
            >
                <aside className="auth-visual auth-visual-login">
                    <a
                        className="auth-brand"
                        href="/"
                        aria-label="Digital Health Passport home"
                    >
                        <span className="auth-brand-mark" aria-hidden="true">
                            ✚
                        </span>
                        <span>
                            Digital Health <strong>Passport</strong>
                        </span>
                    </a>

                    <div className="auth-visual-copy">
                        <span className="auth-overline">
                            YOUR HEALTH, IN YOUR HANDS
                        </span>

                        <h2>
                            One safe place
                            <br />
                            for your <span>health journey.</span>
                        </h2>

                        <p>
                            Keep your medical reports and prescriptions
                            organized, accessible, and ready whenever you
                            need them.
                        </p>
                    </div>

                    <div className="auth-illustration" aria-hidden="true">
                        <div className="auth-illustration-circle circle-back" />

                        <div className="auth-illustration-card">
                            <div className="illustration-card-top">
                                <span>✚</span>
                                <i />
                            </div>

                            <div className="illustration-line line-long" />
                            <div className="illustration-line line-medium" />
                            <div className="illustration-line line-short" />

                            <div className="illustration-check">✓</div>
                        </div>

                        <div className="illustration-shield">✚</div>
                        <span className="illustration-plus plus-a">+</span>
                        <span className="illustration-plus plus-b">+</span>
                    </div>

                    <div className="auth-visual-footer">
                        <span className="auth-status-dot" />
                        Your personal health space
                    </div>
                </aside>

                <section className="auth-panel">
                    <div className="auth-panel-inner">
                        <div className="auth-mobile-brand">
                            <span className="auth-brand-mark" aria-hidden="true">
                                ✚
                            </span>
                            <span>
                                Digital Health <strong>Passport</strong>
                            </span>
                        </div>

                        <div className="auth-heading">
                            <span className="auth-heading-icon" aria-hidden="true">
                                ↗
                            </span>

                            <p className="auth-eyebrow">WELCOME BACK</p>
                            <h1>Sign in to your account</h1>

                            <p className="auth-description">
                                Enter your details to access your personal
                                health dashboard.
                            </p>
                        </div>

                        <form className="auth-form" onSubmit={handleSubmit}>
                            <div className="auth-field">
                                <label htmlFor="login-email">
                                    Email address
                                </label>

                                <div className="auth-input-wrap">
                                    <span
                                        className="auth-input-icon"
                                        aria-hidden="true"
                                    >
                                        ✉
                                    </span>

                                    <input
                                        id="login-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="email"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <div className="auth-label-row">
                                    <label htmlFor="login-password">
                                        Password
                                    </label>
                                </div>

                                <div className="auth-input-wrap">
                                    <span
                                        className="auth-input-icon"
                                        aria-hidden="true"
                                    >
                                        ♙
                                    </span>

                                    <input
                                        id="login-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="Enter your password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword((previous) => !previous)
                                        }
                                        aria-label={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                        title={
                                            showPassword
                                                ? "Hide password"
                                                : "Show password"
                                        }
                                    >
                                        {showPassword ? "🙈" : "👁"}
                                    </button>
                                </div>
                            </div>

                            <button
                                className="auth-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="auth-button-spinner" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in <span aria-hidden="true">→</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {message && (
                            <p
                                className="auth-message auth-success"
                                role="status"
                            >
                                {message}
                            </p>
                        )}

                        {error && (
                            <p
                                className="auth-message auth-error"
                                role="alert"
                            >
                                {error}
                            </p>
                        )}

                        <p className="auth-switch">
                            Don’t have an account?
                            <button
                                type="button"
                                className="text-button"
                                onClick={onSignupClick}
                            >
                                Create an account
                            </button>
                        </p>

                        <div className="auth-security-note">
                            <span aria-hidden="true">▣</span>
                            <span>
                                <strong>Your information matters.</strong>
                                <br />
                                Sign in to access your personal health records.
                            </span>
                        </div>
                    </div>
                </section>
            </section>

            <p className="auth-page-footnote">
                Digital Health Passport <span>·</span> Your health. Your control.
            </p>
        </main>
    );
}

export default Login;
