import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Lock, User as UserIcon, Mail, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '../components/ui/Toast';
import { useTheme } from '../context/ThemeContext';
import AuthLayout from '../components/auth/AuthLayout';
import GoogleAuthButton from '../components/auth/GoogleAuthButton';
import { Text } from '../components/ui/Text';

const SignupPage = () => {
    const { registerUser, loginWithGoogle } = useContext(AuthContext);
    const { isDark, toggleTheme } = useTheme();
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const toast = useToast();

    const getPasswordStrength = () => {
        if (password.length === 0) return null;
        if (password.length < 6) return { label: 'Insecure', level: 1, color: '#FF3B30' };
        if (password.length < 8) return { label: 'Weak', level: 2, color: '#FF9500' };
        if (/[A-Z]/.test(password) && /[0-9]/.test(password) && /[^A-Za-z0-9]/.test(password)) {
            return { label: 'Elite', level: 4, color: '#34C759' };
        }
        return { label: 'Secure', level: 3, color: 'var(--accent)' };
    };

    const passwordStrength = getPasswordStrength();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            setIsLoading(false);
            return;
        }

        const result = await registerUser(username, email, password);
        setIsLoading(false);

        if (result === true) {
            toast.success('Account created successfully!', { title: 'Welcome to FixPix' });
            navigate('/app');
        } else {
            let errorMsg = "Registration failed. Please try again.";
            if (result && typeof result === 'object' && result.error) {
                errorMsg = result.error;
            }
            setError(errorMsg);
            toast.error(errorMsg);
        }
    };

    return (
        <AuthLayout 
            title="Join the Future" 
            subtitle="Create your neural profile"
            isDark={isDark}
            toggleTheme={toggleTheme}
        >
            <div className="space-y-6">
                {/* Google Sign Up */}
                <div className="flex justify-center w-full">
                    <GoogleAuthButton
                        onSuccess={async (credentialResponse) => {
                            setIsLoading(true);
                            const success = await loginWithGoogle(credentialResponse.credential);
                            setIsLoading(false);
                            if (success) {
                                toast.success('Welcome to FixPix!', { title: 'Registration Successful' });
                                navigate('/app');
                            }
                        }}
                        onError={() => toast.error('Google Sign Up Failed')}
                        isDark={isDark}
                        text="signup_with"
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
                            Username
                        </Text>
                        <div className="relative group/input flex items-center">
                            <div className="absolute left-4 z-10 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-all opacity-60">
                                <UserIcon size={18} />
                            </div>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                                placeholder="Neural Explorer"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Text as="label" variant="caption" tone="tertiary" className="block font-semibold uppercase tracking-[0.2em] ml-1">
                            Email
                        </Text>
                        <div className="relative group/input flex items-center">
                            <div className="absolute left-4 z-10 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-all opacity-60">
                                <Mail size={18} />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                                placeholder="hello@example.com"
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
                        {passwordStrength && (
                            <div className="mt-2 px-1">
                                <div className="h-1 rounded-full bg-[var(--fill-tertiary)] overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${passwordStrength.level * 25}%` }}
                                        className="h-full transition-colors"
                                        style={{ backgroundColor: passwordStrength.color }}
                                    />
                                </div>
                                <Text as="p" variant="caption" className="font-black uppercase tracking-widest mt-1.5" style={{ color: passwordStrength.color }}>
                                    {passwordStrength.label}
                                </Text>
                            </div>
                        )}
                    </div>

                    <div className="space-y-1">
                        <Text as="label" variant="caption" tone="tertiary" className="block font-semibold uppercase tracking-[0.2em] ml-1">
                            Confirm Password
                        </Text>
                        <div className="relative group/input flex items-center">
                            <div className="absolute left-4 z-10 text-[var(--text-tertiary)] group-focus-within/input:text-[var(--accent)] transition-all opacity-60">
                                <Lock size={18} />
                            </div>
                            <input
                                type={showPassword ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="w-full h-[52px] pl-11 pr-4 rounded-[14px] text-[var(--text-primary)] bg-[var(--surface-elevated)] border border-[var(--border-subtle)] shadow-[inset_0_1px_2px_rgba(0,0,0,0.04)] outline-none transition-all placeholder:text-black/30 focus:border-[var(--accent)] focus:ring-4 focus:ring-[var(--accent-soft)]"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        disabled={isLoading}
                        whileHover={{ y: -1, boxShadow: '0 10px 24px var(--accent-soft)' }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full h-[54px] mt-4 text-white font-medium rounded-full transition-all flex items-center justify-center gap-2 disabled:opacity-50 bg-[var(--accent)] shadow-[0_6px_20px_rgba(0,122,255,0.25),inset_0_1px_0_rgba(255,255,255,0.2)]"
                    >
                        {isLoading ? 'Creating Memory...' : 'Register'}
                    </motion.button>
                </form>

                <Text as="p" variant="callout" tone="secondary" className="text-center font-semibold pt-4">
                    Already part of the neural net?{' '}
                    <Link to="/login" className="text-[var(--accent)] font-black hover:underline tracking-tight">Access Link</Link>
                </Text>
            </div>
        </AuthLayout>
    );
};

export default SignupPage;
