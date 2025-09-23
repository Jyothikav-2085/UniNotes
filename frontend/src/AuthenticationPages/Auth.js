import React from 'react';
import { useNavigate } from 'react-router-dom';
const styles = {
    container: {
        position: 'relative',
        minHeight: '100vh',
        width: '100vw',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        background: "url('/UniNotesAuth.png') no-repeat center center",
        backgroundSize: 'cover',
    },
    buttonRow: {
        position: 'absolute',
        left: '50%',
        transform: 'translateX(-50%)',
        bottom: '100px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '15px',
    },
    login: {
        padding: '7px 65px',
        fontSize: '1.1rem',
        background: '#f1c40f',
        color: '#fff',
        border: 'none',
        borderRadius: '45px',
        fontWeight: '600',
        cursor: 'pointer',
        boxShadow: '0 2px 6px rgba(0,0,0,0.12)',
    },
    signupTextContainer: {
        marginTop: '-15px',
        fontSize: '1rem',
        color: '#000000ff',
        cursor: 'default',
        marginBottom: '5px',
    },
    signupLink: {
        bottom: '70px',
        color: '#f1c40f',
        cursor: 'pointer',
        textDecoration: 'underline',
        marginLeft: '6px',
        fontWeight: '600',
    }
};
const AuthPage = () => {
    const navigate = useNavigate();
    const [animateLogin, setAnimateLogin] = React.useState(false);
    const [hoverLogin, setHoverLogin] = React.useState(false);
    const loginStyle = {
        ...styles.login,
        ...(animateLogin ? { transform: 'scale(1.12)' } : {}),
        ...(hoverLogin
            ? { background: '#fff', color: '#f1c40f', border: '2px solid #f1c40f' }
            : {}),
    };
    const handleLoginClick = () => {
        setAnimateLogin(true);
        setTimeout(() => {
            setAnimateLogin(false);
            navigate('/login');
        }, 500);
    };
    return (
        <div style={styles.container}>
            <div style={styles.buttonRow}>
                <button
                    style={loginStyle}
                    onClick={handleLoginClick}
                    onMouseEnter={() => setHoverLogin(true)}
                    onMouseLeave={() => setHoverLogin(false)}
                >
                    Log In
                </button>
                <div style={styles.signupTextContainer}>
                    Don't have an account?{' '}
                    <span
                        style={styles.signupLink}
                        onClick={() => navigate('/signup')}
                    >
                        SignUp Here
                    </span>
                </div>
            </div>
        </div>
    );
};
export default AuthPage;