import { useState } from "react";
import { motion } from "motion/react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import {
  Eye,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  FileText,
  Users,
  Newspaper,
} from "lucide-react";
import { newsArticles, News } from "../lib/mockData";
import ModernDataTable, { ColumnDef, FilterConfig } from "./ModernDataTable";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { toast } from "sonner";
import NewsDetailPage from "./NewsDetailPage";
import NewsAddEdit from "./NewsAddEdit";

const categoryConfig = {
  "traffic-law": { label: "Luật giao thông", color: "bg-red-500" },
  announcement: { label: "Thông báo", color: "bg-blue-500" },
  guide: { label: "Hướng dẫn", color: "bg-green-500" },
  news: { label: "Tin tức", color: "bg-purple-500" },
};

const statusConfig = {
  published: { label: "Đã đăng", color: "bg-green-500" },
  draft: { label: "Nháp", color: "bg-gray-500" },
  archived: { label: "Lưu trữ", color: "bg-yellow-500" },
};

interface StatCardProps {
  title: string;
  value: number | string;
  subtitle: string;
  icon: any;
  color: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color,
}: StatCardProps) {
  return (
    <Card className="overflow-hidden relative group hover:shadow-lg transition-all duration-300">
      <div
        className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${color} opacity-10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform duration-300`}
      ></div>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardDescription className="text-sm">{title}</CardDescription>
          <div
            className={`p-2 rounded-lg bg-gradient-to-br ${color} bg-opacity-10`}
          >
            <Icon
              className={`h-4 w-4 ${color.replace("from-", "text-").split(" ")[0]}`}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl mb-1">{value}</div>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
      </CardContent>
    </Card>
  );
}

export default function NewsManagement() {
  const [viewMode, setViewMode] = useState<"list" | "detail" | "add" | "edit">(
    "list"
  );
  const [selectedNews, setSelectedNews] = useState<News | null>(null);

  const categories = Array.from(new Set(newsArticles.map((n) => n.category)));

  const handleViewDetail = (news: News) => {
    setSelectedNews(news);
    setViewMode("detail");
  };

  const handleEditNews = (news: News) => {
    setSelectedNews(news);
    setViewMode("edit");
  };

  const handleAddNews = () => {
    setSelectedNews(null);
    setViewMode("add");
  };

  const handleBack = () => {
    setSelectedNews(null);
    setViewMode("list");
  };

  if (viewMode === "detail" && selectedNews) {
    return (
      <NewsDetailPage
        news={selectedNews}
        onBack={handleBack}
        onEdit={() => handleEditNews(selectedNews)}
      />
    );
  }

  if (viewMode === "add" || viewMode === "edit") {
    return (
      <NewsAddEdit news={selectedNews} onBack={handleBack} mode={viewMode} />
    );
  }

  const columns: ColumnDef<News>[] = [
    {
      key: "title",
      header: "Tiêu đề",
      width: "35%",
      render: (news) => (
        <div className="space-y-1">
          <div className="flex items-start gap-2">
            {news.featured && (
              <TrendingUp className="h-4 w-4 text-yellow-500 flex-shrink-0 mt-0.5" />
            )}
            <div className="line-clamp-2 font-medium">{news.title}</div>
          </div>
          <div className="text-xs text-muted-foreground line-clamp-1">
            {news.summary}
          </div>
        </div>
      ),
    },
    {
      key: "category",
      header: "Danh mục",
      width: "12%",
      render: (news) => (
        <Badge className={`${categoryConfig[news.category].color} text-white`}>
          {categoryConfig[news.category].label}
        </Badge>
      ),
    },
    {
      key: "author",
      header: "Tác giả",
      width: "15%",
      render: (news) => <span>{news.author}</span>,
    },
    {
      key: "publishDate",
      header: "Ngày đăng",
      width: "12%",
      render: (news) => new Date(news.publishDate).toLocaleDateString("vi-VN"),
    },
    {
      key: "views",
      header: "Lượt xem",
      width: "9%",
      render: (news) => (
        <div className="flex items-center gap-1">
          <Eye className="h-3 w-3 text-muted-foreground" />
          <span>{news.views.toLocaleString("vi-VN")}</span>
        </div>
      ),
    },
    {
      key: "status",
      header: "Trạng thái",
      width: "8%",
      render: (news) => (
        <Badge className={`${statusConfig[news.status].color} text-white`}>
          {statusConfig[news.status].label}
        </Badge>
      ),
    },
    {
      key: "actions",
      header: "Thao tác",
      width: "100px",
      render: (news) => (
        <div className="flex justify-center gap-1">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => handleViewDetail(news)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xem chi tiết</p>
              </TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-blue-50 hover:text-blue-600"
                  onClick={() => handleEditNews(news)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Chỉnh sửa</p>
              </TooltipContent>
            </TooltipUI>

            <TooltipUI>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-red-50 hover:text-red-600"
                  onClick={() => toast.success("Đã xóa tin tức thành công!")}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Xóa</p>
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      ),
    },
  ];

  const filters: FilterConfig[] = [
    {
      key: "category",
      label: "Danh mục",
      options: [
        { value: "all", label: "Tất cả" },
        ...categories.map((cat) => ({
          value: cat,
          label: categoryConfig[cat].label,
        })),
      ],
    },
    {
      key: "status",
      label: "Trạng thái",
      options: [
        { value: "all", label: "Tất cả" },
        { value: "published", label: "Đã đăng" },
        { value: "draft", label: "Nháp" },
        { value: "archived", label: "Lưu trữ" },
      ],
    },
  ];

  const searchFields: (keyof News)[] = ["title", "summary", "author"];

  const stats = {
    total: newsArticles.length,
    published: newsArticles.filter((n) => n.status === "published").length,
    draft: newsArticles.filter((n) => n.status === "draft").length,
    totalViews: newsArticles.reduce((sum, n) => sum + n.views, 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
      >
        <StatCard
          title="Tổng bài viết"
          value={stats.total}
          subtitle="Tất cả tin tức"
          icon={Newspaper}
          color="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Đã đăng"
          value={stats.published}
          subtitle="Đang hiển thị"
          icon={FileText}
          color="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Nháp"
          value={stats.draft}
          subtitle="Chờ xuất bản"
          icon={Edit}
          color="from-yellow-500 to-orange-500"
        />
        <StatCard
          title="Lượt xem"
          value={stats.totalViews.toLocaleString("vi-VN")}
          subtitle="Tổng lượt xem"
          icon={Users}
          color="from-purple-500 to-pink-500"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <ModernDataTable
          data={newsArticles}
          columns={columns}
          title="Danh sách tin tức"
          filters={filters}
          searchKeys={["title", "summary", "author"]}
          searchPlaceholder="Tìm kiếm theo tiêu đề, nội dung, tác giả..."
          getItemKey={(news) => news.id}
          actions={
            <Button onClick={handleAddNews}>
              <Plus className="mr-2 h-4 w-4" />
              Thêm tin tức
            </Button>
          }
        />
      </motion.div>
    </div>
  );
}
