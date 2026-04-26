import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext(null);

/**
 * @function useTheme
 * @description Hook personalizado para acceder al contexto de tema
 * @returns {Object} Objeto con theme y toggleTheme
 * @throws {Error} Si se usa fuera de ThemeProvider
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if(!context) throw new Error('useTheme must be used within a ThemeProvider');
    return context;
};

/**
 * @component ThemeProvider
 * @description Proveedor de contexto para la gestión del tema (claro/oscuro).
 *              Persiste la preferencia del usuario en localStorage y aplica el tema al body.
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Componentes hijos que tendrán acceso al contexto de tema
 *
 * @returns {JSX.Element} Provider de ThemeContext con el estado y función de toggle
 *
 * @context
 * - theme: String con el tema actual ('dark' o 'light')
 * - toggleTheme: Función para alternar entre temas
 */
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('dark');

    useEffect(() => {
        // Solo ejecutar en el cliente
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            }
        }
    }, []);

    useEffect(() => {
        // Solo ejecutar en el cliente
        if (typeof window !== 'undefined') {
            document.body.setAttribute('data-theme', theme);
            localStorage.setItem('theme', theme);
        }
    }, [theme]);

    /**
     * @function toggleTheme
     * @description Alterna entre el tema claro y oscuro
     */
    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
    };

    const value = {
        theme,
        toggleTheme
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};