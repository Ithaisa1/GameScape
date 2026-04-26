/**
 * @file useAuthContext.jsx
 * @description Hook personalizado para acceder al contexto de autenticación.
 *              Proporciona una forma segura de acceder al AuthContext con validación de error.
 * @module Hooks
 */

import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * @hook useAuthContext
 * @description Hook personalizado para acceder al contexto de autenticación. Valida que el hook
 *              se use dentro de un AuthProvider y lanza un error si no es así.
 * @returns {Object} Objeto con el contexto de autenticación (user, login, register, updateProfile, etc.)
 * @throws {Error} Si se usa fuera de un AuthProvider
 * @example
 * const { user, login, logout, isAuthenticated } = useAuthContext();
 */
export const useAuthContext = () =>{
    const context = useContext(AuthContext);
    if(!context){
        throw new Error('useAuthContext must be used within an AuthProvider');
    }
    return context;
}
