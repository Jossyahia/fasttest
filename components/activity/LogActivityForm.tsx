"use client";

import { useState } from "react";

export default function LogActivityForm() {
  const [action, setAction] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await fetch("/api/activity", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, details }),
    });

    if (response.ok) {
      setAction("");
      setDetails("");
      window.location.reload(); // Refresh the page to show the new activity
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-8">
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Action"
          value={action}
          onChange={(e) => setAction(e.target.value)}
          className="w-full p-2 border rounded-lg"
          required
        />
        <textarea
          placeholder="Details"
          value={details}
          onChange={(e) => setDetails(e.target.value)}
          className="w-full p-2 border rounded-lg"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Log Activity
        </button>
      </div>
    </form>
  );
}
