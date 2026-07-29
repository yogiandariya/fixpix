import React, { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Crown, Shield, Rocket, ArrowRight, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { apiEndpoints } from '../lib/api';
import { loadRazorpayScript } from '../utils/payment';
import { useToast } from '../components/ui/Toast';
import { authenticatedFetch } from '../lib/authFetch';
import { Text } from '../components/ui/Text';

const PricingPage = () => {
    const { user, session, isElite, plan: authPlan, refreshSession, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [processingPlan, setProcessingPlan] = useState(null);
    const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'yearly'
    const toast = useToast();

    // The currentPlan is derived directly from AuthContext (SSOT)
    const currentPlan = authPlan ? { name: authPlan } : null;
    const loading = authLoading;

    const handleUpgrade = async (planId) => {
        if (!user) {
            navigate('/login');
            return;
        }

        setProcessingPlan(planId);

        try {
            // 1. Load Razorpay Script
            const isLoaded = await loadRazorpayScript();
            if (!isLoaded) {
                toast.error("Failed to load payment gateway. Check your connection.");
                setProcessingPlan(null);
                return;
            }

            // 2. Create Order in Backend
            const orderResponse = await fetch(apiEndpoints.subscriptions.createOrder, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.access_token}`
                },
                body: JSON.stringify({ plan_id: planId })
            });

            const orderData = await orderResponse.json();
            if (orderData.error) {
                toast.error(orderData.error);
                setProcessingPlan(null);
                return;
            }

            // 3. Open Razorpay Modal
            const options = {
                key: orderData.key_id,
                amount: orderData.amount * 100,
                currency: "INR",
                name: "FixPix AI",
                description: `Upgrade to ${orderData.plan_name}`,
                order_id: orderData.order_id,
                handler: async (response) => {
                    // 4. Verify Payment in Backend
                    // Use fresh token
                    const token = localStorage.getItem('access_token');
                    
                    const verifyResponse = await fetch(apiEndpoints.subscriptions.verifyPayment, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token || session?.access_token}`
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            plan_id: planId
                        })
                    });

                    const verifyData = await verifyResponse.json();
                    if (verifyData.status === 'success') {
                        toast.success(`Success! You have been upgraded to ${planId.toUpperCase()}.`, {
                            title: "Plan Upgraded",
                            duration: 5000
                        });
                        
                        // ─── SaaS Metadata Propagation (v3 Resolution) ──────────
                        if (verifyData.force_refresh) {
                            // Re-fetch everything to ensure namespaced metadata is SSOT
                            await refreshSession(); 
                        }
                        
                        setTimeout(() => {
                            navigate('/app');
                        }, 1500);
                    } else {
                        toast.error(verifyData.error || "Payment verification failed.");
                    }
                },
                prefill: {
                    email: user.email,
                },
                theme: {
                    color: "#6366f1"
                },
                modal: {
                    ondismiss: function() {
                        setProcessingPlan(null);
                    }
                },
                config: {
                    display: {
                        blocks: {
                            upi: {
                                name: "Pay via UPI",
                                instruments: [
                                    {
                                        method: "upi"
                                    }
                                ]
                            }
                        },
                        sequence: ["block.upi", "block.card", "block.netbanking"],
                        preferences: {
                            show_default_blocks: true
                        }
                    }
                }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();

        } catch (err) {
            console.error("Upgrade error:", err);
            toast.error("Something went wrong. Please try again.");
        } finally {
            setProcessingPlan(null);
        }
    };

    const plans = [
        {
            id: 'free',
            name: 'Free',
            price: '₹0',
            description: 'Perfect for casual editing',
            icon: <Rocket className="w-6 h-6 text-blue-400" />,
            features: [
                '5 Daily AI Restoration tasks',
                '3 Background Removals',
                'High Quality Output',
                'With Watermark',
                'Community Support'
            ],
            buttonText: 'Get Started',
            color: 'blue'
        },
        {
            id: billingCycle === 'monthly' ? 'pro' : 'pro_yearly',
            name: 'Pro',
            price: billingCycle === 'monthly' ? '₹149' : '₹1,490',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'For serious creators',
            icon: <Zap className="w-6 h-6 text-indigo-400" />,
            features: [
                '50 Daily AI tasks',
                'No Watermark',
                'High Quality Output',
                'Batch Processing',
                '4K Upscaling (30/day)',
                'Priority Processing'
            ],
            buttonText: `Get ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Pro`,
            color: 'indigo',
            popular: true
        },
        {
            id: billingCycle === 'monthly' ? 'elite' : 'elite_yearly',
            name: 'Elite',
            price: billingCycle === 'monthly' ? '₹399' : '₹3,990',
            period: billingCycle === 'monthly' ? '/month' : '/year',
            description: 'Advanced production power',
            icon: <Crown className="w-6 h-6 text-amber-400" />,
            features: [
                'Unlimited AI usage',
                'No Watermark',
                'High Quality Output',
                'Unlimited 4K Upscaling',
                'Early access to new models',
                'Dedicated Support'
            ],
            buttonText: `Get ${billingCycle === 'monthly' ? 'Monthly' : 'Yearly'} Elite`,
            color: 'amber'
        }
    ];

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto px-6 py-20 px-6">
                <div className="flex flex-col items-center mb-16 gap-6">
                    <div className="h-16 w-96 bg-[var(--fill-secondary)] animate-pulse rounded-2xl" />
                    <div className="h-6 w-128 bg-[var(--fill-secondary)] animate-pulse rounded-xl opacity-60" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[500px] rounded-[var(--radius-xl)] bg-[var(--fill-secondary)] animate-pulse" />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="px-6 py-12 md:py-20 lg:px-8">
            <div className="max-w-7xl mx-auto text-center mb-16">
                <motion.h1 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="italic"
                >
                    <Text as="span" variant="largeTitle" tone="primary" className="font-black">
                        Simple, Transparent <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--accent)] to-purple-600">Pricing</span>
                    </Text>
                </motion.h1>
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 max-w-2xl mx-auto"
                >
                    <Text variant="body" tone="secondary" className="font-semibold">
                    Upgrade your FixPix experience with unlimited AI power and professional tools. Choose a plan that fits your production needs.
                    </Text>
                </motion.div>

                {/* Billing Cycle Toggle */}
                <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-12 flex items-center justify-center gap-5"
                >
                    <Text as="span" variant="caption" tone={billingCycle === 'monthly' ? 'primary' : 'tertiary'} className="font-black uppercase tracking-[0.2em]">
                        Monthly
                    </Text>
                    <button 
                        onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                        className="relative w-16 h-8 rounded-full bg-[var(--fill-secondary)] p-1 transition-all hover:bg-[var(--fill-tertiary)] focus:outline-none border border-[var(--border-subtle)]"
                    >
                        <motion.div 
                            animate={{ x: billingCycle === 'monthly' ? 0 : 32 }}
                            className="w-6 h-6 rounded-full bg-[var(--accent)] shadow-xl"
                        />
                    </button>
                    <Text as="span" variant="caption" tone={billingCycle === 'yearly' ? 'primary' : 'tertiary'} className="font-black uppercase tracking-[0.2em]">
                        Yearly <span className="ml-2 px-3 py-1 bg-green-500 text-white text-xs font-black rounded-full uppercase tracking-wide shadow-lg shadow-green-500/20">Save 20%</span>
                    </Text>
                </motion.div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {plans.map((plan, index) => {
                    const cleanId = plan.id.replace('_yearly', '');
                    const cleanCurrent = currentPlan?.name?.replace('_yearly', '');
                    const isCurrent = cleanCurrent === cleanId;
                    const isProcessing = processingPlan === plan.id;

                    return (
                        <motion.div
                            key={plan.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative flex flex-col p-10 rounded-[var(--radius-xl)] border transition-all duration-500 ${
                                plan.popular 
                                    ? 'border-[var(--accent)] bg-[var(--surface-elevated)] shadow-[var(--depth-3)] scale-105 z-10' 
                                    : 'border-[var(--border-subtle)] bg-[var(--surface-elevated)] backdrop-blur-3xl'
                            } hover:border-[var(--accent-transparent)]`}
                        >
                            {plan.popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-5 py-1.5 bg-[var(--accent)] text-white text-ios-caption font-black rounded-full uppercase tracking-wide shadow-xl shadow-[var(--accent-soft)]">
                                    Most Popular
                                </div>
                            )}

                            <div className="mb-10">
                                <div className="w-14 h-14 rounded-[var(--radius-lg)] flex items-center justify-center mb-6 bg-[var(--fill-secondary)] border border-[var(--border-subtle)]">
                                    {plan.icon}
                                </div>
                                <Text as="h3" variant="title2" tone="primary" className="font-black">
                                    {plan.name}
                                </Text>
                                <div className="mt-4 flex items-baseline gap-x-2">
                                    <Text as="span" variant="largeTitle" tone="primary" className="font-black">
                                        {plan.price}
                                    </Text>
                                    {plan.period && <Text as="span" variant="caption" tone="tertiary" className="font-black uppercase tracking-[0.2em]">{plan.period}</Text>}
                                </div>
                                <Text as="p" variant="subhead" tone="secondary" className="mt-4 font-semibold">
                                    {plan.description}
                                </Text>
                            </div>

                            <ul className="space-y-4 mb-10 flex-1">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex gap-x-3 text-[var(--text-secondary)] font-semibold text-ios-footnote">
                                        <Check className="w-5 h-5 text-[var(--accent)] flex-shrink-0" strokeWidth={3} />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            {isElite && plan.id !== 'elite' && plan.id !== 'elite_yearly' ? (
                                <button
                                    disabled
                                    className="w-full h-14 px-6 rounded-[var(--radius-lg)] font-black text-ios-caption uppercase tracking-[0.2em] bg-[var(--fill-secondary)] text-[var(--text-tertiary)] border border-[var(--border-subtle)]"
                                >
                                    Current Tier: Superior
                                </button>
                            ) : (
                                <motion.button
                                    whileHover={!isCurrent && !isProcessing ? { y: -2, boxShadow: 'var(--depth-2)' } : {}}
                                    whileTap={!isCurrent && !isProcessing ? { scale: 0.98 } : {}}
                                    onClick={() => !isCurrent && handleUpgrade(plan.id)}
                                    disabled={isCurrent || isProcessing}
                                    className={`w-full h-14 px-6 rounded-[var(--radius-lg)] font-black uppercase tracking-[0.2em] transition-all focus:outline-none flex items-center justify-center shadow-lg text-ios-caption ${
                                        isCurrent 
                                            ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/50 cursor-default shadow-none' 
                                            : plan.popular
                                                ? 'bg-[var(--accent)] text-white hover:bg-[var(--accent-hover)] shadow-[var(--accent-soft)]'
                                                : 'bg-[var(--fill-secondary)] text-[var(--text-primary)] hover:bg-[var(--fill-tertiary)] border border-[var(--border-subtle)]'
                                    }`}
                                >
                                    {isProcessing ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : isCurrent ? (
                                        'Active Plan'
                                    ) : (
                                        <>
                                            {plan.buttonText}
                                            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={3} />
                                        </>
                                    )}
                                </motion.button>
                            )}
                        </motion.div>
                    );
                })}
            </div>

            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-20 text-center"
            >
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[var(--fill-secondary)] border border-[var(--border-subtle)] text-[var(--text-tertiary)] text-ios-caption font-black uppercase tracking-[0.2em]">
                    <Shield className="w-4 h-4 text-[var(--accent)]" />
                    Secure Payment via Razorpay
                </div>
                <Text as="p" variant="caption" tone="tertiary" className="mt-6 max-w-md mx-auto font-bold uppercase tracking-[0.2em]">
                    All plans include a 30-day billing cycle. You can cancel your subscription at any time from your settings page.
                </Text>
            </motion.div>
        </div>
    );
};

export default PricingPage;
