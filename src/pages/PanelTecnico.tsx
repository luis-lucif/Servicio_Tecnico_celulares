export default function PanelTecnico() {
  return (
    <main className="w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-[32px] md:py-[64px] pb-[120px]">
      {/* Metrics Resumen */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-[64px]">
        {/* Pendientes */}
        <div className="bg-surface-container-low rounded-[24px] p-[32px] flex flex-col justify-between hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-fill text-[24px]">inventory_2</span>
            </div>
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase">Equipos Pendientes</h2>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">12</span>
            <span className="font-label-sm text-label-sm text-primary">+3 hoy</span>
          </div>
        </div>

        {/* En Reparación */}
        <div className="bg-surface-container-highest rounded-[24px] p-[32px] flex flex-col justify-between hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-primary">
              <span className="material-symbols-outlined icon-fill text-[24px]">build</span>
            </div>
            <h2 className="font-label-md text-label-md text-on-surface-variant uppercase">En Reparación</h2>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-display-lg text-on-surface">4</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">En progreso</span>
          </div>
        </div>

        {/* Urgentes */}
        <div className="bg-error-container rounded-[24px] p-[32px] flex flex-col justify-between hover:scale-[1.01] hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] transition-all duration-300">
          <div className="flex items-center gap-[16px] mb-[24px]">
            <div className="w-12 h-12 rounded-full bg-surface flex items-center justify-center text-error">
              <span className="material-symbols-outlined icon-fill text-[24px]">warning</span>
            </div>
            <h2 className="font-label-md text-label-md text-on-error-container uppercase">Urgentes</h2>
          </div>
          <div className="flex items-end justify-between">
            <span className="font-display-lg text-display-lg text-on-error-container">2</span>
            <span className="font-label-sm text-label-sm text-error">Atención inmediata</span>
          </div>
        </div>
      </section>

      {/* Repair Queue */}
      <section>
        <div className="flex justify-between items-center mb-[32px]">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">Trabajos Asignados</h2>
          <button className="bg-surface-container-highest text-primary font-label-md text-label-md px-[24px] py-[12px] rounded-full hover:bg-surface-variant transition-colors flex items-center gap-2">
            <span className="material-symbols-outlined text-[20px]">filter_list</span>
            Filtrar
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">
          {/* Ticket 1 (Urgente) */}
          <div className="bg-surface-container-lowest rounded-[32px] p-[32px] border border-outline-variant/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-300 flex flex-col gap-[24px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-error/10 text-error font-label-sm text-label-sm px-3 py-1 rounded-full mb-[16px]">Prioridad Alta</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-[8px]">iPhone 15 Pro</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Cambio de pantalla completa. Cristal roto y táctil no responde.</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Tiempo Transcurrido</span>
                <span className="font-body-lg text-body-lg text-error font-medium">4h 15m</span>
              </div>
            </div>
            <div className="mt-auto pt-[24px] border-t border-outline-variant/20 flex gap-[16px]">
              <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md h-[48px] rounded-xl hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_arrow</span>
                Iniciar Reparación
              </button>
            </div>
          </div>

          {/* Ticket 2 (En progreso) */}
          <div className="bg-surface-container-lowest rounded-[32px] p-[32px] border border-outline-variant/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-300 flex flex-col gap-[24px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-primary/10 text-primary font-label-sm text-label-sm px-3 py-1 rounded-full mb-[16px]">En Progreso</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-[8px]">Samsung Galaxy S24 Ultra</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Reemplazo de módulo de cámara principal. Fallo de enfoque.</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Tiempo Transcurrido</span>
                <span className="font-body-lg text-body-lg text-on-surface font-medium">1h 30m</span>
              </div>
            </div>
            <div className="mt-auto pt-[24px] border-t border-outline-variant/20 flex gap-[16px]">
              <button className="flex-1 bg-surface-container-highest text-primary font-label-md text-label-md h-[48px] rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">update</span>
                Actualizar Estado
              </button>
            </div>
          </div>

          {/* Ticket 3 (Pendiente Normal) */}
          <div className="bg-surface-container-lowest rounded-[32px] p-[32px] border border-outline-variant/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-300 flex flex-col gap-[24px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full mb-[16px]">Normal</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-[8px]">Google Pixel 8</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Sustitución de batería. Degradación severa (capacidad al 60%).</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Ingresado hace</span>
                <span className="font-body-lg text-body-lg text-on-surface font-medium">30m</span>
              </div>
            </div>
            <div className="mt-auto pt-[24px] border-t border-outline-variant/20 flex gap-[16px]">
              <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md h-[48px] rounded-xl hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_arrow</span>
                Iniciar Reparación
              </button>
            </div>
          </div>

          {/* Ticket 4 (Pendiente Normal) */}
          <div className="bg-surface-container-lowest rounded-[32px] p-[32px] border border-outline-variant/20 hover:shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:scale-[1.01] transition-all duration-300 flex flex-col gap-[24px]">
            <div className="flex justify-between items-start">
              <div>
                <span className="inline-block bg-surface-variant text-on-surface-variant font-label-sm text-label-sm px-3 py-1 rounded-full mb-[16px]">Normal</span>
                <h3 className="font-headline-md text-headline-md text-on-surface mb-[8px]">iPad Pro 12.9" (M2)</h3>
                <p className="font-body-md text-body-md text-on-surface-variant">Reparación de puerto de carga USB-C. Conector dañado internamente.</p>
              </div>
              <div className="text-right">
                <span className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">Ingresado hace</span>
                <span className="font-body-lg text-body-lg text-on-surface font-medium">1h 10m</span>
              </div>
            </div>
            <div className="mt-auto pt-[24px] border-t border-outline-variant/20 flex gap-[16px]">
              <button className="flex-1 bg-primary text-on-primary font-label-md text-label-md h-[48px] rounded-xl hover:bg-primary-container transition-colors flex items-center justify-center gap-2">
                <span className="material-symbols-outlined">play_arrow</span>
                Iniciar Reparación
              </button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
