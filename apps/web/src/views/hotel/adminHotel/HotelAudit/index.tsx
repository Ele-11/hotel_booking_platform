import { FC, useMemo, useState } from 'react';

type AuditStatus = 'pending' | 'approved' | 'rejected';

interface HotelAudit {
  id: number;
  name: string;
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
    id: 50,
    name: '星海国际大酒店',
    merchant: '商家 A',
    status: 'approved',
    submitTime: '2025-09-30 22:30:32',
    auditor: '管理员',
    auditTime: '2025-09-30 22:31:07',
    auditRemark: '资料完整，审核通过。',
  },
  {
    id: 51,
    name: '阳光海岸度假酒店',
    merchant: '商家 B',
    status: 'pending',
    submitTime: '2025-10-01 09:15:20',
  },
  {
    id: 52,
    name: '城市便捷酒店',
    merchant: '商家 B',
    status: 'rejected',
    submitTime: '2025-08-15 17:54:12',
    auditor: '管理员',
    auditTime: '2025-08-15 18:01:33',
    auditRemark: '缺少酒店图片和价格信息，请补充后重新提交。',
  },
];

const HotelAuditPage: FC = () => {
  const [data, setData] = useState<HotelAudit[]>(mockAudits);
  const [idKeyword, setIdKeyword] = useState('');
  const [nameKeyword, setNameKeyword] = useState('');
  const [statusFilter, setStatusFilter] = useState<AuditStatus | 'all'>('pending');

  const [showAuditModal, setshowAuditModal] = useState(false);
  const [currentAuditId, setCurrentAuditId] = useState<number | null>(null);
  const [decision, setDecision] = useState<'approved' | 'rejected'>('approved');
  const [remarkInput, setRemarkInput] = useState('');

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

  const currentAudit = useMemo(
    () => data.find((item) => item.id === currentAuditId) ?? null,
    [data, currentAuditId]
  );

  const handleReset = () => {
    setIdKeyword('');
    setNameKeyword('');
    setStatusFilter('pending');
  };

  const openAuditModal = (row: HotelAudit) => {
    setCurrentAuditId(row.id);
    setDecision('approved');
    setRemarkInput(row.auditRemark ?? '');
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
    const now = new Date().toISOString().replace('T', ' ').slice(0, 19);

    setData((prev) =>
      prev.map((row) =>
        row.id === currentAudit.id
          ? {
              ...row,
              status: decision,
              auditor: '管理员', // 作业里可以写死
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
            <button
              className="h-8 rounded bg-blue-500 px-4 text-xs text-white hover:bg-blue-600"
              // onClick={() => handleSearch()}
            >
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

      <section className="flex-1 overflow-hidden rounded-lg border border-box-border">
        <div className="overflow-x-auto">
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
              {filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-3 py-6 text-center text-muted">
                    暂无符合条件的审核记录
                  </td>
                </tr>
              ) : (
                filteredData.map((row) => (
                  <tr key={row.id} className="hover:bg-muted/30">
                    <td className="px-3 py-2 align-top text-heading-2">{row.id}</td>
                    <td className="px-3 py-2 align-top text-heading-1">{row.name}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.merchant}</td>
                    <td className="px-3 py-2 align-top text-primary">
                      {auditStatusLabelMap[row.status]}
                    </td>
                    <td className="px-3 py-2 align-top text-muted">{row.submitTime}</td>
                    <td className="px-3 py-2 align-top text-heading-2">{row.auditor ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditTime ?? '-'}</td>
                    <td className="px-3 py-2 align-top text-muted">{row.auditRemark ?? '-'}</td>
                    <td className="px-3 py-2 align-top">
                      <div className="flex flex-col gap-1 text-[11px] text-blue-600">
                        <button
                          className="text-left hover:underline"
                          onClick={() => alert('这里可以跳转到审核详情/酒店详情页面')}
                        >
                          查看详情
                        </button>
                        {row.status === 'pending' && (
                          <button
                            className="text-left hover:underline"
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
      </section>
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
                    value="approved"
                    checked={decision === 'approved'}
                    onChange={() => setDecision('approved')}
                  />
                  <span>通过</span>
                </label>
                <label className="inline-flex items-center gap-1">
                  <input
                    type="radio"
                    value="rejected"
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
                className="h-24 w-full rounded border border-box-border bg-transparent px-2 py-1 text-[11px] text-heading-2 outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder="请填写本次审核的结论和原因，例如：资料完整，允许上架 / 图片不清晰，请重新上传等。"
                value={remarkInput}
                onChange={(e) => setRemarkInput(e.target.value)}
              />
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button
                className="rounded border border-box-border bg-box-bg px-3 py-1 text-xs text-heading-2 hover:bg-muted/40"
                onClick={closeAuditModal}
              >
                取消
              </button>
              <button
                className="rounded bg-blue-500 px-4 py-1 text-xs text-white hover:bg-blue-600"
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
