import { Link, useLocation } from 'react-router-dom';

export default function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: 'home', label: 'Inicio' },
    { path: '/cotizador', icon: 'build', label: 'Reparar' },
    { path: '/seguimiento', icon: 'location_on', label: 'Rastrear' },
    { path: '/panel', icon: 'person', label: 'Cuenta' },
  ];

  return (
    <nav className="md:hidden bg-surface/90 dark:bg-surface-container-highest/90 backdrop-blur-xl border-t border-outline-variant/20 shadow-lg dark:shadow-none fixed bottom-0 left-0 w-full z-50 rounded-t-xl py-3 pb-safe px-4 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={item.path}
            to={item.path}
            className={`flex flex-col items-center justify-center transition-all duration-300 scale-110 active:scale-95 w-16 hover:opacity-80 ${
              isActive
                ? 'text-primary dark:text-primary-fixed-dim font-bold'
                : 'text-on-surface-variant dark:text-outline'
            }`}
          >
            <span className={`material-symbols-outlined mb-1 text-[24px] ${isActive ? 'icon-fill' : ''}`}>
              {item.icon}
            </span>
            <span className="font-label-sm text-[10px]">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
