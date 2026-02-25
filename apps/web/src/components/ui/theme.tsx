import { FC } from 'react';
import { toggleTheme } from '@/store/slices/themeSlice';
import { useAppSelector, useAppDispatch } from '@/store/hooks';

export const Theme: FC = () => {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.theme);

  return (
    <div className="min-w-max flex items-center gap-x-3">
      <button
        onClick={() => dispatch(toggleTheme())}
        aria-label={theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
        title={theme === 'dark' ? '切换亮色模式' : '切换暗色模式'}
        className="flex items-center justify-center w-8 h-8 rounded-full 
        border border-box-border hover:bg-box-bg/80 transition-colors duration-200"
      >
        {theme === 'dark' ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6 text-heading-3"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 12.79A9 9 0 1111.21 3a7 7 0 0010.5 9.79z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="w-6 h-6 text-heading-2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 4V2M12 22v-2M4.93 4.93l-1.41-1.41M19.07 19.07l-1.41-1.41M4 12H2m20 0h-2M4.93 19.07l-1.41 1.41M19.07 4.93l-1.41 1.41M12 18a6 6 0 100-12 6 6 0 000 12z"
            />
          </svg>
        )}
      </button>
    </div>
  );
};
export default Theme;
