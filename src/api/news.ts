// News API endpoints with mock responses

import { newsList } from '../lib/mockData';
import type {
  GetNewsParams,
  GetNewsResponse,
  GetNewsByIdParams,
  GetNewsBySlugParams,
  GetNewsByIdResponse,
  CreateNewsBody,
  CreateNewsResponse,
  UpdateNewsBody,
  UpdateNewsResponse,
  ApiError
} from './types';
import type { News } from '../lib/mockData';

// Helper functions
const createResponse = <T>(data: T, message?: string) => ({
  success: true,
  data,
  message,
  timestamp: new Date().toISOString()
});

const createError = (code: string, message: string, details?: any): ApiError => ({
  success: false,
  error: { code, message, details },
  timestamp: new Date().toISOString()
});

const paginate = <T>(items: T[], page: number = 1, limit: number = 10) => {
  const total = items.length;
  const totalPages = Math.ceil(total / limit);
  const offset = (page - 1) * limit;
  const paginatedItems = items.slice(offset, offset + limit);
  
  return {
    items: paginatedItems,
    pagination: { page, limit, total, totalPages }
  };
};

/**
 * GET /api/news
 * Get list of news with filters and pagination
 */
export const getNews = async (params: GetNewsParams = {}): Promise<GetNewsResponse | ApiError> => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'publishDate',
      sortOrder = 'desc',
      search,
      status,
      category,
      featured,
      tags,
      dateFrom,
      dateTo
    } = params;

    // Filter news
    let filtered = [...newsList];

    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(n => 
        n.title.toLowerCase().includes(searchLower) ||
        n.summary.toLowerCase().includes(searchLower) ||
        n.content.toLowerCase().includes(searchLower) ||
        n.author.toLowerCase().includes(searchLower)
      );
    }

    if (status) {
      filtered = filtered.filter(n => n.status === status);
    }

    if (category) {
      filtered = filtered.filter(n => n.category === category);
    }

    if (featured !== undefined) {
      filtered = filtered.filter(n => n.featured === featured);
    }

    if (tags && tags.length > 0) {
      filtered = filtered.filter(n => 
        tags.some(tag => n.tags.includes(tag))
      );
    }

    if (dateFrom) {
      filtered = filtered.filter(n => new Date(n.publishDate) >= new Date(dateFrom));
    }

    if (dateTo) {
      filtered = filtered.filter(n => new Date(n.publishDate) <= new Date(dateTo));
    }

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof typeof a];
      let bVal: any = b[sortBy as keyof typeof b];
      
      if (sortBy === 'publishDate') {
        aVal = new Date(aVal).getTime();
        bVal = new Date(bVal).getTime();
      }
      
      if (sortOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    // Paginate
    const paginatedData = paginate(filtered, page, limit);

    return createResponse(paginatedData);
  } catch (error: any) {
    return createError('GET_NEWS_ERROR', 'Failed to fetch news', error.message);
  }
};

/**
 * GET /api/news/:id
 * Get news detail by ID
 */
export const getNewsById = async (params: GetNewsByIdParams): Promise<GetNewsByIdResponse | ApiError> => {
  try {
    const { id } = params;
    
    const news = newsList.find(n => n.id === id);
    
    if (!news) {
      return createError('NEWS_NOT_FOUND', `News with id ${id} not found`);
    }

    // Increment view count (in real app, this would update DB)
    news.views += 1;

    // Get related news (same category)
    const related = newsList
      .filter(n => n.id !== id && n.category === news.category && n.status === 'published')
      .slice(0, 5);

    return createResponse({
      news,
      related
    });
  } catch (error: any) {
    return createError('GET_NEWS_ERROR', 'Failed to fetch news', error.message);
  }
};

/**
 * GET /api/news/slug/:slug
 * Get news detail by slug
 */
export const getNewsBySlug = async (params: GetNewsBySlugParams): Promise<GetNewsByIdResponse | ApiError> => {
  try {
    const { slug } = params;
    
    const news = newsList.find(n => n.slug === slug);
    
    if (!news) {
      return createError('NEWS_NOT_FOUND', `News with slug ${slug} not found`);
    }

    // Increment view count
    news.views += 1;

    // Get related news
    const related = newsList
      .filter(n => n.slug !== slug && n.category === news.category && n.status === 'published')
      .slice(0, 5);

    return createResponse({
      news,
      related
    });
  } catch (error: any) {
    return createError('GET_NEWS_ERROR', 'Failed to fetch news', error.message);
  }
};

/**
 * POST /api/news
 * Create new news article
 */
