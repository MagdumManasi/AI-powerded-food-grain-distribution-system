import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/client';
import { ROLES, ROLE_PROFILES, normalizeRole } from './roles';
import { isMockMode } from '../services/dataService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('user');
    if (!saved) {
      // Default to District Officer (Anand Kulkarni, Sangli)
      return { ...ROLE_PROFILES.DISTRICT_OFFICER, id: 2 };
    }
    try {
      const parsed = JSON.parse(saved);
      const normalizedRole = normalizeRole(parsed.role, parsed.email);
      const profile = ROLE_PROFILES[normalizedRole] || ROLE_PROFILES.DISTRICT_OFFICER;
      return {
        ...profile,
        ...parsed,
        role: normalizedRole,
      };
    } catch (e) {
      return { ...ROLE_PROFILES.DISTRICT_OFFICER, id: 2 };
    }
  });

  const [token, setToken] = useState(() => localStorage.getItem('token') || 'demo-auth-token-active');
  const [loading, setLoading] = useState(false);

  // Switch role directly (convenient for guide/evaluator testing)
  const switchRole = (roleKey) => {
    const profile = ROLE_PROFILES[roleKey] || ROLE_PROFILES.DISTRICT_OFFICER;
    const updatedUser = {
      id: profile.role === 'SUPER_ADMIN' ? 1 : 2,
      name: profile.name,
      email: profile.email,
      role: profile.role,
      title: profile.title,
      clearanceLevel: profile.clearanceLevel,
      jurisdiction: profile.jurisdiction,
    };
    setUser(updatedUser);
    const mockToken = `demo_token_${roleKey.toLowerCase()}`;
    setToken(mockToken);
    localStorage.setItem('token', mockToken);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      // If mock mode is active, authenticate directly via mock credentials
      if (isMockMode()) {
        await new Promise((resolve) => setTimeout(resolve, 250)); // realistic UX delay
        const normalizedRole = normalizeRole('', email);
        const profile = ROLE_PROFILES[normalizedRole] || ROLE_PROFILES.DISTRICT_OFFICER;
        const fullUser = {
          ...profile,
          id: normalizedRole === 'SUPER_ADMIN' ? 1 : 2,
        };
        const demoToken = `demo_token_${normalizedRole.toLowerCase()}`;
        setToken(demoToken);
        setUser(fullUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(fullUser));
        return { success: true };
      }

      // If in API mode, attempt backend authentication
      const res = await api.post('/auth/login', { email, password });
      const authData = res.data.data;
      const normalizedRole = normalizeRole(authData.role, authData.email);
      const profile = ROLE_PROFILES[normalizedRole] || ROLE_PROFILES.DISTRICT_OFFICER;

      const fullUser = {
        ...profile,
        id: authData.id,
        name: authData.name || profile.name,
        email: authData.email || profile.email,
        role: normalizedRole,
      };

      setToken(authData.token);
      setUser(fullUser);
      localStorage.setItem('token', authData.token);
      localStorage.setItem('user', JSON.stringify(fullUser));
      return { success: true };
    } catch (err) {
      // In case API fails, check if email matches demo accounts for seamless fallback
      const normalizedRole = normalizeRole('', email);
      if (normalizedRole) {
        const profile = ROLE_PROFILES[normalizedRole];
        const fullUser = {
          ...profile,
          id: normalizedRole === 'SUPER_ADMIN' ? 1 : 2,
        };
        const demoToken = `demo_token_${normalizedRole.toLowerCase()}`;
        setToken(demoToken);
        setUser(fullUser);
        localStorage.setItem('token', demoToken);
        localStorage.setItem('user', JSON.stringify(fullUser));
        return { success: true };
      }

      const msg = err.response?.data?.message || 'Invalid credentials';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  const activeProfile = user?.role ? (ROLE_PROFILES[user.role] || ROLE_PROFILES.DISTRICT_OFFICER) : null;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        switchRole,
        loading,
        isAuthenticated: !!token && !!user,
        roleProfile: activeProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
