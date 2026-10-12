
import { useState } from "react";
import API_URL from "../services/api";

function Signup({ onLoginClick }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        phone: ""
    });

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
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
        setError("");
        setMessage("");

        if (formData.password.length < 8) {
            setError("Password must contain at least 8 characters.");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/api/users/register`, {
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
                    data.error ||
                    (response.status === 409
                        ? "This email is already registered."
                        : "Unable to create your account.")
                );
            }

            setMessage(
                "Account created successfully! You can now sign in."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
                phone: ""
            });

            setShowPassword(false);
        } catch (err) {
            setError(err.message || "Unable to connect to the server.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="auth-page auth-page-signup">
            <section
                className="auth-shell auth-shell-signup"
                aria-label="Create a Digital Health Passport account"
            >
                <aside className="auth-visual auth-visual-signup">
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
                            START YOUR HEALTH JOURNEY
                        </span>

                        <h2>
                            Your health records,
                            <br />
                            <span>all together.</span>
                        </h2>

                        <p>
                            Create your account to keep your medical reports
                            and prescriptions neatly organized in one
                            personal space.
                        </p>
                    </div>

                    <div
                        className="auth-illustration signup-illustration"
                        aria-hidden="true"
                    >
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

                        <div className="illustration-shield">✓</div>
                        <span className="illustration-plus plus-a">+</span>
                        <span className="illustration-plus plus-b">+</span>
                    </div>

                    <div className="auth-visual-footer">
                        <span className="auth-status-dot" />
                        A simpler way to stay organized
                    </div>
                </aside>

                <section className="auth-panel auth-panel-signup">
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
                            <span
                                className="auth-heading-icon signup-heading-icon"
                                aria-hidden="true"
                            >
                                ✦
                            </span>

                            <p className="auth-eyebrow">GET STARTED</p>
                            <h1>Create your account</h1>

                            <p className="auth-description">
                                A few details are all you need to set up your
                                personal health space.
                            </p>
                        </div>

                        <form
                            className="auth-form signup-auth-form"
                            onSubmit={handleSubmit}
                        >
                            <div className="auth-field">
                                <label htmlFor="signup-name">Full name</label>

                                <div className="auth-input-wrap">
                                    <span
                                        className="auth-input-icon"
                                        aria-hidden="true"
                                    >
                                        ♙
                                    </span>

                                    <input
                                        id="signup-name"
                                        type="text"
                                        name="name"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="signup-email">
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
                                        id="signup-email"
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
                                <label htmlFor="signup-phone">
                                    Phone number
                                </label>

                                <div className="auth-input-wrap">
                                    <span
                                        className="auth-input-icon"
                                        aria-hidden="true"
                                    >
                                        ⌕
                                    </span>

                                    <input
                                        id="signup-phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="Enter your phone number"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        autoComplete="tel"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="auth-field">
                                <label htmlFor="signup-password">Password</label>

                                <div className="auth-input-wrap">
                                    <span
                                        className="auth-input-icon"
                                        aria-hidden="true"
                                    >
                                        ♙
                                    </span>

                                    <input
                                        id="signup-password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        placeholder="At least 8 characters"
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="new-password"
                                        minLength={8}
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

                                <p className="auth-field-hint">
                                    Use at least 8 characters for your password.
                                </p>
                            </div>

                            <button
                                className="auth-submit"
                                type="submit"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <span className="auth-button-spinner" />
                                        Creating account...
                                    </>
                                ) : (
                                    <>
                                        Create account{" "}
                                        <span aria-hidden="true">→</span>
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
                            Already have an account?
                            <button
                                type="button"
                                className="text-button"
                                onClick={onLoginClick}
                            >
                                Sign in
                            </button>
                        </p>

                        <div className="auth-security-note">
                            <span aria-hidden="true">▣</span>
                            <span>
                                <strong>Your health space starts here.</strong>
                                <br />
                                Keep your records organized in one place.
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

export default Signup;
