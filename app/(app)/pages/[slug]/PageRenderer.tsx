import { QuillDeltaToHtmlConverter } from "quill-delta-to-html";

export function renderDelta(delta: any): string {
    const converter = new QuillDeltaToHtmlConverter(delta.ops || [], {
        paragraphTag: "p",
    });
    return converter.convert();
}
