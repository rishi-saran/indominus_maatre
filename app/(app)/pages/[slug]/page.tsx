export default async function PublicPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params; // required

    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/pages/${slug}`,
        { cache: "no-store" }
    );

    if (!res.ok) {
        return <div className="p-8">Page not found</div>;
    }

    const page = await res.json();

    return (
        <div className="max-w-4xl mx-auto p-8">
            <h1 className="text-3xl font-bold mb-6">{page.title}</h1>

            <pre className="bg-gray-100 p-4 rounded text-sm overflow-x-auto">
                {JSON.stringify(page.content, null, 2)}
            </pre>
        </div>
    );
}
