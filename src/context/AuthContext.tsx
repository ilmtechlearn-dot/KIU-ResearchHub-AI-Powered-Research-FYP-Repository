import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User;
  setRole: (role: UserRole) => void;
  switchUser: (role: UserRole) => void;
  isLoggedIn: boolean;
}

const DEFAULT_USERS: Record<UserRole, User> = {
  student: {
    id: 'usr-student-01',
    name: 'Farhan Ali',
    email: 'farhan.ali@student.kiu.edu.pk',
    role: 'student',
    studentId: 'KIU-2022-BSCS-042',
    departmentId: 'dept-cs',
    departmentName: 'Department of Computer Science',
  },
  researcher: {
    id: 'usr-researcher-02',
    name: 'Mehmood Alam',
    email: 'mehmood.alam@kiu.edu.pk',
    role: 'researcher',
    departmentId: 'dept-geology',
    departmentName: 'Geology and Mountain Hazards',
    designation: 'MPhil Research Scholar',
  },
  faculty: {
    id: 'usr-faculty-01',
    name: 'Dr. Zafar Iqbal',
    email: 'zafar.iqbal@kiu.edu.pk',
    role: 'faculty',
    departmentId: 'dept-cs',
    departmentName: 'Department of Computer Science',
    designation: 'Associate Professor & Chairperson',
  },
  admin: {
    id: 'usr-admin-01',
    name: 'Dr. Karamat Ali (ASR Director)',
    email: 'admin.research@kiu.edu.pk',
    role: 'admin',
    designation: 'Director Advanced Studies & Research',
  },
  public: {
    id: 'usr-public-guest',
    name: 'Public Guest Visitor',
    email: 'visitor@external.org',
    role: 'public',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentRole, setCurrentRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem('kiu_user_role') as UserRole;
    return saved && DEFAULT_USERS[saved] ? saved : 'student';
  });

  const [user, setUser] = useState<User>(() => DEFAULT_USERS[currentRole]);

  useEffect(() => {
    setUser(DEFAULT_USERS[currentRole]);
    localStorage.setItem('kiu_user_role', currentRole);
  }, [currentRole]);

  const switchUser = (role: UserRole) => {
    setCurrentRole(role);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setRole: setCurrentRole,
        switchUser,
        isLoggedIn: currentRole !== 'public',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
