import { FC, PropsWithChildren } from 'react';

type Props = PropsWithChildren<{
  title: string;
  desc?: string;
  className?: string;
}>;

const SectionTitle: FC<Props> = ({ title, desc, children, className }) => {
  return (
    <section className={className}>
      <div className="mb-3">
        <div className="text-[15px] font-semibold text-heading-2">{title}</div>
        {desc ? <div className="mt-1 text-xs text-heading-3">{desc}</div> : null}
      </div>

      <div className="rounded-xl border border-box-border bg-box-bg p-5 shadow-sm">{children}</div>
    </section>
  );
};

export default SectionTitle;
