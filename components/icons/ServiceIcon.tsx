import React from 'react';
import { BillsIcon, SubscriptionsIcon } from './IconComponents'; // Default icons

interface ServiceIconProps {
    serviceName: string;
}

const serviceIconMap: Record<string, React.FC> = {
    netflix: () => <img src="/icons/netflix.svg" alt="Netflix" className="w-6 h-6" />,
    spotify: () => <img src="/icons/spotify.svg" alt="Spotify" className="w-6 h-6" />,
    amazonprime: () => <img src="/icons/amazon-prime.svg" alt="Amazon Prime" className="w-6 h-6" />,
    // Add more mappings as needed
};

const ServiceIcon: React.FC<ServiceIconProps> = ({ serviceName }) => {
    const normalizedServiceName = serviceName.toLowerCase().replace(/\s+/g, '');
    const IconComponent = serviceIconMap[normalizedServiceName] || BillsIcon;

    return <IconComponent />;
};

export default ServiceIcon;