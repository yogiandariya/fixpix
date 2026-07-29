import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Lock, User as UserIcon, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { Text } from '../components/ui/Text';

const LoginPage = () => {
    const { loginUser, loginWithGoogle } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const success = await loginUser(identifier, password);
        setIsLoading(false);

        if (success) {
            toast.success('Welcome back!', { title: 'Login Successful' });
            navigate('/app');
        } else {
            setError("Invalid credentials. Please try again.");
            toast.error('Invalid credentials. Please try again.');
        }
    };

    return (
        <AuthLayout 
            title="Welcome Back" 
            subtitle="Sign in to your neural workspace"
            isDark={isDark}
            toggleTheme={toggleTheme}
        >
            <div className="space-y-6">
                {/* Google Login */}
                <div className="flex justify-center w-full">
                    <GoogleAuthButton
                        onSuccess={async (credentialResponse) => {
                            setIsLoading(true);
                            const success = await loginWithGoogle(credentialResponse.credential);
                            setIsLoading(false);
                            if (success) {
                                toast.success('Welcome back!', { title: 'Login Successful' });
                                navigate('/app');
                            }
                        }}
                        onError={() => toast.error('Google Login Failed')}
                        isDark={isDark}
                        text="continue_with"
                    />
                </div>

                <div className="relative flex items-center">
                    <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
                    <Text as="span" variant="caption" tone="tertiary" className="flex-shrink-0 mx-4 font-black uppercase tracking-[0.2em]">
                        Or use email
                    </Text>
                    <div className="flex-grow border-t border-[var(--border-subtle)]"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-500/10 border border-red-500/20 rounded-[var(--radius-xl)] text-red-500 text-center"
                            >
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <div className="space-y-1">
                        <Text as="label" variant="caption" tone="tertiary" className="block font-semibold uppercase tracking-[0.2em] ml-1">
                            Identifier
                        </Text>
                        <div className="relative group/input flex items-center">
                            <div className="absolute left-4 z-10 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-all opacity-60">
                                <UserIcon size={18} />
                            </div>
                            <input
                                type="text"
                                value={identifier}
                                onChange={(e) => setIdentifier(e.target.value)}
                                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-[var(--text-quaternary)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                                placeholder="Username or Email"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Text as="label" variant="caption" tone="tertiary" className="block font-semibold uppercase tracking-[0.2em] ml-1">
                            Password
                        </Text>
                        <div className="relative group/input flex items-center">
                            <div className="absolute left-4 z-10 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-all opacity-60">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full h-[52px] pl-11 pr-12 rounded-[14px] text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-[var(--text-quaternary)] focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                                placeholder="••••••••"
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 z-10 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-all opacity-40 hover:opacity-100"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-end pt-1">
                        <button type="button" className="text-ios-caption font-black text-[var(--accent)] uppercase tracking-[0.15em] hover:underline">Forgot password?</button>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ y: -1, boxShadow: '0 10px 24px var(--accent-soft)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-[54px] mt-4 text-white font-medium text-ios-subhead tracking-wide rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                        style={{
                            background: 'var(--accent)',
                            boxShadow: '0 6px 20px rgba(0, 122, 255, 0.25), inset 0 1px 0 rgba(255, 255, 255, 0.2)',
                        }}
                    >
                        {isLoading ? 'Authenticating...' : 'Login'}
                    </motion.button>
                </form>

                <Text as="p" variant="callout" tone="secondary" className="text-center font-semibold pt-4">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-[var(--accent)] font-black hover:underline tracking-tight">Create Profile</Link>
                </Text>
            </div>
        </AuthLayout>
    );
};

export default LoginPage;
