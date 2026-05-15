export default function Seguimiento() {
  return (
    <main className="flex-grow flex flex-col items-center justify-center py-16 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      <div className="w-full max-w-[600px] flex flex-col gap-12">
        {/* Header Section */}
        <div className="text-center space-y-4">
          <h1 className="font-headline-lg text-headline-lg text-on-surface">Seguimiento de Orden</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Ingresa tu número de orden para ver el estado actual de tu reparación.</p>
        </div>

        {/* Search Input Module */}
        <div className="relative w-full shadow-[0_4px_24px_rgba(0,0,0,0.04)] rounded-[12px] bg-surface-container-lowest">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <span className="material-symbols-outlined text-outline">search</span>
          </div>
          <input 
            className="w-full pl-12 pr-4 py-4 bg-surface-container-lowest border-none rounded-[12px] font-body-md text-body-md text-on-surface placeholder:text-outline focus:ring-2 focus:ring-primary focus:outline-none transition-shadow" 
            placeholder="Ingresa tu número de orden" 
            type="text" 
            defaultValue="ORD-9824X"
          />
          <button className="absolute inset-y-0 right-2 my-auto h-10 px-4 bg-primary text-on-primary font-label-md text-label-md rounded-[8px] hover:bg-surface-tint transition-colors scale-95 active:scale-90">
            Rastrear
          </button>
        </div>

        {/* Timeline Card */}
        <div className="bg-surface-container-lowest rounded-[24px] p-8 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-8 border-b border-outline-variant/10 pb-6">
            <div>
              <div className="font-label-md text-label-md text-outline mb-1">Número de Orden</div>
              <div className="font-headline-md text-headline-md text-on-surface">ORD-9824X</div>
            </div>
            <div className="px-4 py-2 bg-primary-container/20 text-primary-container font-label-sm text-label-sm rounded-full">
              En Laboratorio
            </div>
          </div>

          {/* Vertical Timeline */}
          <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-primary before:via-outline-variant/30 before:to-outline-variant/30">
            
            {/* Step 1: Completed */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-primary text-on-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[20px]">local_shipping</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-surface-container-low border border-outline-variant/10 ml-4 md:ml-0 md:mr-0 group-odd:ml-0 group-odd:mr-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-label-md text-label-md text-on-surface font-bold">Retiro en camino</h3>
                  <time className="font-label-sm text-label-sm text-outline">09:41 AM</time>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Dispositivo recogido exitosamente.</p>
              </div>
            </div>

            {/* Step 2: Active/Current */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-primary bg-surface-container-lowest text-primary shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ring-4 ring-primary/20">
                <span className="material-symbols-outlined text-[20px]">biotech</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-surface-container-lowest border-2 border-primary ml-4 md:ml-0 md:mr-0 group-odd:ml-0 group-odd:mr-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)]">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-label-md text-label-md text-primary font-bold">En Laboratorio</h3>
                  <time className="font-label-sm text-label-sm text-primary">Actual</time>
                </div>
                <p className="font-body-md text-body-md text-on-surface-variant text-sm">Diagnóstico y reparación en progreso por técnicos certificados.</p>
              </div>
            </div>

            {/* Step 3: Pending */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-outline-variant/30 bg-surface-container-lowest text-outline-variant shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[20px]">build_circle</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-transparent ml-4 md:ml-0 md:mr-0 group-odd:ml-0 group-odd:mr-4 opacity-50">
                <h3 className="font-label-md text-label-md text-outline font-bold">Reparado</h3>
              </div>
            </div>

            {/* Step 4: Pending */}
            <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">
              <div className="flex items-center justify-center w-10 h-10 rounded-full border-2 border-outline-variant/30 bg-surface-container-lowest text-outline-variant shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                <span className="material-symbols-outlined text-[20px]">home_work</span>
              </div>
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[16px] bg-transparent ml-4 md:ml-0 md:mr-0 group-odd:ml-0 group-odd:mr-4 opacity-50">
                <h3 className="font-label-md text-label-md text-outline font-bold">Entrega en curso</h3>
              </div>
            </div>

          </div>
        </div>
      </div>
    </main>
  );
}
