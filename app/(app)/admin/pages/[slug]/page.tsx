"use client";

import { useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import "quill/dist/quill.snow.css";

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
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
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
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-2xl font-semibold mb-4">Edit Page</h1>

            {error && <div className="bg-red-100 p-3 mb-4">{error}</div>}

            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border p-2 mb-3"
            />

            <input
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full border p-2 mb-3"
            />

            <label className="flex gap-2 mb-3">
                <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                />
                Published
            </label>

            <div className="border rounded mb-4">
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
