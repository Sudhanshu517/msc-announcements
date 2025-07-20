import { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  Timestamp,
  deleteDoc,
  doc,
  } from "firebase/firestore";
  import type { DocumentData } from "firebase/firestore";

import { db } from "../firebaseConfig";
import { useAuth } from "../context/AuthContext";
import { formatDistanceToNow } from "date-fns";
import toast from "react-hot-toast";

interface Announcement {
  id: string;
  text: string;
  userName: string;
  userPhoto: string;
  userId: string | null;
  createdAt: Timestamp;
}

const AnnouncementsBoard = () => {
  const { user } = useAuth();
  const [text, setText] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Subscribe to Firestore
  useEffect(() => {
    const q = query(collection(db, "announcements"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((d) => {
        const docData = d.data() as DocumentData;

        return {
          id: d.id,
          text: (docData.text as string) ?? "",
          userName: (docData.userName as string) ?? "Unknown",
          userPhoto: (docData.userPhoto as string) ?? "",
          userId: (docData.userId as string | undefined) ?? null, // legacy support
          createdAt: (docData.createdAt as Timestamp) ?? Timestamp.now(),
        };
      });
      setAnnouncements(data);
    });

    return () => unsubscribe();
  }, []);

  // Post announcement
  const handlePost = async () => {
    if (!text.trim()) {
      toast.error("Announcement cannot be empty!");
      return;
    }
    if (!user) {
      toast.error("You must be signed in.");
      return;
    }

    try {
      await addDoc(collection(db, "announcements"), {
        text,
        userName: user.displayName || "Anonymous",
        userPhoto: user.photoURL || "",
        userId: user.uid, // CRITICAL
        createdAt: Timestamp.now(),
      });
      setText("");
      toast.success("Announcement posted!");
    } catch (err) {
      console.error("Post error:", err);
      toast.error("Failed to post announcement.");
    }
  };

  function stringToColor(str: string): string {
    // Generates a pastel-ish color based on string hash
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = hash % 360;
    return `hsl(${hue}, 70%, 70%)`;
  }

  // Delete announcement
  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
      toast.success("Announcement deleted!");
    } catch (err) {
      console.error("Delete error:", err);
      toast.error("Failed to delete announcement.");
    }
  };

  return (
    <>
      {/* Compose box */}
      <div className="mb-6">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={280}
          className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-green-400 focus:outline-none resize-none"
          placeholder="Write an announcement (max 280 chars)..."
        />
        <div className="text-sm text-gray-500 mt-1">{280 - text.length} characters left</div>
        <button
          onClick={handlePost}
          className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow-md transition"
        >
          Post
        </button>
      </div>

      {/* Feed */}
      <div className="space-y-4">
        {announcements.map((a) => (
          <div
            key={a.id}
            className="bg-gray-50 p-4 rounded-lg shadow-sm flex items-start gap-3"
          >
            {a.userPhoto ? (
              <img
                src={a.userPhoto}
                alt="avatar"
                className="w-10 h-10 rounded-full object-cover border"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                style={{ backgroundColor: stringToColor(a.userName || "?") }}
              >
                {(a.userName || "?").charAt(0).toUpperCase()}
              </div>
            )}

            <div className="flex-1">
              <p className="font-medium text-gray-700">
                {a.userName}{" "}
                <span className="text-sm text-gray-400">
                  • {formatDistanceToNow(a.createdAt.toDate(), { addSuffix: true })}
                </span>
              </p>
              <p className="text-gray-800 mt-1 whitespace-pre-wrap break-words">
                {a.text}
              </p>
            </div>

            {/* Delete only if this user owns the doc AND doc has userId */}
            {user?.uid && a.userId && user.uid === a.userId && (
              <button
                onClick={() => handleDelete(a.id)}
                className="text-red-500 hover:underline text-sm"
              >
                Delete
              </button>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default AnnouncementsBoard;
