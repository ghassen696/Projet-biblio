// src/hooks/use-auth.ts
import { useState, useEffect } from 'react';

interface User {
  role: 'admin' | 'user' | null;
}

export function useAuth() {
  const [user, setUser] = useState<User>({ role: null });

  useEffect(() => {
    // Simulate fetching user data
    const fetchUser = async () => {
      // Replace this with actual user fetching logic
      const userData = await new Promise<User>((resolve) =>
        setTimeout(() => resolve({ role: 'user' }), 1000)
      );
      setUser(userData);
    };

    fetchUser();
  }, []);

  return { user };
}