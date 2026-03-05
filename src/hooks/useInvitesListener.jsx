import { useEffect } from "react";
import { collection, onSnapshot, query, where, orderBy } from "firebase/firestore";
import { db } from "../firebase/config";
import { useStore } from "../store/useStore";

export function useInvitesListener() {
  const user = useStore(s => s.user);
  const setInvites = useStore(s => s.setInvites);

  useEffect(() => {
    if (!user?.uid) {
      setInvites([]);
      return;
    }

    const q = query(
      collection(db, "invites"),
      where("toUid", "==", user.uid),
      where("status", "==", "pending"),
      orderBy("createdAt", "desc")
    );

    const unsub = onSnapshot(q, (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setInvites(data);
    });

    return () => unsub();
  }, [user?.uid, setInvites]);
}