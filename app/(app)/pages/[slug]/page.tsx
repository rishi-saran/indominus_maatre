import { renderDelta } from "./PageRenderer";

export default async function PublicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return <div className="p-8">Page not found</div>;
    }

    const page = await res.json();

    const section = page.content?.sections?.[0];
    const html = section ? renderDelta(section.delta) : "";

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        </div>
    );
}