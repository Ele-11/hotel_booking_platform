import { FC, PropsWithChildren } from 'react';

const FormFooterBar: FC<PropsWithChildren> = ({ children }) => {
  return (
    <div className="sticky bottom-0 mt-6 border-t border-box-border bg-box-bg/90 backdrop-blur">
      <div className="mx-auto max-w-5xl px-6 py-3 flex justify-end gap-3">{children}</div>
    </div>
  );
};

export default FormFooterBar;
