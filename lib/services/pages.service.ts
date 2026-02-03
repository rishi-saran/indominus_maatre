import { ApiService } from './api.service';
import { API_ENDPOINTS } from '@/lib/config/api.config';

export interface PageContent {
    id: string;
    slug: string;
    title: string;
    type: string;
    content: any; // Rich text content (Quill Delta or similar)
    published: boolean;
    created_at?: string;
}

export class PagesService {
    /**
     * Get page content by slug
     */
    static async getBySlug(slug: string): Promise<PageContent | null> {
        try {
            const response = await ApiService.get<PageContent>(
                API_ENDPOINTS.pages.getBySlug(slug)
            );
            return response;
        } catch (error) {
            console.error(`PagesService Error (${slug}):`, error);
            return null;
        }
    }
}
