import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponseDto } from '@/types';
import { login as apiLogin, register as apiRegister } from '@/services/api';

interface AuthContextType {
    user: User | null;
    isLoading: boolean;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<boolean>;
    register: (name: string, email: string, password: string) => Promise<User | null>;
    logout: () => void;
    setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem("smartfix_user");
        const token = localStorage.getItem("token");


        if (savedUser && token) {
            try {
                const dto: AuthResponseDto = JSON.parse(savedUser);
                const currentUser: User = { ...dto, token: token }; 

                setUser(currentUser);
            } catch (e) {
                console.error("=> ОШИБКА ПАРСИНГА JSON:", e);
            }
        } else {
        }
        setLoading(false);
    }, []);

    const loginAction = async (email: string, password: string): Promise<boolean> => {
        const data = await apiLogin(email, password);

        if (data) {
            const loggedUser: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                isVerified: data.isVerified,
                phone: data.phone,
                avatar: data.avatar,
                token: data.token
            };

            setUser(loggedUser);

            // 2. ИСПРАВЛЕНО: Железно сохраняем новые данные в память браузера
            localStorage.setItem("smartfix_user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return true;
        }
        return false;
    };

    const registerAction = async (name: string, email: string, password: string): Promise<User | null> => {
        const data = await apiRegister(name, email, password);

        if (data) {
            const registeredUser: User = {
                id: data.id,
                name: data.name,
                email: data.email,
                role: data.role,
                isVerified: data.isVerified,
                avatar: data.avatar,
                token: data.token
            };

            setUser(registeredUser);

            // 3. ИСПРАВЛЕНО: Сохраняем пользователя сразу после регистрации
            localStorage.setItem("smartfix_user", JSON.stringify(data));
            localStorage.setItem("token", data.token);

            return registeredUser;
        }
        return null;
    };

    const logout = () => {
        localStorage.removeItem("smartfix_user");
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            setUser,
            isLoading,
            login: loginAction,
            register: registerAction,
            logout,
            isAuthenticated: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};