import { useStore } from "../store/useStore";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import { db, auth } from "../firebase/config";
import Header from "../components/Header";
function Invites() {
  const invites = useStore(s => s.invites);

  const accept = async (inv) => {

    await updateDoc(doc(db, "projects", inv.projectId), {
      members: arrayUnion(auth.currentUser.uid),
    });

    await updateDoc(doc(db, "invites", inv.id), { status: "accepted" });
  };

  const decline = async (inv) => {
    await updateDoc(doc(db, "invites", inv.id), { status: "declined" });
  };

  return (
    <>
    <Header showHome showProfile/>
    <div style={{ padding: 24 }}>
        <h2>Invites</h2>
        {invites.length === 0 && <p>No pending invites</p>}

        {invites.map(inv => (
            <div key={inv.id} style={{ display: "flex", gap: 12, marginTop: 12 }}>
            <div style={{ flex: 1 }}>
                <b>{inv.projectTitle}</b>
                <div>from {inv.inviterUsername}</div>
            </div>
                <button onClick={() => accept(inv)}>Accept</button>
                <button onClick={() => decline(inv)}>Decline</button>
            </div>
        ))}
    </div>
    </>
  );
}
export default Invites;