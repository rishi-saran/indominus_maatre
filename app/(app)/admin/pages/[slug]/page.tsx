"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "quill/dist/quill.snow.css";
import { supabase } from "@/lib/supabase/client";
export default function EditPage() {
    const { slug } = useParams<{ slug: string }>();
    const router = useRouter();

    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<any>(null);

    const [title, setTitle] = useState("");
    const [type, setType] = useState("");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        async function loadPage() {
            try {
                // 1️⃣ Fetch page
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`,
                    { cache: "no-store" }
                );

                if (!res.ok) throw new Error("Failed to load page");

                const page = await res.json();

                if (!mounted) return;

                setTitle(page.title);
                setType(page.type);
                setPublished(page.published);

                // 2️⃣ Init Quill
                const { default: Quill } = await import("quill");

                if (!editorRef.current || !mounted) return;

                quillRef.current = new Quill(editorRef.current, {
                    theme: "snow",
                });

                // 3️⃣ Set content AFTER init
                const section = page.content?.sections?.[0];
                if (section?.delta) {
                    quillRef.current.setContents(section.delta);
                }

            } catch (e: any) {
                setError(e.message);
            } finally {
                setLoading(false);
            }
        }

        loadPage();
        return () => {
            mounted = false;
        };
    }, [slug]);

    async function handleUpdate() {
        if (!quillRef.current) return;

        setLoading(true);
        setError("");

        try {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${session?.access_token}`,
                    },
                    body: JSON.stringify({
                        title,
                        type,
                        published,
                        content: quillRef.current.getContents(),
                    }),
                }
            );

            if (!res.ok) {
                const d = await res.json();
                throw new Error(d.detail || "Update failed");
            }

            router.push("/admin/pages");
        } catch (e: any) {
            setError(e.message);
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <p className="p-6">Loading…</p>;

    return (
        <div className="max-w-5xl mx-auto p-8 bg-white/60 backdrop-blur-xl rounded-[2.5rem] shadow-xl border border-white/40">
            <h1 className="text-3xl font-black mb-6 text-[#1a5d1a]">Edit Page</h1>

            {error && <div className="bg-red-100 p-3 mb-4">{error}</div>}

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 mb-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/30"
            />

            <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 mb-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/30" />

            <label className="flex gap-2 mb-3">
                <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                />
                Published
            </label>

            <div className="w-full bg-white/80 border border-gray-200 rounded-xl px-4 py-3 mb-4 font-medium focus:outline-none focus:ring-2 focus:ring-[#5cb85c]/30">
                <div ref={editorRef} />
            </div>

            <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-5 py-2 rounded"
            >
                Update
            </button>
        </div>
    );
}
