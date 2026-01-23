"use client";

import { useState } from "react";
// app/(app)/live/[callId]/DonationBox.tsx
type Props = {
  callId: string;
  priestId: string;
  customerId: string;
};

export default function DonationBox({
  callId,
  priestId,
  customerId,
}: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendDonation() {
    if (!amount) return alert("Enter amount");

    setLoading(true);

    const res = await fetch("/api/donation/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        callId,        // ✅ THIS WAS MISSING
        priestId,
        customerId,
        amount,
        message,
      }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) {
      alert(data.error || "Donation failed");
      return;
    }

    setAmount(0);
    setMessage("");
  }

  return (
    <div style={{ marginTop: 30 }}>
      <h3>Donate</h3>

      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
        style={{ display: "block", marginBottom: 8 }}
      />

      <input
        type="text"
        placeholder="Your message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        style={{ display: "block", marginBottom: 8 }}
      />

      <button onClick={sendDonation} disabled={loading}>
        {loading ? "Sending..." : "Send Donation"}
      </button>
    </div>
  );
}