import React from 'react';
import { motion } from 'framer-motion';
import { Zap, X, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Text } from '../ui/Text';

const UpgradeModal = ({ onClose, usage }) => {
    const navigate = useNavigate();

    const handleViewPlans = () => {
        onClose();
        navigate('/app/pricing');
    };

    return (
        <div className="text-center p-4">
            <div className="w-16 h-16 bg-indigo-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-indigo-500" />
            </div>
            
            <Text as="h2" variant="title2" tone="primary" className="font-bold mb-2">
                Usage Limit Reached
            </Text>
            <Text variant="callout" tone="secondary" className="mb-8">
                You've reached your daily limit for <b>{usage?.feature_name || 'this AI feature'}</b> on the <b>{usage?.current_plan || 'Free'}</b> plan. 
                Upgrade now to increase your limits and keep creating!
            </Text>

            <div className="space-y-3">
                <button
                    onClick={handleViewPlans}
                    className="w-full py-3 px-6 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center group"
                >
                    View Upgrade Plans
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                    onClick={onClose}
                    className="w-full py-3 px-6 bg-gray-100 dark:bg-white/5 dark:text-white rounded-xl font-bold hover:bg-gray-200 dark:hover:bg-white/10 transition-all"
                >
                    Maybe Later
                </button>
            </div>

            <Text as="p" variant="caption" tone="tertiary" className="mt-6">
                Limits reset daily at midnight GMT.
            </Text>
        </div>
    );
};

export default UpgradeModal;
