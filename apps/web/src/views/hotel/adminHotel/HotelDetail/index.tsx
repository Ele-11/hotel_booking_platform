import { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

type AuditStatus = 'pending' | 'approved' | 'rejected';

interface HotelDetail {
  id: number;
  name: string;
  merchant: string;
  city: string;
  address: string;
  starLevel: string;
  type: string;
  minPrice: number;
  phone: string;
  submitTime: string;
  status: AuditStatus;
  auditor?: string;
  auditTime?: string;
  auditRemark?: string;
  description?: string;
  trafficInfo?: string;
}

const auditStatusLabelMap: Record<AuditStatus, string> = {
  pending: '待审核',
  approved: '审核通过',
  rejected: '审核拒绝',
};

const mockDetails: HotelDetail[] = [
  {
    id: 1,
    name: '星海国际大酒店',
    merchant: 'zz',
    city: '上海',
    address: '浦东新区世纪大道 100 号',
    starLevel: '五星级',
    type: '商务/会议',
    minPrice: 688,
    phone: '021-8888 6666',
    submitTime: '2025-09-30 22:30:32',
    status: 'approved',
    auditor: '管理员',
    auditTime: '2025-09-30 22:31:07',
    auditRemark: '资料完整，审核通过。',
    description:
      '星海国际大酒店位于上海浦东核心商务区，临近地铁与大型购物中心，拥有多种房型与会议设施。',
    trafficInfo: '步行 5 分钟可达地铁 2 号线，距离浦东国际机场约 40 分钟车程。',
  },
  {
    id: 2,
    name: '阳光海岸度假酒店',
    merchant: 'zz',
    city: '三亚',
    address: '三亚湾路 88 号',
    starLevel: '四星级',
    type: '海滨度假',
    minPrice: 568,
    phone: '0898-6666 9999',
    submitTime: '2025-10-01 09:15:20',
    status: 'pending',
    description: '面朝大海，拥有海景客房和室外泳池，适合亲子和度假人群。',
    trafficInfo: '距三亚凤凰国际机场约 15 公里，可乘坐机场大巴或出租车直达。',
  },
];

const HotelDetailPage: FC = () => {
  const params = useParams<{ id: string }>();
  const navigate = useNavigate();
  const idNum = Number(params.id);

  const hotel = mockDetails.find((h) => h.id === idNum);

  if (!hotel) {
    return (
      <div className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-heading-1">酒店详情</h2>
          <button
            className="rounded border border-box-border bg-box-bg px-3 py-1 text-xs text-heading-2 hover:bg-muted/40"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
        <div className="rounded-lg border border-box-border bg-box-bg p-6 text-xs text-muted">
          未找到对应的酒店信息。
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-heading-1">酒店详情</h2>
          <p className="mt-1 text-xs text-muted">查看酒店的基础信息以及审核信息。</p>
        </div>
        <button
          className="rounded border border-box-border bg-box-bg px-3 py-1 text-xs text-heading-2 hover:bg-muted/40"
          onClick={() => navigate(-1)}
        >
          返回
        </button>
      </div>

      <section className="rounded-lg border border-box-border bg-box-bg p-4 text-xs">
        <h3 className="mb-3 text-sm font-semibold text-heading-1">酒店基础信息</h3>
        <div className="grid grid-cols-1 gap-y-2 gap-x-10 md:grid-cols-2">
          <div>
            <span className="text-muted">酒店ID：</span>
            <span className="text-heading-2">{hotel.id}</span>
          </div>
          <div>
            <span className="text-muted">酒店名称：</span>
            <span className="text-heading-1">{hotel.name}</span>
          </div>
          <div>
            <span className="text-muted">所属商家：</span>
            <span className="text-heading-2">{hotel.merchant}</span>
          </div>
          <div>
            <span className="text-muted">所在城市：</span>
            <span className="text-heading-2">{hotel.city}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted">详细地址：</span>
            <span className="text-heading-2">{hotel.address}</span>
          </div>
          <div>
            <span className="text-muted">酒店星级：</span>
            <span className="text-heading-2">{hotel.starLevel}</span>
          </div>
          <div>
            <span className="text-muted">酒店类型：</span>
            <span className="text-heading-2">{hotel.type}</span>
          </div>
          <div>
            <span className="text-muted">起始价格：</span>
            <span className="text-heading-2">¥{hotel.minPrice} 起</span>
          </div>
          <div>
            <span className="text-muted">联系电话：</span>
            <span className="text-heading-2">{hotel.phone}</span>
          </div>
          <div>
            <span className="text-muted">提交时间：</span>
            <span className="text-heading-2">{hotel.submitTime}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-box-border bg-box-bg p-4 text-xs">
        <h3 className="mb-3 text-sm font-semibold text-heading-1">审核信息</h3>
        <div className="grid grid-cols-1 gap-y-2 gap-x-10 md:grid-cols-2">
          <div>
            <span className="text-muted">审核状态：</span>
            <span className="text-primary">{auditStatusLabelMap[hotel.status]}</span>
          </div>
          <div>
            <span className="text-muted">审核人：</span>
            <span className="text-heading-2">{hotel.auditor ?? '-'}</span>
          </div>
          <div>
            <span className="text-muted">审核时间：</span>
            <span className="text-heading-2">{hotel.auditTime ?? '-'}</span>
          </div>
          <div className="md:col-span-2">
            <span className="text-muted">审核备注：</span>
            <span className="text-heading-2">{hotel.auditRemark ?? '-'}</span>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-box-border bg-box-bg p-4 text-xs">
        <h3 className="mb-3 text-sm font-semibold text-heading-1">酒店简介与周边</h3>
        <div className="space-y-3">
          <div>
            <div className="mb-1 text-[11px] text-muted">酒店简介</div>
            <p className="whitespace-pre-wrap text-heading-2">
              {hotel.description ?? '暂无酒店简介。'}
            </p>
          </div>
          <div>
            <div className="mb-1 text-[11px] text-muted">交通与周边</div>
            <p className="whitespace-pre-wrap text-heading-2">
              {hotel.trafficInfo ?? '暂无交通与周边信息。'}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelDetailPage;
