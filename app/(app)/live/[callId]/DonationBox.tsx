"use client";

import { useState } from "react";

const PRIMARY_GREEN = "#5cb85c";

type Props = {
  callId: string;
  priestId: string;
  customerId: string;
};

// Preset amount buttons
const PRESET_AMOUNTS = [51, 101, 251, 501, 1001];

export default function DonationBox({
  callId,
  priestId,
  customerId,
}: Props) {
  const [amount, setAmount] = useState<number>(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function sendDonation() {
    if (!amount || amount <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      const res = await fetch("/api/donation/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          callId,
          priestId,
          customerId,
          amount,
          message,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Donation failed");
        return;
      }

      setSuccess(true);
      setAmount(0);
      setMessage("");

      // Reset success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-4">
      {/* Success Message */}
      {success && (
        <div className="p-3 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm font-medium flex items-center gap-2">
          <span>✅</span> Donation sent successfully!
        </div>
      )}

      {/* Amount Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Amount (₹)
        </label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 font-semibold">₹</span>
          <input
            type="number"
            placeholder="Enter amount"
            value={amount || ""}
            onChange={(e) => setAmount(Number(e.target.value))}
            className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900 font-medium text-lg"
          />
        </div>
      </div>

      {/* Preset Amounts */}
      <div>
        <label className="block text-xs font-medium text-gray-500 mb-2">
          Quick Select
        </label>
        <div className="flex flex-wrap gap-2">
          {PRESET_AMOUNTS.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setAmount(preset)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${amount === preset
                  ? "text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              style={amount === preset ? { backgroundColor: PRIMARY_GREEN } : {}}
            >
              ₹{preset}
            </button>
          ))}
        </div>
      </div>

      {/* Message Input */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Message (Optional)
        </label>
        <textarea
          placeholder="Add a blessing or message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition-all text-gray-900 text-sm resize-none"
        />
      </div>

      {/* Send Button */}
      <button
        onClick={sendDonation}
        disabled={loading || !amount}
        className="w-full py-3.5 rounded-xl text-white font-semibold text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        style={{ backgroundColor: PRIMARY_GREEN }}
      >
        {loading ? (
          <>
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Sending...
          </>
        ) : (
          <>
            <span>🙏</span>
            Send ₹{amount || 0} Donation
          </>
        )}
      </button>

      {/* Security Note */}
      <p className="text-xs text-gray-400 text-center">
        🔒 Secure payment • Your support means a lot
      </p>
    </div>
  );
}