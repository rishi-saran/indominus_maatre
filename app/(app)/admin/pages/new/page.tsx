"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function AdminCreatePage() {
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<any>(null);

    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("general");
    const [published, setPublished] = useState(false);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        async function initQuill() {
            if (!editorRef.current || quillRef.current) return;

            const Quill = (await import("quill")).default;
            await import("quill/dist/quill.snow.css");

            if (!mounted) return;

            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, false] }],
                        ["bold", "italic", "underline"],
                        [{ list: "ordered" }, { list: "bullet" }],
                        ["link"],
                        ["clean"],
                    ],
                },
            });
        }

        initQuill();
        return () => {
            mounted = false;
        };
    }, []);

    async function handleSubmit() {
        if (!slug || !title || !quillRef.current) {
            setError("All fields required");
            return;
        }

        const { data: { session } } = await supabase.auth.getSession();

        if (!session?.access_token) {
            setError("Not authenticated");
            return;
        }

        const content = quillRef.current.getContents();

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/pages`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${session.access_token}`,
                },
                body: JSON.stringify({
                    slug,
                    title,
                    type,
                    content,
                    published,
                }),
            }
        );

        if (!res.ok) {
            setError("Failed to create page");
            return;
        }

        router.push(`/pages/${slug}`);
    }


    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-bold mb-4">Create Page</h1>

            {error && <div className="text-red-600 mb-3">{error}</div>}

            <input
                className="border p-2 w-full mb-2"
                placeholder="slug"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-2"
                placeholder="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
            />

            <input
                className="border p-2 w-full mb-2"
                placeholder="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
            />

            <label className="flex items-center gap-2 mb-4">
                <input
                    type="checkbox"
                    checked={published}
                    onChange={(e) => setPublished(e.target.checked)}
                />
                Published
            </label>

            <div ref={editorRef} className="bg-white mb-4" />

            <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-4 py-2 rounded"
            >
                Save Page
            </button>
        </div>
    );
}
