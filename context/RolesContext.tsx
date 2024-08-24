'use client';

import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';

type RolesContextType = {
  roles: Record<string, string> | null;
  loading: boolean;
};

const RolesContext = createContext<RolesContextType | undefined>(undefined);

export function RolesProvider({ children }: { children: ReactNode }) {
  const [roles, setRoles] = useState<Record<string, string> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoles = async () => {
      const storedRoles = localStorage.getItem('roles');

      if (storedRoles) {
        setRoles(JSON.parse(storedRoles));
        setLoading(false);
      } else {
        try {
          const response = await fetch('/api/roles');
          const rolesData = await response.json();

          if (rolesData?.data) {
            const rolesObject = rolesData.data.reduce(
              (
                acc: Record<string, string>,
                role: { id: string; name: string }
              ) => {
                acc[role.name] = role.id;
                return acc;
              },
              {}
            );

            localStorage.setItem('roles', JSON.stringify(rolesObject));
            setRoles(rolesObject);
          }
        } catch (error) {
          console.error('Failed to fetch roles:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchRoles();
  }, []);

  return (
    <RolesContext.Provider value={{ roles, loading }}>
      {children}
    </RolesContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RolesContext);
  if (context === undefined) {
    throw new Error('useRoles must be used within a RolesProvider');
  }
  return context;
}
