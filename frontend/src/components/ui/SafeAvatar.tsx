import React, { useState } from 'react';
import { UserIcon } from '@heroicons/react/24/outline';
import { getFullAvatarUrl } from '@/utils/avatarHelper';

interface SafeAvatarProps {
    src: string | undefined | null;
    alt: string;
    className?: string;
    iconClassName?: string;
}

const SafeAvatar: React.FC<SafeAvatarProps> = ({ src, alt, className, iconClassName }) => {
    const [hasError, setHasError] = useState(false);
    const fullUrl = getFullAvatarUrl(src);

    if (!fullUrl || hasError) {
        return (
            <div className={className}>
                <div className={`w-full h-full flex items-center justify-center bg-smartfix-medium ${iconClassName || ''}`}>
                    <UserIcon className="w-1/2 h-1/2 text-white" />
                </div>
            </div>
        );
    }

    return (
        <div className={className}>
            <img
                src={fullUrl}
                alt={alt}
                className="w-full h-full object-cover"
                onError={() => setHasError(true)}
            />
        </div>
    );
};

export default SafeAvatar;
