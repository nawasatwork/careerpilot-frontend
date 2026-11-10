import { useId } from 'react';

function Logo({ size = 30, withWordmark = true, className = '' }) {
    const gradientId = `cp-${useId().replace(/:/g, '')}`;

    return (
        <span className={`inline-flex items-center gap-3 ${className}`}>
            <svg width={size} height={size} viewBox="0 0 32 32" role="img" aria-label="Career Pilot">
                <defs>
                    <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="var(--color-accent)" />
                        <stop offset="100%" stopColor="var(--color-accent-hover)" />
                    </linearGradient>
                </defs>
                <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
                <rect
                    x="1.1"
                    y="1.1"
                    width="29.8"
                    height="29.8"
                    rx="7.9"
                    fill="none"
                    stroke="#ffffff"
                    strokeOpacity="0.22"
                    strokeWidth="0.8"
                />
                <text
                    x="16"
                    y="21.4"
                    textAnchor="middle"
                    fontSize="13"
                    fontWeight="800"
                    letterSpacing="0.2"
                    fill="var(--color-accent-fg)"
                    fontFamily="ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif"
                >
                    CP
                </text>
            </svg>

            {withWordmark && (
                <span translate="no" className="text-[13px] font-semibold uppercase tracking-[0.22em] text-fg">
                    Career Pilot
                </span>
            )}
        </span>
    );
}

export default Logo;
