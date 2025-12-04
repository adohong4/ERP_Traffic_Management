import { useState } from 'react';
import { motion } from 'motion/react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Tooltip as TooltipUI, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { RotateCcw, Trash2, AlertTriangle } from 'lucide-react';
import ModernDataTable, { ColumnDef, FilterConfig } from './ModernDataTable';
import { Card, CardContent } from './ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from './ui/alert-dialog';

interface DeletedRecord {
  id: string;
  recordId: string;
  recordType: 'student' | 'license' | 'vehicle' | 'violation' | 'authority' | 'notification';
  recordName: string;
  recordDetails: string;
  deletedBy: string;
  deletedDate: string;
  autoDeleteDate: string;
  data: any;
}

// Mock data
const mockDeletedRecords: DeletedRecord[] = [
  {
    id: 'DEL00001',
    recordId: 'ST00045',
    recordType: 'student',
    recordName: 'Nguyễn Văn An',
    recordDetails: 'Thí sinh - GPLX B2 - Hà Nội',
    deletedBy: 'Admin',
    deletedDate: '2024-10-23T10:30:00',
    autoDeleteDate: '2024-11-22T10:30:00',
    data: {}
  },
  {
    id: 'DEL00002',
    recordId: 'LC00123',
    recordType: 'license',
    recordName: 'Trần Thị Bình',
    recordDetails: 'GPLX A1-HN-12345 - Hà Nội',
    deletedBy: 'Admin',
    deletedDate: '2024-10-22T14:15:00',
    autoDeleteDate: '2024-11-21T14:15:00',
    data: {}
  },
  {
    id: 'DEL00003',
    recordId: 'VH00089',
    recordType: 'vehicle',
    recordName: '29A-12345',
    recordDetails: 'Toyota Camry 2020 - Lê Minh Cường',
    deletedBy: 'Admin',
    deletedDate: '2024-10-20T09:00:00',
    autoDeleteDate: '2024-11-19T09:00:00',
    data: {}
  },
  {
    id: 'DEL00004',
    recordId: 'VL00156',
    recordType: 'violation',
    recordName: 'Phạm Hoàng Dũng',
    recordDetails: 'Vượt đèn đỏ - 51B-67890',
    deletedBy: 'Admin',
    deletedDate: '2024-10-18T16:45:00',
    autoDeleteDate: '2024-11-17T16:45:00',
    data: {}
  },
  {
    id: 'DEL00005',
    recordId: 'TA00015',
    recordType: 'authority',
    recordName: 'Trung tâm đăng kiểm Đà Nẵng',
    recordDetails: 'inspection_center - Đà Nẵng',
    deletedBy: 'Admin',
    deletedDate: '2024-10-15T11:20:00',
    autoDeleteDate: '2024-11-14T11:20:00',
    data: {}
  },
  {
    id: 'DEL00006',
    recordId: 'NTF00008',
    recordType: 'notification',
    recordName: 'Thông báo bảo trì hệ thống',
    recordDetails: 'Thông báo - Tất cả người dùng',
    deletedBy: 'Admin',
    deletedDate: '2024-10-12T08:00:00',
    autoDeleteDate: '2024-11-11T08:00:00',
    data: {}
  },
];

const recordTypeConfig = {
  student: { label: 'Thí sinh', color: 'bg-blue-500' },
  license: { label: 'GPLX', color: 'bg-green-500' },
  vehicle: { label: 'Phương tiện', color: 'bg-purple-500' },
  violation: { label: 'Vi phạm', color: 'bg-red-500' },
  authority: { label: 'Cơ quan', color: 'bg-orange-500' },
  notification: { label: 'Thông báo', color: 'bg-cyan-500' }
};

