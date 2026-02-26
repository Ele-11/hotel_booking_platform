import { FC, useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type AuditStatus = 'pending' | 'approved' | 'rejected';

interface HotelAudit {
  id: number;
  name: string;
  englishName: string;
  merchant: string;
  status: AuditStatus;
  submitTime: string;
  auditor?: string;
  auditTime?: string;
  auditRemark?: string;
}

const auditStatusLabelMap: Record<AuditStatus, string> = {
  pending: '待审核',
  approved: '审核通过',
  rejected: '审核拒绝',
};

const mockAudits: HotelAudit[] = [
  {
    id: 1,
    name: '星海国际大酒店',
    englishName: 'Xinghai International Hotel',
    merchant: 'zz',
    status: 'approved',
    submitTime: '2026-02-20 10:30:00',
    auditor: '管理员',
    auditTime: '2026-02-20 11:30:00',
    auditRemark: '资料完整，审核通过，已发布。',
  },
  {
    id: 2,
    name: '阳光海岸度假酒店',
    englishName: 'Sunshine Coast Resort Hotel',
    merchant: 'zz',
    status: 'approved',
    submitTime: '2026-02-11 09:15:00',
    auditor: '管理员',
    auditTime: '2026-02-11 10:15:00',
    auditRemark: '资质齐全，审核通过，正常发布。',
  },
  {
    id: 3,
    name: '城市便捷酒店',
    englishName: 'City Convenient Hotel',
    merchant: 'zhangzhang',
    status: 'rejected',
    submitTime: '2026-02-09 14:20:00',
    auditor: '管理员',
    auditTime: '2026-02-09 15:20:00',
    auditRemark: '地址信息不完整，审核不通过，暂下线整改。',
  },
  {
    id: 4,
    name: '洲际酒店',
    englishName: 'InterContinental Hotel',
    merchant: 'zz',
    status: 'approved',
    submitTime: '2026-02-16 11:10:00',
    auditor: '管理员',
    auditTime: '2026-02-16 12:10:00',
    auditRemark: '所有资料符合要求，审核通过并发布。',
  },
  {
    id: 5,
    name: '里白酒店',
    englishName: 'LiBai Hotel',
    merchant: 'zhangzhang',
    status: 'pending',
    submitTime: '2026-02-24 16:45:00',
  },
  {
    id: 6,
    name: '便捷酒店',
    englishName: 'Bianjie Hotel',
    merchant: 'zhangzhang',
    status: 'pending',
    submitTime: '2026-02-24 16:47:35',
  },
  {
    id: 7,
    name: '西湖酒店',
    englishName: 'west lake Hotel',
    merchant: 'zhangzhang',
    status: 'rejected',
    submitTime: '2026-02-24 16:48:30',
    auditor: '管理员',
    auditTime: '2026-02-24 16:58:30',
    auditRemark: '卫生许可证未上传，审核驳回，下线整改。',
  },
  {
    id: 8,
    name: '酒店',
    englishName: 'Hotel',
    merchant: 'zhangzhang',
    status: 'pending',
    submitTime: '2026-02-24 16:50:00',
  },
  {
    id: 9,
    name: '锦江之星酒店',
    englishName: 'Jinjiang Inn Hotel',
    merchant: '张三',
    status: 'approved',
    submitTime: '2026-02-15 08:40:00',
    auditor: '管理员',
    auditTime: '2026-02-15 09:40:00',
    auditRemark: '资料审核通过，符合发布标准，已上线。',
  },
  {
    id: 10,
    name: '铂尔曼大酒店',
    englishName: 'Pullman Grand Hotel',
    merchant: '里斯',
    status: 'approved',
    submitTime: '2026-02-18 11:25:00',
    auditor: '管理员',
    auditTime: '2026-02-18 12:25:00',
    auditRemark: '资质齐全，审核通过，正常发布运营。',
  },
  {
    id: 11,
    name: '如家快捷酒店',
    englishName: 'Home Inn Express Hotel',
    merchant: '里斯',
    status: 'rejected',
    submitTime: '2026-02-05 15:30:00',
    auditor: '管理员',
    auditTime: '2026-02-05 16:30:00',
    auditRemark: '价格体系不清晰，审核不通过，下线调整。',
  },
  {
    id: 12,
    name: '汉庭酒店',
    englishName: 'Hanting Hotel',
    merchant: '里斯',
    status: 'rejected',
    submitTime: '2026-02-10 13:10:00',
    auditor: '管理员',
    auditTime: '2026-02-10 14:10:00',
    auditRemark: '房型信息缺失，审核驳回，补充后重新提交。',
  },
  {
    id: 13,
    name: '香格里拉酒店',
    englishName: 'Shangri-La Hotel',
    merchant: '张三',
    status: 'approved',
    submitTime: '2026-02-22 09:50:00',
    auditor: '管理员',
    auditTime: '2026-02-22 10:50:00',
    auditRemark: '审核通过，所有信息符合平台规范，已发布。',
  },
  {
    id: 14,
    name: '维也纳酒店',
    englishName: 'Vienna Hotel',
    merchant: '孙刘',
    status: 'approved',
    submitTime: '2026-02-17 10:20:00',
    auditor: '管理员',
    auditTime: '2026-02-17 11:20:00',
    auditRemark: '资料完整有效，审核通过，正常发布。',
  },
  {
    id: 15,
    name: '7天连锁酒店',
    englishName: '7 Days Inn Hotel',
    merchant: '里斯',
    status: 'rejected',
    submitTime: '2026-02-08 16:40:00',
    auditor: '管理员',
    auditTime: '2026-02-08 17:40:00',
    auditRemark: '营业执照未年检，审核不通过，下线更新。',
  },
  {
    id: 16,
    name: '桔子水晶酒店',
    englishName: 'Crystal Orange Hotel',
    merchant: '孙刘',
    status: 'rejected',
    submitTime: '2026-02-21 14:15:00',
    auditor: '管理员',
    auditTime: '2026-02-21 15:15:00',
    auditRemark: '发票资质不全，审核驳回，补充后可重新提交。',
  },
  {
    id: 17,
    name: '万豪酒店',
    englishName: 'Marriott Hotel',
    merchant: '孙刘',
    status: 'approved',
    submitTime: '2026-02-14 08:30:00',
    auditor: '管理员',
    auditTime: '2026-02-14 09:30:00',
    auditRemark: '审核通过，符合五星级酒店发布标准，已上线。',
  },
  {
    id: 18,
    name: '全季酒店',
    englishName: 'Ji Hotel',
    merchant: '孙刘',
    status: 'approved',
    submitTime: '2026-02-19 12:10:00',
    auditor: '管理员',
    auditTime: '2026-02-19 13:10:00',
    auditRemark: '资料审核通过，已发布至平台。',
  },
  {
    id: 19,
    name: '速8酒店',
    englishName: 'Super 8 Hotel',
    merchant: '王五',
    status: 'rejected',
    submitTime: '2026-02-06 11:20:00',
    auditor: '管理员',
    auditTime: '2026-02-06 12:20:00',
    auditRemark: '卫生检查未达标，审核不通过，下线整改。',
  },
  {
    id: 20,
    name: '亚朵酒店',
    englishName: 'Atour Hotel',
    merchant: '王五',
    status: 'rejected',
    submitTime: '2026-02-23 10:15:00',
    auditor: '管理员',
    auditTime: '2026-02-23 11:15:00',
    auditRemark: '特种行业许可证过期，审核驳回，更新后重提。',
  },
  {
    id: 21,
    name: '希尔顿酒店',
    englishName: 'Hilton Hotel',
    merchant: '王五',
    status: 'approved',
    submitTime: '2026-02-13 09:40:00',
    auditor: '管理员',
    auditTime: '2026-02-13 10:40:00',
    auditRemark: '所有资质齐全，审核通过，已发布。',
  },
  {
    id: 22,
    name: '莫泰酒店',
    englishName: 'Motel Hotel',
    merchant: '王五',
    status: 'rejected',
    submitTime: '2026-02-04 14:50:00',
    auditor: '管理员',
    auditTime: '2026-02-04 15:50:00',
    auditRemark: '地址标注错误，审核不通过，修正后重新提交。',
  },
];

const HotelAuditPage: FC = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<HotelAudit[]>(mockAudits);
  const [idKeyword, setIdKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('all');

  // 分页相关状态
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const [showAuditModal, setshowAuditModal] = useState(false);
  const [currentAuditId, setCurrentAuditId] = useState<number | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [remarkInput, setRemarkInput] = useState('');

  // 1. 过滤逻辑
  const filteredData = useMemo(
    () =>
      data.filter((row) => {
        const matchId = idKeyword.trim() === '' || String(row.id).includes(idKeyword.trim());
        const matchName =
          nameKeyword.trim() === '' || row.name.toLowerCase().includes(nameKeyword.toLowerCase());
        const matchStatus = statusFilter === 'all' ? true : row.status === statusFilter;
        return matchId && matchName && matchStatus;
      }),
    [data, idKeyword, nameKeyword, statusFilter]
  );

  // 2. 分页切片
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredData.length / pageSize);

  // 3. 搜索条件改变重置分页
  useEffect(() => {
    setCurrentPage(1);
  }, [idKeyword, nameKeyword, statusFilter, pageSize]);

  const currentAudit = useMemo(
    () => data.find((item) => item.id === currentAuditId) ?? null,
    [data, currentAuditId]
  );

  const handleReset = () => {
    setIdKeyword('');
    setNameKeyword('');
    setStatusFilter('all');
  };

  const openAuditModal = (row: HotelAudit) => {
    setCurrentAuditId(row.id);
    setDecision('approved');
    setRemarkInput('');
    setshowAuditModal(true);
  };

  const closeAuditModal = () => {
    setshowAuditModal(false);
    setCurrentAuditId(null);
    setRemarkInput('');
  };

  const handleConfirmAudit = () => {
    if (!currentAudit) return;
    if (!remarkInput.trim()) {
      alert('请填写审核意见');
      return;
    }
    const now = new Date().toLocaleString();

    setData((prev) =>
      prev.map((row) =>
        row.id === currentAudit.id
          ? {
              ...row,
              status: decision,
              auditor: '管理员',
              auditTime: now,
              auditRemark: remarkInput,
            }
          : row
      )
    );
    closeAuditModal();
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 搜索栏 */}
      <section className="rounded-lg border border-box-border bg-muted/40 px-4 py-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">酒店ID：</span>
            <input
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店ID"
              value={idKeyword}
              onChange={(e) => setIdKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">酒店名称：</span>
            <input
              className="h-8 w-56 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="请输入酒店名称"
              value={nameKeyword}
              onChange={(e) => setNameKeyword(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="whitespace-nowrap text-muted">审核状态：</span>
            <select
              className="h-8 w-40 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as AuditStatus | 'all')}
            >
              <option value="all">全部</option>
              <option value="pending">待审核</option>
              <option value="approved">审核通过</option>
              <option value="rejected">审核拒绝</option>
            </select>
          </div>
          <div className="ml-auto flex gap-2">
            <button className="h-8 rounded bg-blue-500 px-4 text-xs text-white hover:bg-blue-600">
              搜索
            </button>
            <button
              className="h-8 rounded border border-box-border bg-box-bg px-4 text-xs text-heading-2 hover:bg-muted/40"
              onClick={handleReset}
            >
              重置
            </button>
          </div>
        </div>
      </section>

      {/* 表格 */}
      <section className="flex-1 overflow-hidden rounded-lg border border-box-border flex flex-col bg-white">
        <div className="overflow-x-auto flex-1">
          <table className="min-w-full divide-y divide-box-border text-xs">
            <thead className="bg-muted/40">
              <tr>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店ID</th>
                <th className="px-3 py-2 text-left font-medium text-muted">酒店名称</th>
                <th className="px-3 py-2 text-left font-medium text-muted">所属商家</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核状态</th>
                <th className="px-3 py-2 text-left font-medium text-muted">提交时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核人</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核时间</th>
                <th className="px-3 py-2 text-left font-medium text-muted">审核备注</th>
                <th className="px-3 py-2 text-left font-medium text-muted">操作</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-box-border bg-box-bg">
              {paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-muted">
                    暂无符合条件的审核记录
                  </td>
                </tr>
              ) : (
                paginatedData.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 align-top text-heading-2">{row.id}</td>
                    <td className="px-3 py-2 align-top text-blue-600 font-medium">{row.name}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.merchant}</td>
                    <td className="px-3 py-2 align-top">{auditStatusLabelMap[row.status]}</td>
                    <td className="px-3 py-2 align-top text-muted">
                      {row.submitTime.split(' ')[0]}
                    </td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.auditor ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditTime ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted truncate max-w-[150px]">
                      {row.auditRemark ?? '-'}
                    </td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1 text-[11px] text-blue-600">
                        <button
                          className="text-left hover:underline"
                          onClick={() => navigate(`/admin/detail/${row.id}`)}
                        >
                          查看详情
                        </button>
                        {row.status === 'pending' && (
                          <button
                            className="text-left hover:underline font-medium"
                            onClick={() => openAuditModal(row)}
                          >
                            审核
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 分页条 */}
        <div className="flex items-center justify-between border-t border-box-border bg-muted/20 px-4 py-3 text-xs text-muted">
          <div className="flex items-center gap-4">
            <span>共 {filteredData.length} 条记录</span>
            <select
              className="h-8 rounded border border-box-border bg-box-bg px-2 outline-none focus:border-primary"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[10, 20, 50].map((size) => (
                <option key={size} value={size}>
                  {size} 条/页
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 rounded border border-box-border bg-box-bg px-3 disabled:opacity-50"
            >
              上一页
            </button>
            <div className="flex items-center gap-1">
              <span className="font-medium text-heading-1">{currentPage}</span>
              <span>/</span>
              <span>{totalPages || 1}</span>
            </div>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 rounded border border-box-border bg-box-bg px-3 disabled:opacity-50"
            >
              下一页
            </button>
          </div>
        </div>
      </section>

      {/* 审核弹窗保持不变 */}
      {showAuditModal && currentAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <div className="w-full max-w-md rounded-lg bg-box-bg p-4 shadow-lg text-xs">
            <h3 className="text-sm font-semibold text-heading-1">酒店审核</h3>
            <p className="mt-1 text-[11px] text-muted">
              请确认酒店信息，并选择审核结果和填写审核意见。
            </p>
            <div className="mt-3 space-y-1 text-[11px] text-heading-2">
              <div>
                <span className="text-muted">酒店名称：</span>
                <span>{currentAudit.name}</span>
              </div>
              <div>
                <span className="text-muted">所属商家：</span>
                <span>{currentAudit.merchant}</span>
              </div>
              <div>
                <span className="text-muted">提交时间：</span>
                <span>{currentAudit.submitTime}</span>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 text-[11px] text-muted">审核结果</div>
              <div className="flex gap-4 text-[11px] text-heading-2">
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    checked={decision === 'approved'}
                    onChange={() => setDecision('approved')}
                  />
                  <span>通过</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    checked={decision === 'rejected'}
                    onChange={() => setDecision('rejected')}
                  />
                  <span>拒绝</span>
                </label>
              </div>
            </div>
            <div className="mt-3">
              <div className="mb-1 text-[11px] text-muted">
                审核意见<span className="ml-1 text-red-500">*</span>
              </div>
              <textarea
                className="h-24 w-full rounded border border-box-border bg-transparent px-2 py-1 text-[11px] outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
                placeholder="请填写审核理由..."
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded border border-box-border px-3 py-1"
                onClick={closeAuditModal}
              >
                取消
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-1 text-white"
                onClick={handleConfirmAudit}
              >
                确认审核
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HotelAuditPage;
