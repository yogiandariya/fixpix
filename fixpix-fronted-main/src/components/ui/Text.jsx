import React from 'react';

export const TYPOGRAPHY = {
  largeTitle: { className: 'text-ios-large-title' },
  title1: { className: 'text-ios-title1' },
  title2: { className: 'text-ios-title2' },
  title3: { className: 'text-ios-title3' },
  headline: { className: 'text-ios-headline' },
  body: { className: 'text-ios-body' },
  callout: { className: 'text-ios-callout' },
  subhead: { className: 'text-ios-subhead' },
  footnote: { className: 'text-ios-footnote' },
  caption: { className: 'text-ios-caption' },
};

const DEFAULT_TONES = {
  largeTitle: 'primary',
  title1: 'primary',
  title2: 'primary',
  title3: 'primary',
  headline: 'primary',
  body: 'secondary',
  callout: 'secondary',
  subhead: 'secondary',
  footnote: 'tertiary',
  caption: 'tertiary',
};

const TONE_CLASSNAMES = {
  primary: 'text-primary',
  secondary: 'text-secondary',
  tertiary: 'text-tertiary',
  accent: 'text-accent',
  inverse: 'text-white',
};

const DEFAULT_ELEMENTS = {
  largeTitle: 'h1',
  title1: 'h1',
  title2: 'h2',
  title3: 'h3',
  headline: 'h4',
  body: 'p',
  callout: 'p',
  subhead: 'p',
  footnote: 'p',
  caption: 'span',
};

export function Text({
  as,
  variant = 'body',
  tone,
  className = '',
  children,
  ...props
}) {
  const Component = as || DEFAULT_ELEMENTS[variant] || 'p';
  const variantClass = TYPOGRAPHY[variant]?.className || TYPOGRAPHY.body.className;
  const toneClass = TONE_CLASSNAMES[tone || DEFAULT_TONES[variant] || 'secondary'] || '';

  return (
    <Component className={[variantClass, toneClass, className].filter(Boolean).join(' ')} {...props}>
      {children}
    </Component>
  );
}

export default Text;