export default function TrashBin() {
  const [deletedRecords, setDeletedRecords] = useState(mockDeletedRecords);
  const [selectedRecord, setSelectedRecord] = useState<DeletedRecord | null>(null);
  const [actionType, setActionType] = useState<'restore' | 'delete' | null>(null);

  const handleRestore = (record: DeletedRecord) => {
    setDeletedRecords(deletedRecords.filter(r => r.id !== record.id));
    setSelectedRecord(null);
    setActionType(null);
  };

  const handlePermanentDelete = (record: DeletedRecord) => {
    setDeletedRecords(deletedRecords.filter(r => r.id !== record.id));
    setSelectedRecord(null);
    setActionType(null);
  };

  const getDaysUntilAutoDelete = (autoDeleteDate: string) => {
    const days = Math.ceil((new Date(autoDeleteDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
    return days;
  };

  const columns: ColumnDef<DeletedRecord>[] = [
    {
      key: 'recordId',
      header: 'Mã bản ghi',
      width: '110px',
      sortable: true,
      render: (item) => <span className="font-mono text-xs">{item.recordId}</span>
    },
    {
      key: 'recordType',
      header: 'Loại',
      width: '130px',
      sortable: true,
      render: (item) => (
        <Badge className={`${recordTypeConfig[item.recordType].color} text-white`}>
          {recordTypeConfig[item.recordType].label}
        </Badge>
      )
    },
    {
      key: 'recordName',
      header: 'Tên',
      sortable: true,
      render: (item) => (
        <div className="text-left w-full">
          <div className="font-medium truncate" title={item.recordName}>{item.recordName}</div>
          <div className="text-xs text-muted-foreground truncate" title={item.recordDetails}>
            {item.recordDetails}
          </div>
        </div>
      )
    },
    {
      key: 'deletedBy',
      header: 'Xóa bởi',
      width: '110px',
      render: (item) => <span className="text-sm">{item.deletedBy}</span>
    },
    {
      key: 'deletedDate',
      header: 'Ngày xóa',
      width: '140px',
      sortable: true,
      render: (item) => (
        <div className="text-sm">
          <div>{new Date(item.deletedDate).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' })}</div>
          <div className="text-xs text-muted-foreground">{new Date(item.deletedDate).toLocaleDateString('vi-VN')}</div>
        </div>
      )
    },
    {
      key: 'autoDeleteDate',
      header: 'Tự động xóa sau',
      width: '140px',
      sortable: true,
      render: (item) => {
        const days = getDaysUntilAutoDelete(item.autoDeleteDate);
        return (
          <div className="text-center">
            <div className={`text-sm font-medium ${days <= 7 ? 'text-red-600' : 'text-muted-foreground'}`}>
              -{days} ngày
            </div>
            <div className="text-xs text-muted-foreground">
              {new Date(item.autoDeleteDate).toLocaleDateString('vi-VN')}
            </div>
          </div>
        );
      }
    },
    {
      key: 'actions',
      header: 'Thao tác',
      width: '100px',
      render: (item) => (
        <div className="flex gap-1 justify-center">
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                  onClick={() => {
                    setSelectedRecord(item);
                    setActionType('restore');
                  }}
                >
                  <RotateCcw className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Khôi phục</p></TooltipContent>
            </TooltipUI>
          </TooltipProvider>

          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => {
                    setSelectedRecord(item);
                    setActionType('delete');
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent><p>Xóa vĩnh viễn</p></TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
      )
    }
  ];

  const filters: FilterConfig[] = [
    {
      key: 'recordType',
      label: 'Loại bản ghi',
      options: [
        { value: 'all', label: 'Tất cả' },
        { value: 'student', label: 'Thí sinh' },
        { value: 'license', label: 'GPLX' },
        { value: 'vehicle', label: 'Phương tiện' },
        { value: 'violation', label: 'Vi phạm' },
        { value: 'authority', label: 'Cơ quan' },
        { value: 'notification', label: 'Thông báo' }
      ]
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          {/* Title removed - already in navbar */}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 text-sm"
          >
            Xóa tất cả
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 w-8 text-sm"
          >
            Khôi phục tất cả
          </Button>
        </div>
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <div className="flex gap-3">
            <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-yellow-800">
              <p className="font-medium mb-1">Lưu ý quan trọng</p>
              <p>
                Các bản ghi trong thùng rác sẽ được tự động xóa vĩnh viễn sau 30 ngày kể từ ngày xóa. 
                Sau khi xóa vĩnh viễn, bạn sẽ không thể khôi phục lại dữ liệu.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <ModernDataTable
        data={deletedRecords}
        columns={columns}
        title="Danh sách bản ghi đã xóa"
        searchPlaceholder="Tìm kiếm theo mã, tên..."
        searchKeys={['recordId', 'recordName', 'recordDetails']}
        filters={filters}
        getItemKey={(item) => item.id}
      />

      {/* Restore Dialog */}
      <AlertDialog open={actionType === 'restore'} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận khôi phục</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn khôi phục bản ghi <strong>{selectedRecord?.recordName}</strong> không?
              Bản ghi sẽ được khôi phục về trạng thái ban đầu.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedRecord && handleRestore(selectedRecord)}
              className="bg-green-600 hover:bg-green-700"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Khôi phục
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Permanent Delete Dialog */}
      <AlertDialog open={actionType === 'delete'} onOpenChange={() => setActionType(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-600">Cảnh báo: Xóa vĩnh viễn</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa vĩnh viễn bản ghi <strong>{selectedRecord?.recordName}</strong> không?
              <br /><br />
              <span className="text-red-600 font-medium">
                Hành động này không thể hoàn tác. Tất cả dữ liệu liên quan sẽ bị xóa vĩnh viễn.
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => selectedRecord && handlePermanentDelete(selectedRecord)}
              className="bg-red-600 hover:bg-red-700"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa vĩnh viễn
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}