import Article, { IArticle } from '../../model/article/article.schema';
import { slugify } from '../../utils/slugify';

const generateUniqueSlug = async (title: string, excludeId?: string) => {
  const baseSlug = slugify(title);
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existingArticle = await Article.findOne({
      slug,
      ...(excludeId ? { _id: { $ne: excludeId } } : {}),
    });

    if (!existingArticle) {
      return slug;
    }

    slug = `${baseSlug}-${counter}`;
    counter += 1;
  }
};

export const createArticleService = async (data: Partial<IArticle>) => {
  data.slug = await generateUniqueSlug(data.title as string);

  const article = await Article.create(data);
  return await Article.findById(article._id).populate('author', 'firstName lastName email');
};

export const getAllArticlesService = async (query: any) => {
  const { page = 1, limit = 10, category, search, isActive } = query;
  
  const filter: any = {};
  if (category) filter.category = category;
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (search) {
    filter.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);
  
  const articles = await Article.find(filter)
    .populate('author', 'firstName lastName email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const total = await Article.countDocuments(filter);

  return {
    articles,
    meta: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

export const getArticleBySlugService = async (slug: string) => {
  return await Article.findOne({ slug }).populate('author', 'firstName lastName email');
};

export const getArticleByIdService = async (id: string) => {
  return await Article.findById(id).populate('author', 'firstName lastName email');
};

export const updateArticleService = async (id: string, data: Partial<IArticle>) => {
  if (data.title) {
    data.slug = await generateUniqueSlug(data.title, id);
  }

  return await Article.findByIdAndUpdate(id, data, { new: true }).populate('author', 'firstName lastName email');
};

export const deleteArticleService = async (id: string) => {
  return await Article.findByIdAndDelete(id);
};
