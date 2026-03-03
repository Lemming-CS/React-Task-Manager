import { useState } from "react";
import { useStore } from "../store/useStore";
import { db } from "../firebase/config";
import {
addDoc, collection, serverTimestamp, Timestamp
} from "firebase/firestore";
import styles from "./static/CreateTaskModal.module.css";

export default function CreateTaskModal({ projectId, members = [] }) {
    const me = useStore(s => s.user);

    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [status, setStatus] = useState("To Do");
    const [priority, setPriority] = useState("Normal");
    const [deadline, setDeadline] = useState("");
    const [assignedTo, setAssignedTo] = useState("");
    const [err, setErr] = useState("");
    const [saving, setSaving] = useState(false);

    const close = () => {
        setOpen(false);
        setErr("");
    };

    const submit = async () => {
        setErr("");
        if (!title.trim()) {
        setErr("Title is required");
        return;
        }
        if (!me?.uid) return;

        setSaving(true);
        try {
        const ref = collection(db, "projects", projectId, "tasks");

        await addDoc(ref, {
            title: title.trim(),
            description: description.trim(),
            status,
            priority,
            assignedTo: assignedTo || null,
            deadline: deadline ? Timestamp.fromDate(new Date(deadline)) : null,
            createdAt: serverTimestamp(),
            createdBy: me.uid,
        });

        setTitle("");
        setDescription("");
        setStatus("To Do");
        setPriority("Normal");
        setDeadline("");
        setAssignedTo("");
        close();
        } catch (e) {
        console.error(e);
        setErr(e.code || e.message);
        } finally {
        setSaving(false);
        }
    };

    return (
        <>
        <button className={styles.openBtn} onClick={() => setOpen(true)}>
            + Create task
        </button>

        {open && (
            <div className={styles.overlay} onMouseDown={close}>
            <div className={styles.modal} onMouseDown={(e) => e.stopPropagation()}>
                <div className={styles.head}>
                <h2>Create task</h2>
                <button className={styles.x} onClick={close}>✕</button>
                </div>

                <label className={styles.label}>Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} />

                <label className={styles.label}>Description</label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} />

                <div className={styles.row}>
                <div className={styles.col}>
                    <label className={styles.label}>Status</label>
                    <select value={status} onChange={e => setStatus(e.target.value)}>
                    <option>To Do</option>
                    <option>In Progress</option>
                    <option>Done</option>
                    </select>
                </div>

                <div className={styles.col}>
                    <label className={styles.label}>Priority</label>
                    <select value={priority} onChange={e => setPriority(e.target.value)}>
                    <option>Low</option>
                    <option>Normal</option>
                    <option>High</option>
                    <option>Urgent</option>
                    </select>
                </div>
                </div>

                <div className={styles.row}>
                <div className={styles.col}>
                    <label className={styles.label}>Deadline</label>
                    <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} />
                </div>

                <div className={styles.col}>
                    <label className={styles.label}>Assigned to (uid)</label>
                    <input
                    placeholder="optional uid"
                    value={assignedTo}
                    onChange={e => setAssignedTo(e.target.value)}
                    />
                </div>
                </div>

                {err && <p className="error">{err}</p>}

                <div className={styles.actions}>
                <button onClick={close} className={styles.secondary}>Cancel</button>
                <button onClick={submit} disabled={saving}>
                    {saving ? "Saving..." : "Create"}
                </button>
                </div>
            </div>
            </div>
        )}
        </>
    );
}