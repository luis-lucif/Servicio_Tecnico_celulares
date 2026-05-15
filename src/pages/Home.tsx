import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center pt-24 pb-32 px-margin-mobile md:px-margin-desktop w-full max-w-container-max mx-auto">
      {/* Hero Section */}
      <section className="flex flex-col items-center text-center max-w-4xl mx-auto space-y-8 mb-24">
        <div className="inline-flex items-center justify-center px-4 py-2 bg-surface-container rounded-full mb-4">
          <span className="material-symbols-outlined text-primary mr-2 icon-fill text-[16px]">bolt</span>
          <span className="font-label-md text-label-md text-on-surface-variant">Servicio Puerta a Puerta en menos de 24h</span>
        </div>
        <h1 className="font-display-lg-mobile text-display-lg-mobile md:font-display-lg md:text-display-lg text-on-surface max-w-3xl leading-tight">
          Reparación de Smartphones de Grado Profesional
        </h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto mt-6">
          Restauramos tu dispositivo de cualquier marca con precisión y calidad. Servicio a domicilio.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 mt-10 w-full sm:w-auto">
          <Link to="/cotizador" className="bg-primary text-on-primary font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20 flex items-center justify-center group h-[56px] w-full sm:w-auto">
            Cotizar Reparación
            <span className="material-symbols-outlined ml-2 group-hover:translate-x-1 transition-transform text-[20px]">arrow_forward</span>
          </Link>
          <Link to="/seguimiento" className="bg-surface-container text-on-surface font-label-md text-label-md px-8 py-4 rounded-xl hover:bg-surface-variant transition-colors flex items-center justify-center h-[56px] w-full sm:w-auto">
            Estado de equipo
          </Link>
        </div>
      </section>

      {/* Image Showcase */}
      <section className="w-full mb-32">
        <div className="relative w-full h-[400px] md:h-[600px] rounded-[32px] overflow-hidden bg-surface-container-highest shadow-xl">
          <img
            alt="Professional repair process"
            className="absolute inset-0 w-full h-full object-cover"
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuC1OgmJBQCmgv30kTmoed4lq-8U00S_5WhOlV1_dXhT9uLuirSdT5I6N1V8gf9JDe7j_5y_KcwNXebwoqlucA-bA3ZJLhVSq1lwol6SRp3XCrDyOt7Z2t3t2c5AX9ERYp5AmRXkvWyZuWsLRJhnMTKzUEGOb6VELSjyCKm2TnicHiW2mxRs0WJyD8w4vTE88giTjwdXqvMpYj5ZHkBWBn8gfiSrzXN8HGiwzko05bkdv5vBjty3D6bn6CvDQRhIg3kdixwrSZeqZAvT"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section className="w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {/* Feature 1 */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 md:p-10 border border-outline-variant/20 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined icon-fill">verified</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Repuestos Originales</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex-1">
              Utilizamos exclusivamente componentes de la más alta calidad para garantizar el rendimiento óptimo y la durabilidad de tu dispositivo, tal como salió de fábrica.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 md:p-10 border border-outline-variant/20 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined icon-fill">security</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Garantía de 1 año</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex-1">
              Respaldamos nuestro trabajo. Cada reparación incluye una garantía integral de 12 meses contra defectos de piezas o mano de obra, ofreciendo total tranquilidad.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-surface-container-lowest rounded-[24px] p-8 md:p-10 border border-outline-variant/20 flex flex-col shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center mb-6">
              <span className="material-symbols-outlined icon-fill">engineering</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface mb-3">Técnicos Certificados</h3>
            <p className="font-body-md text-body-md text-on-surface-variant flex-1">
              Nuestro equipo está compuesto por especialistas rigurosamente capacitados, dominando las arquitecturas más recientes para diagnósticos precisos y soluciones efectivas.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
