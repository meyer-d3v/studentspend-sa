import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
// @ts-ignore
import { auth, db } from "../firebaseConfig/config";

export const useContext = () => {
  const [user, setUser] = useState<any | null>(null);
  const [role, setRole] = useState<string>("default");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (!currentUser) {
        setUser(null);
        setRole("default");
        setLoading(false);
        return;
      }

      try {
        const docRef = doc(db, "users", currentUser.uid);
        const userSnap = await getDoc(docRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUser({ id: userSnap.id, ...userData });
          setRole(userData.role);
          console.log("User role:", userData.role);
        } else {
          console.log("No user found for ID:", currentUser.uid);
          setUser(null);
          setRole("default");
        }
      } catch (err) {
        console.error("Error fetching user role:", err);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return { user, role, loading };
};
