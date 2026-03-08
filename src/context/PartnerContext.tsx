import { createContext, useContext, useState, ReactNode } from 'react';

interface PartnerContextType {
    isPartnerMode: boolean;
    togglePartnerMode: () => void;
}

const PartnerContext = createContext<PartnerContextType | undefined>(undefined);

export const PartnerProvider = ({ children }: { children: ReactNode }) => {
    const [isPartnerMode, setIsPartnerMode] = useState(false);

    const togglePartnerMode = () => {
        setIsPartnerMode((prev) => !prev);
    };

    return (
        <PartnerContext.Provider value={{ isPartnerMode, togglePartnerMode }}>
            {children}
        </PartnerContext.Provider>
    );
};

export const usePartner = () => {
    const context = useContext(PartnerContext);
    if (context === undefined) {
        throw new Error('usePartner must be used within a PartnerProvider');
    }
    return context;
};
