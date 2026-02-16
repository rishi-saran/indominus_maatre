"use client";

import { useEffect, useRef } from "react";
import Quill from "quill";

export default function PageRenderer({ delta }: { delta: any }) {
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!ref.current) return;

        const q = new Quill(document.createElement("div"));
        q.setContents(delta);
        ref.current.innerHTML = q.root.innerHTML;
    }, [delta]);

    return <div ref={ref} className="prose max-w-none" />;
}
