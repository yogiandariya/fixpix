import React from 'react';
import { 
    User as UserIcon, Maximize2, Eraser, ImageMinus,
    Palette, ImagePlus, Sparkles, MessageSquare, Frame, Zap, Sticker, Sliders
} from 'lucide-react';

export const FEATURES = [
    { 
        id: 'face-restore', name: 'Face Restore', subtitle: 'Recover facial details',
        iconClass: 'icon-face', actionLabel: 'Restore Face', icon: <UserIcon size={24} strokeWidth={2} />
    },
    { 
        id: 'super-res', name: 'Super Res', subtitle: 'Enhance image resolution up to 8x',
        iconClass: 'icon-super', actionLabel: 'Upscale Image', icon: <Maximize2 size={24} strokeWidth={2} />, isElite: true
    },
    { 
        id: 'magic-eraser', name: 'Magic Eraser', subtitle: 'Remove unwanted objects instantly',
        iconClass: 'icon-eraser', actionLabel: 'Start Erasing', icon: <Eraser size={24} strokeWidth={2} />
    },
    { 
        id: 'remove-bg', name: 'Remove BG', subtitle: 'Extract subjects automatically',
        iconClass: 'icon-removebg', actionLabel: 'Remove Background', icon: <ImageMinus size={24} strokeWidth={2} />
    },
    { 
        id: 'change-bg', name: 'Change BG', subtitle: 'Generate new environment',
        iconClass: 'icon-style', actionLabel: 'Change Background', icon: <ImagePlus size={24} strokeWidth={2} />
    },
    { 
        id: 'style-transfer', name: 'Style Transfer', subtitle: 'Apply artistic styles to photo',
        iconClass: 'icon-style', actionLabel: 'Apply Style', icon: <Palette size={24} strokeWidth={2} />
    },
    { 
        id: 'text-to-image', name: 'Text→Image', subtitle: 'Generate images from prompt',
        iconClass: 'icon-textimg', actionLabel: '✨ Insert into Canvas', icon: <ImagePlus size={24} strokeWidth={2} />, isElite: true
    },
    { 
        id: 'edit-image', name: 'Edit Image', subtitle: 'Modify with natural language',
        iconClass: 'icon-edit', actionLabel: 'Apply Edit', icon: <Sparkles size={24} strokeWidth={2} />
    },
    { 
        id: 'ai-tagline', name: 'AI Tagline', subtitle: 'Generate smart captions',
        iconClass: 'icon-tagline', actionLabel: '✨ Generate Tagline', icon: <MessageSquare size={24} strokeWidth={2} />
    },
    { 
        id: 'smart-frames', name: 'Smart Frames', subtitle: 'Add automatic decorative borders',
        iconClass: 'icon-frames', actionLabel: 'Apply Frame & Stickers', icon: <Frame size={24} strokeWidth={2} />
    },
    {
        id: 'smart-filters', name: 'Filters', subtitle: 'Apply professional styles instantly',
        iconClass: 'icon-style', actionLabel: 'Open Filters', icon: <Sliders size={24} strokeWidth={2} />
    },
    {
        id: 'sticker-studio', name: 'Stickers', subtitle: 'Create custom stickers',
        iconClass: 'icon-sticker', actionLabel: 'Open Sticker Studio', icon: <Sticker size={24} strokeWidth={2} />, isElite: true
    },
    { 
        id: 'batch', name: 'Batch', subtitle: 'Process multiple photos at once',
        iconClass: 'icon-batch', actionLabel: 'Open Batch Studio', icon: <Zap size={24} strokeWidth={2} />, isElite: true
    }
];