export const createNews = async (body: CreateNewsBody): Promise<CreateNewsResponse | ApiError> => {
  try {
    // Validate required fields
    if (!body.title || !body.summary || !body.content || !body.category || !body.author) {
      return createError('VALIDATION_ERROR', 'Missing required fields');
    }

    // Generate slug from title
    const slug = body.title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Check if slug exists
    if (newsList.find(n => n.slug === slug)) {
      return createError('DUPLICATE_SLUG', 'News with similar title already exists');
    }

    // Create new news
    const newNews: News = {
      id: `news_${Date.now()}`,
      title: body.title,
      slug,
      summary: body.summary,
      content: body.content,
      category: body.category,
      author: body.author,
      publishDate: new Date().toISOString().split('T')[0],
      status: 'draft',
      views: 0,
      tags: body.tags || [],
      thumbnail: body.thumbnail || '',
      featured: body.featured || false
    };

    // In real app, save to database
    newsList.push(newNews);

    return createResponse(newNews, 'News created successfully');
  } catch (error: any) {
    return createError('CREATE_NEWS_ERROR', 'Failed to create news', error.message);
  }
};

/**
 * PUT /api/news/:id
 * Update news article
 */
export const updateNews = async (id: string, body: UpdateNewsBody): Promise<UpdateNewsResponse | ApiError> => {
  try {
    const newsIndex = newsList.findIndex(n => n.id === id);
    
    if (newsIndex === -1) {
      return createError('NEWS_NOT_FOUND', `News with id ${id} not found`);
    }

    // Update slug if title changed
    let updatedSlug = newsList[newsIndex].slug;
    if (body.title && body.title !== newsList[newsIndex].title) {
      updatedSlug = body.title
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/đ/g, 'd')
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '');
    }

    // Update news
    const updatedNews = {
      ...newsList[newsIndex],
      ...body,
      slug: updatedSlug
    };

    newsList[newsIndex] = updatedNews;

    return createResponse(updatedNews, 'News updated successfully');
  } catch (error: any) {
    return createError('UPDATE_NEWS_ERROR', 'Failed to update news', error.message);
  }
};

/**
 * DELETE /api/news/:id
 * Delete news (move to trash)
 */
export const deleteNews = async (id: string) => {
  try {
    const news = newsList.find(n => n.id === id);
    
    if (!news) {
      return createError('NEWS_NOT_FOUND', `News with id ${id} not found`);
    }

    // In real app, move to trash or set status to archived
    const index = newsList.findIndex(n => n.id === id);
    newsList.splice(index, 1);

    return createResponse({ deleted: true }, 'News moved to trash');
  } catch (error: any) {
    return createError('DELETE_NEWS_ERROR', 'Failed to delete news', error.message);
  }
};

/**
 * POST /api/news/:id/publish
 * Publish draft news
 */
export const publishNews = async (id: string) => {
  try {
    const newsIndex = newsList.findIndex(n => n.id === id);
    
    if (newsIndex === -1) {
      return createError('NEWS_NOT_FOUND', `News with id ${id} not found`);
    }

    const updatedNews = {
      ...newsList[newsIndex],
      status: 'published' as const,
      publishDate: new Date().toISOString().split('T')[0]
    };

    newsList[newsIndex] = updatedNews;

    return createResponse(updatedNews, 'News published successfully');
  } catch (error: any) {
    return createError('PUBLISH_NEWS_ERROR', 'Failed to publish news', error.message);
  }
};

/**
 * POST /api/news/:id/archive
 * Archive published news
 */
export const archiveNews = async (id: string) => {
  try {
    const newsIndex = newsList.findIndex(n => n.id === id);
    
    if (newsIndex === -1) {
      return createError('NEWS_NOT_FOUND', `News with id ${id} not found`);
    }

    const updatedNews = {
      ...newsList[newsIndex],
      status: 'archived' as const
    };

    newsList[newsIndex] = updatedNews;

    return createResponse(updatedNews, 'News archived successfully');
  } catch (error: any) {
    return createError('ARCHIVE_NEWS_ERROR', 'Failed to archive news', error.message);
  }
};

/**
 * GET /api/news/featured
 * Get featured news
 */
export const getFeaturedNews = async (limit: number = 5) => {
  try {
    const featured = newsList
      .filter(n => n.featured && n.status === 'published')
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, limit);

    return createResponse(featured);
  } catch (error: any) {
    return createError('GET_FEATURED_NEWS_ERROR', 'Failed to get featured news', error.message);
  }
};

/**
 * GET /api/news/stats
 * Get news statistics
 */
export const getNewsStats = async () => {
  try {
    const stats = {
      total: newsList.length,
      published: newsList.filter(n => n.status === 'published').length,
      draft: newsList.filter(n => n.status === 'draft').length,
      archived: newsList.filter(n => n.status === 'archived').length,
      featured: newsList.filter(n => n.featured).length,
      totalViews: newsList.reduce((sum, n) => sum + n.views, 0),
      byCategory: {} as Record<string, number>,
      byAuthor: {} as Record<string, number>,
      topViewed: newsList
        .filter(n => n.status === 'published')
        .sort((a, b) => b.views - a.views)
        .slice(0, 10)
    };

    // Group by category
    newsList.forEach(n => {
      stats.byCategory[n.category] = (stats.byCategory[n.category] || 0) + 1;
    });

    // Group by author
    newsList.forEach(n => {
      stats.byAuthor[n.author] = (stats.byAuthor[n.author] || 0) + 1;
    });

    return createResponse(stats);
  } catch (error: any) {
    return createError('GET_STATS_ERROR', 'Failed to get news statistics', error.message);
  }
};
