"use client";

import { useState } from "react";
import Image from "next/image";

type Organization = {
  name: string;
};

type User = {
  name: string | null;
  email: string;
  image: string | null;
  role: string;
  organization?: Organization | null;
};

type ProfileFormProps = {
  user: User;
};

export default function ProfileForm({ user }: ProfileFormProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name }),
      });

      if (!res.ok) {
        const contentType = res.headers.get("content-type");
        let errorMsg = "Failed to update profile";
        if (contentType && contentType.includes("application/json")) {
          const data = await res.json();
          errorMsg = data.error || errorMsg;
        } else {
          const text = await res.text();
          errorMsg = text || errorMsg;
        }
        throw new Error(errorMsg);
      }

      // On success, exit edit mode
      setIsEditing(false);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex items-center mb-4">
        <div className="w-24 h-24 mr-6">
          <Image
            src={user.image || "/default-profile.png"}
            alt="Profile Picture"
            width={96}
            height={96}
            className="rounded-full object-cover"
          />
        </div>
        <div>
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-2">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your Name"
                className="border border-gray-300 rounded p-2 w-full"
              />
              {error && <p className="text-red-500">{error}</p>}
              <div className="flex space-x-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
                >
                  {loading ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    // Reset field to original value if cancelled
                    setName(user.name || "");
                    setError("");
                  }}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-semibold">
                {user.name || "No Name Provided"}
              </h2>
              <p className="text-gray-600">{user.email}</p>
              <p className="text-gray-600 mt-1">Role: {user.role}</p>
              {user.organization && (
                <p className="text-gray-600 mt-1">
                  Organization: {user.organization.name}
                </p>
              )}
              <button
                onClick={() => setIsEditing(true)}
                className="mt-4 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
              >
                Edit Profile
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
