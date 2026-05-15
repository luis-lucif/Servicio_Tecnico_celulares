import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="hidden md:flex bg-surface-container-lowest dark:bg-on-background border-t border-outline-variant/10 w-full pb-32 md:pb-0 mt-auto">
      <div className="w-full py-16 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto flex flex-col md:flex-row justify-between gap-8 items-center">
        <div className="font-body-md text-body-md text-on-surface-variant dark:text-outline">
          © 2024 Pro Mobile Service. Reparaciones Profesionales.
        </div>
        <div className="flex flex-wrap gap-6">
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all opacity-100 hover:opacity-80" href="#">Política de Privacidad</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all opacity-100 hover:opacity-80" href="#">Términos de Servicio</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all opacity-100 hover:opacity-80" href="#">Garantía</a>
          <a className="font-body-md text-body-md text-on-surface-variant dark:text-outline hover:text-primary dark:hover:text-primary-fixed-dim underline transition-all opacity-100 hover:opacity-80" href="#">Contacto</a>
        </div>
      </div>
    </footer>
  );
}
