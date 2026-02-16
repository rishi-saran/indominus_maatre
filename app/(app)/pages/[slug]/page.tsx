import { notFound } from "next/navigation";
import PageRenderer from "./PageRenderer";

export default async function PublicPage({
    params,
}: {
    params: { slug: string };
}) {
    const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/pages/${params.slug}`,
        { cache: "no-store" }
    );

    if (!res.ok) notFound();

    const page = await res.json();

    if (!page.published) notFound();

    return (
        <div className="max-w-3xl mx-auto p-8">
            <h1 className="text-3xl font-semibold mb-6">{page.title}</h1>
            <PageRenderer delta={page.content.sections[0].delta} />
        </div>
    );
}
