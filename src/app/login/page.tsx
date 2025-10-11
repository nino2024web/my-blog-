"use client";
import { useState } from "react";

export default function Login() {
  const [secret, setSecret] = useState("");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ secret }),
    });
    if (res.ok) {
      location.href =
        new URLSearchParams(location.search).get("next") ?? "/write";
    } else {
      alert("パスフレーズが正しくありません");
    }
  };

  return (
    <main className="mx-auto max-w-sm p-6 space-y-4">
      <h1 className="text-xl font-semibold">管理者ログイン</h1>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border rounded p-2"
          value={secret}
          type="password"
          onChange={(e) => setSecret(e.target.value)}
          placeholder="パスフレーズ"
        />
        <button className="w-full bg-black hover:bg-gray-800 transition-colors text-white rounded p-2">
          ログイン
        </button>
      </form>
    </main>
  );
}
