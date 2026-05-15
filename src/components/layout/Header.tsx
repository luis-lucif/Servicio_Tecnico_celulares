import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header className="bg-surface/80 dark:bg-surface-container/80 backdrop-blur-xl w-full top-0 sticky z-50 border-b border-outline-variant/30 text-primary dark:text-primary-fixed-dim">
      <div className="flex justify-between items-center px-margin-mobile md:px-margin-desktop h-16 w-full max-w-container-max mx-auto">
        <button className="flex items-center justify-center p-2 rounded-full text-on-surface-variant dark:text-outline hover:bg-surface-variant/50 dark:hover:bg-surface-container-high transition-colors scale-95 active:scale-90 duration-200">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <Link to="/" className="font-headline-md text-headline-md tracking-tight text-on-surface dark:text-on-surface-variant text-center flex-1 font-bold">
          Pro Mobile Service
        </Link>
        <Link to="/panel" className="flex items-center justify-center w-8 h-8 rounded-full bg-surface-variant overflow-hidden text-on-surface-variant dark:text-outline hover:bg-surface-variant/50 dark:hover:bg-surface-container-high transition-colors scale-95 active:scale-90 duration-200">
          <span className="material-symbols-outlined text-[20px] icon-fill">person</span>
        </Link>
      </div>
    </header>
  );
}
