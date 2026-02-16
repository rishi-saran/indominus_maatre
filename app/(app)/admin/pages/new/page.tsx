"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import "quill/dist/quill.snow.css";

export default function NewAdminPage() {
    const router = useRouter();
    const editorRef = useRef<HTMLDivElement | null>(null);
    const quillRef = useRef<any>(null);

    const [slug, setSlug] = useState("");
    const [title, setTitle] = useState("");
    const [type, setType] = useState("general");
    const [published, setPublished] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");


    // Init Quill (client-only)

    useEffect(() => {
        let mounted = true;

        async function initQuill() {
            const { default: Quill } = await import("quill");

            if (!mounted || !editorRef.current) return;

            quillRef.current = new Quill(editorRef.current, {
                theme: "snow",
                modules: {
                    toolbar: [
                        [{ header: [1, 2, 3, false] }],
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
            quillRef.current = null;
        };
    }, []);

    // submit
    async function handleSubmit() {
        if (!slug || !title) {
            setError("Slug and title are required");
            return;
        }

        if (!quillRef.current) {
            setError("Editor not ready");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pages`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    credentials: "include",
                    body: JSON.stringify({
                        slug,
                        title,
                        type,
                        published,
                        content: {
                            sections: [
                                {
                                    key: "main",
                                    title,
                                    delta: quillRef.current.getContents(),
                                },
                            ],
                        },
                    }),
                }
            );

            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.detail || "Failed to create page");
            }

            router.push("/dashboard/admin/pages");
        } catch (err: any) {
            setError(err.message ?? "Something went wrong");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-2xl font-semibold mb-6">Create Page</h1>

            {error && (
                <div className="mb-4 rounded bg-red-100 p-3 text-red-700">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <input
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="slug (about-us)"
                    className="w-full border p-2 rounded"
                />

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="title"
                    className="w-full border p-2 rounded"
                />

                <input
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    placeholder="type (general, service)"
                    className="w-full border p-2 rounded"
                />

                <label className="flex items-center gap-2">
                    <input
                        type="checkbox"
                        checked={published}
                        onChange={(e) => setPublished(e.target.checked)}
                    />
                    Published
                </label>

                <div className="border rounded">
                    <div ref={editorRef} />
                </div>

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 disabled:opacity-50"
                >
                    {loading ? "Creating…" : "Create Page"}
                </button>
            </div>
        </div>
    );
}
