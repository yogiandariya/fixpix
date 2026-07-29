import React, { useEffect } from 'react';
import Navbar from '../components/layout/Navbar';
import Footer from '../components/layout/Footer';
import { HeroCollage } from '../components/ui/modern-hero-section';
import FeatureCarousel from '../components/ui/feature-carousel';
import HowItWorks from '../components/sections/HowItWorks';
import BlogPreview from '../components/sections/BlogPreview';
import ModernTestimonials from '../components/sections/ModernTestimonials';
import { Palette, Zap, Eraser, Sparkles, Image } from 'lucide-react';

const LandingPage = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
        // Enable scroll for landing page (body has overflow:hidden by default for app)
        document.body.style.overflow = 'auto';
        return () => {
            document.body.style.overflow = '';
        };
    }, []);

    const heroStats = [
        { value: '3,888,846+', label: 'Users Trusted' },
        { value: '16,015,507+', label: 'Images Processed' },
        { value: '4.9/5', label: 'Average Rating' },
    ];

    const heroImages = [
        'https://plus.unsplash.com/premium_photo-1670282392820-e3590c1c5c54?w=900&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1652161468447-d8abb529b464?w=900&auto=format&fit=crop&q=60',
        'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1500964757637-c85e8a162699?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1596639410348-8470f7fa9f84?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=400&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1532135468830-e51699205b70?w=900&auto=format&fit=crop&q=60',
        '/assets/vibrant_portrait.png',
        '/assets/vibrant_abstract.png',
        '/assets/vibrant_nature.png',
    ];


    return (
        <div
            className="min-h-screen font-sans selection:bg-primary/20 overflow-x-hidden"
            style={{
                backgroundColor: 'var(--bg-primary)',
                color: 'var(--text-primary)',
            }}
        >
            <Navbar />

            <main>
                <HeroCollage 
                    title={
                        <>
                            Restore. <span className="text-[var(--accent)]">Enhance.</span> Relive.
                        </>
                    }
                    subtitle="Restore your old or damaged photos with our advanced AI engine — instantly and beautifully. Trust the world's most advanced photo restoration technology."
                    stats={heroStats}
                    images={heroImages}
                />
                
                <section id="features" className="fixpix-section border-t border-[var(--border-subtle)] bg-[var(--bg-secondary)] overflow-hidden">
                    <div className="max-w-6xl mx-auto px-4 md:px-6 mb-10 md:mb-16 text-center">
                        <span className="inline-block px-3 py-1 rounded-full bg-[var(--accent-soft)] text-[var(--accent)] text-xs font-bold uppercase tracking-wide mb-4">
                            Feature Studio
                        </span>
                        <h2 className="text-2xl md:text-4xl lg:text-6xl font-black text-[var(--text-primary)] tracking-tighter">
                            Advanced Image Engine.
                        </h2>
                        <p className="mt-4 text-[var(--text-secondary)] text-sm md:text-base lg:text-lg max-w-2xl mx-auto font-medium">
                            Discover our suite of neural tools designed to restore, enhance, and protect your digital legacy through our interactive carousel.
                        </p>
                    </div>
                    
                    <FeatureCarousel />
                </section>

                <BlogPreview />
                <HowItWorks />
                <ModernTestimonials />
            </main>

            <Footer />
        </div>
    );
};

export default LandingPage;
