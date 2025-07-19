import React, { useEffect, useState } from "react";
import { collection, addDoc, onSnapshot, query, orderBy, Timestamp } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import type { DocumentData } from "firebase/firestore";  // type-only import

interface Announcement extends DocumentData {
  id: string;
  text: string;
  userName: string;
  createdAt: Timestamp;
}

const AnnouncementsBoard = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Announcement[];
      setAnnouncements(data);
    });
    return () => unsubscribe();
  }, []);

  const handlePost = async () => {
    if (!text.trim() || !user) return;
    await addDoc(collection(db, "announcements"), {
      text,
      userName: user.displayName || "Anonymous",
      createdAt: Timestamp.now(),
    });
    setText("");
  };

  return (
    <div className="p-4 max-w-xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">
        Welcome, {user?.displayName || "User"}!
      </h2>

      <div className="mb-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          className="w-full border p-2 rounded"
          placeholder="Write an announcement (max 280 chars)..."
        />
        <button
          onClick={handlePost}
          className="mt-2 bg-green-500 text-white px-4 py-2 rounded"
        >
          Post
        </button>
      </div>

      <div>
        {announcements.map((a) => (
          <div key={a.id} className="border p-2 rounded mb-2 bg-gray-100">
            <p className="text-sm text-gray-500">By {a.userName}</p>
            <p>{a.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsBoard;
