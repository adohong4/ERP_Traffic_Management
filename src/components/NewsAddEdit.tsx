import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  ArrowLeft, 
  Save,
  X,
  Upload,
  Plus,
  Trash2
} from 'lucide-react';
import { News } from '../lib/mockData';
import { useBreadcrumb } from './BreadcrumbContext';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { Badge } from './ui/badge';

interface NewsAddEditProps {
  news: News | null;
  onBack: () => void;
  mode: 'add' | 'edit';
}

const categoryOptions = [
  { value: 'traffic-law', label: 'Luật giao thông' },
  { value: 'announcement', label: 'Thông báo' },
  { value: 'guide', label: 'Hướng dẫn' },
  { value: 'news', label: 'Tin tức' }
];

const statusOptions = [
  { value: 'published', label: 'Đã đăng' },
  { value: 'draft', label: 'Nháp' },
  { value: 'archived', label: 'Lưu trữ' }
];

export default function NewsAddEdit({ news, onBack, mode }: NewsAddEditProps) {
  const { setBreadcrumbs } = useBreadcrumb();
  const [formData, setFormData] = useState<Partial<News>>({
    title: news?.title || '',
    slug: news?.slug || '',
    summary: news?.summary || '',
    content: news?.content || '',
    category: news?.category || 'news',
    author: news?.author || '',
    status: news?.status || 'draft',
    tags: news?.tags || [],
    thumbnail: news?.thumbnail || '',
    featured: news?.featured || false
  });
  const [newTag, setNewTag] = useState('');

  useEffect(() => {
    setBreadcrumbs([
      { label: 'Tin tức', onClick: onBack },
      { label: mode === 'add' ? 'Thêm tin tức mới' : `Chỉnh sửa - ${news?.title.substring(0, 30)}...` }
    ]);

    return () => {
      setBreadcrumbs([]);
    };
  }, [mode, news]);

  const handleChange = (field: keyof News, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags?.includes(newTag.trim())) {
      handleChange('tags', [...(formData.tags || []), newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags?.filter(tag => tag !== tagToRemove));
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.summary || !formData.content) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    toast.success(mode === 'add' ? 'Đã thêm tin tức thành công!' : 'Đã cập nhật tin tức thành công!');
    onBack();
  };

  const handleCancel = () => {
    toast.info('Đã hủy thay đổi');
    onBack();
  };

  // Auto generate slug from title
  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    handleChange('title', value);
    if (!news) { // Only auto-generate slug for new articles
      handleChange('slug', generateSlug(value));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="mb-4 hover:bg-blue-50"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Quay lại
        </Button>
        
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-3xl mb-2">
              {mode === 'add' ? 'Thêm tin tức mới' : 'Chỉnh sửa tin tức'}
            </h2>
            <p className="text-muted-foreground">
              {mode === 'add' ? 'Tạo bài viết tin tức mới' : `Cập nhật thông tin cho: ${news?.title}`}
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCancel}>
              <X className="mr-2 h-4 w-4" />
              Hủy
            </Button>
            <Button onClick={handleSubmit}>
              <Save className="mr-2 h-4 w-4" />
              {mode === 'add' ? 'Tạo tin tức' : 'Lưu thay đổi'}
            </Button>
          </div>
        </div>
      </motion.div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Form */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Thông tin bài viết</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">
                  Tiêu đề <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Nhập tiêu đề bài viết..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">
                  Slug (URL thân thiện)
                </Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => handleChange('slug', e.target.value)}
                  placeholder="tieu-de-bai-viet"
                />
                <p className="text-xs text-muted-foreground">
                  Tự động tạo từ tiêu đề. Có thể chỉnh sửa thủ công.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary">
                  Tóm tắt <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleChange('summary', e.target.value)}
                  placeholder="Nhập tóm tắt ngắn gọn về bài viết..."
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="content">
                  Nội dung <span className="text-red-500">*</span>
                </Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleChange('content', e.target.value)}
                  placeholder="Nhập nội dung bài viết (hỗ trợ HTML)..."
                  rows={15}
                  className="font-mono text-sm"
                />
                <p className="text-xs text-muted-foreground">
                  Hỗ trợ HTML tags: &lt;h2&gt;, &lt;p&gt;, &lt;ul&gt;, &lt;li&gt;, &lt;strong&gt;, v.v.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="author">
                  Tác giả
                </Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => handleChange('author', e.target.value)}
                  placeholder="Tên tác giả hoặc cơ quan..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Tags */}
          <Card>
            <CardHeader>
              <CardTitle>Thẻ tag</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Nhập tag mới..."
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                />
                <Button onClick={handleAddTag} size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              {formData.tags && formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-sm">
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 hover:text-red-600"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">
                  Danh mục <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange('category', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn danh mục" />
                  </SelectTrigger>
                  <SelectContent>
                    {categoryOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">
                  Trạng thái <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="featured"
                  checked={formData.featured}
                  onChange={(e) => handleChange('featured', e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300"
                />
                <Label htmlFor="featured" className="cursor-pointer">
                  Tin nổi bật
                </Label>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Ảnh đại diện</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {formData.thumbnail && (
                <div className="relative rounded-lg overflow-hidden">
                  <img 
                    src={formData.thumbnail} 
                    alt="Thumbnail" 
                    className="w-full h-48 object-cover"
                  />
                  <Button
                    size="sm"
                    variant="destructive"
                    className="absolute top-2 right-2"
                    onClick={() => handleChange('thumbnail', '')}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
              
              <div className="space-y-2">
                <Label htmlFor="thumbnail">URL ảnh đại diện</Label>
                <Input
                  id="thumbnail"
                  value={formData.thumbnail}
                  onChange={(e) => handleChange('thumbnail', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <Button variant="outline" className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                Tải ảnh lên
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="space-y-2 text-sm">
                <p className="font-medium text-blue-900">Lưu ý:</p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Tiêu đề nên ngắn gọn, súc tích</li>
                  <li>Tóm tắt không quá 200 ký tự</li>
                  <li>Nội dung nên rõ ràng, dễ hiểu</li>
                  <li>Sử dụng ảnh có kích thước phù hợp</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}