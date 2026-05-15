import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

interface ModeloDispositivo {
  id: string;
  marca: string;
  nombre_modelo: string;
  serie: string | null;
}

export default function Cotizador() {
  const navigate = useNavigate();
  const [modelos, setModelos] = useState<ModeloDispositivo[]>([]);
  const [marcas, setMarcas] = useState<string[]>([]);
  
  const [selectedMarca, setSelectedMarca] = useState<string | null>(null);
  const [selectedModelo, setSelectedModelo] = useState<ModeloDispositivo | null>(null);
  
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIssue, setSelectedIssue] = useState<string | null>(null);

  // States for Step 3 & 4
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  
  // Fake dynamic pricing calculation
  const getEstimatedPrice = () => {
    let base = 100;
    if (selectedMarca === 'Apple') base += 150;
    if (selectedMarca === 'Samsung') base += 100;
    if (selectedIssue === 'pantalla') base += 80;
    if (selectedIssue === 'agua') base += 120;
    return base;
  };

  useEffect(() => {
    async function fetchModelos() {
      try {
        const { data, error } = await supabase
          .from('modelos_dispositivos')
          .select('*')
          .order('marca', { ascending: true })
          .order('nombre_modelo', { ascending: true });
          
        if (error) throw error;
        
        if (data) {
          setModelos(data);
          const uniqueMarcas = Array.from(new Set(data.map((m) => m.marca)));
          setMarcas(uniqueMarcas);
        }
      } catch (err) {
        console.error('Error fetching models:', err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchModelos();
  }, []);

  const handleSubmit = async () => {
    if (!isFormComplete) return;
    setIsSubmitting(true);
    
    try {
      const { data, error } = await supabase.from('ordenes').insert({
        marca: selectedMarca,
        modelo_id: selectedModelo?.id,
        nombre_modelo: selectedModelo?.nombre_modelo,
        problema: selectedIssue,
        email: email,
        telefono: phone,
        estado: 'Cotizado',
      }).select().single();

      if (error) throw error;
      if (data) setOrderId(data.id);
      setSuccess(true);
    } catch (err) {
      console.error('Error submitting order:', err);
      alert('Hubo un problema al generar la cotización. Revisa la consola para más detalles.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const enviarPresupuestoWhatsapp = () => {
    const numeroWhatsApp = "5491127722634"; // Reemplaza esto con tu número real, incluyendo el código de país (ej. 5491123456789)
    
    const problemaTxt = [
      { id: 'pantalla', title: 'Reemplazo de Pantalla' },
      { id: 'bateria', title: 'Reemplazo de Batería' },
      { id: 'camara', title: 'Reparación de Cámara' },
      { id: 'agua', title: 'Daño por Agua' },
    ].find(i => i.id === selectedIssue)?.title || 'Reparación General';

    const texto = `Detalle del Presupuesto:
📱 *Equipo:* ${selectedMarca} ${selectedModelo?.nombre_modelo}
🔧 *Servicio:* ${problemaTxt}
💰 *Precio:* $${getEstimatedPrice()} (Efectivo/Transferencia)

La reparación es en el día! Traes tu equipo por la mañana y lo retiras por la tarde antes de las 18hs. El presupuesto incluye repuesto, colocación y 60 días de garantía. Usamos repuestos homologados de primera calidad. Para mas informacion podes consultarnos`;

    const encodedText = encodeURIComponent(texto);
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodedText}`, '_blank');
  };

  const modelosDeMarca = modelos.filter(m => m.marca === selectedMarca);
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const isFormComplete = selectedModelo && selectedIssue && isValidEmail && phone.length >= 6;

  if (success) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-24 h-24 rounded-full bg-primary-container text-primary flex items-center justify-center mb-2">
          <span className="material-symbols-outlined text-[48px]">request_quote</span>
        </div>
        <div className="space-y-2">
          <h2 className="font-display-lg text-display-lg text-on-surface">¡Cotización Lista!</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md mx-auto">
            El costo estimado para reparar tu <span className="font-bold text-on-surface">{selectedModelo?.nombre_modelo}</span> es:
          </p>
        </div>
        
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 md:p-12 shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <div className="flex items-baseline justify-center gap-2 relative z-10">
            <span className="font-display-lg text-display-lg text-primary">${getEstimatedPrice()}</span>
            <span className="font-headline-md text-headline-md text-on-surface-variant">.00</span>
          </div>
          <p className="font-label-sm text-label-sm text-on-surface-variant mt-4 relative z-10">Incluye repuestos originales y 90 días de garantía.</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-8 flex-wrap justify-center">
          <button 
            onClick={() => {
              if(orderId) navigate(`/programar-retiro/${orderId}`);
            }}
            className="bg-primary text-on-primary font-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            Programar Retiro
            <span className="material-symbols-outlined text-sm">local_shipping</span>
          </button>
          
          <button 
            onClick={enviarPresupuestoWhatsapp}
            className="bg-[#25D366] text-white font-label-md px-8 py-4 rounded-xl hover:bg-[#20b858] transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            WhatsApp
            <span className="material-symbols-outlined text-sm">chat</span>
          </button>

          <button 
            onClick={() => window.location.reload()}
            className="bg-surface-container-highest text-on-surface font-label-md px-8 py-4 rounded-xl hover:bg-surface-variant transition-colors"
          >
            Nueva cotización
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Cotizador Inteligente</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Obtén un presupuesto preciso para tu dispositivo en segundos. Selecciona tu modelo y problema para comenzar.</p>
      </div>

      {/* Step 1: Brand Selection */}
      <section className="space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 rounded-full bg-primary text-on-primary flex items-center justify-center font-label-md text-label-md">1</div>
          <h3 className="font-headline-md text-headline-md text-on-surface">Selecciona tu marca</h3>
        </div>
        
        {isLoading ? (
          <div className="text-on-surface-variant flex items-center gap-2">
            <span className="material-symbols-outlined animate-spin">refresh</span>
            Cargando marcas...
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {marcas.map((marca) => {
              const isSelected = selectedMarca === marca;
              return (
                <div 
                  key={marca}
                  onClick={() => {
                    setSelectedMarca(marca);
                    setSelectedModelo(null);
                  }}
                  className={`rounded-[24px] p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary-container/10 border-2 border-primary scale-[1.02] shadow-sm' 
                      : 'bg-surface-container-low hover:bg-surface-container border-2 border-transparent'
                  }`}
                >
                  <span className={`material-symbols-outlined text-4xl ${isSelected ? 'text-primary icon-fill' : 'text-on-surface-variant'}`}>
                    smartphone
                  </span>
                  <span className={`font-label-md text-label-md text-center ${isSelected ? 'text-on-surface' : 'text-on-surface-variant'}`}>
                    {marca}
                  </span>
                </div>
              );
            })}
            {marcas.length === 0 && (
              <div className="col-span-full text-on-surface-variant text-sm">
                No hay modelos registrados en la base de datos.
              </div>
            )}
          </div>
        )}
      </section>

      {/* Step 1.5: Model Selection */}
      {selectedMarca && (
        <section className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center font-label-md text-label-md">
              <span className="material-symbols-outlined text-sm">subdirectory_arrow_right</span>
            </div>
            <h3 className="font-headline-md text-headline-md text-on-surface">Selecciona el modelo</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {modelosDeMarca.map((modelo) => {
              const isSelected = selectedModelo?.id === modelo.id;
              return (
                <div 
                  key={modelo.id}
                  onClick={() => setSelectedModelo(modelo)}
                  className={`rounded-[16px] p-4 flex items-center gap-3 cursor-pointer transition-all duration-200 ${
                    isSelected 
                      ? 'bg-primary border-2 border-primary text-on-primary shadow-md scale-[1.02]' 
                      : 'bg-surface-container-lowest border-2 border-outline-variant/20 hover:border-primary/50 hover:bg-surface-container-low text-on-surface'
                  }`}
                >
                  <div className="flex-grow">
                    <div className="font-label-md font-bold">{modelo.nombre_modelo}</div>
                    {modelo.serie && <div className={`text-sm ${isSelected ? 'text-on-primary/80' : 'text-on-surface-variant'}`}>{modelo.serie}</div>}
                  </div>
                  {isSelected && <span className="material-symbols-outlined text-on-primary">check_circle</span>}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Step 2: Issue Type */}
      <section className={`space-y-6 transition-opacity duration-300 ${!selectedModelo ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md transition-colors ${selectedModelo ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>2</div>
          <h3 className="font-headline-md text-headline-md text-on-surface">¿Qué necesita reparación?</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { id: 'pantalla', title: 'Reemplazo de Pantalla', desc: 'Cristal roto o problemas de visualización', icon: 'splitscreen' },
            { id: 'bateria', title: 'Reemplazo de Batería', desc: 'No retiene la carga', icon: 'battery_alert' },
            { id: 'camara', title: 'Reparación de Cámara', desc: 'Lentes borrosos o rotos', icon: 'photo_camera' },
            { id: 'agua', title: 'Daño por Agua', desc: 'Diagnóstico por exposición a líquidos', icon: 'water_drop' },
          ].map(issue => {
            const isSelected = selectedIssue === issue.id;
            return (
              <div 
                key={issue.id}
                onClick={() => setSelectedIssue(issue.id)}
                className={`rounded-[24px] p-6 flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.01] ${
                  isSelected ? 'bg-primary-container/10 border-2 border-primary' : 'bg-surface-container-low hover:bg-surface-container border-2 border-transparent'
                }`}
              >
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSelected ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                  <span className="material-symbols-outlined">{issue.icon}</span>
                </div>
                <div className="flex-grow">
                  <h4 className="font-label-md text-label-md text-on-surface">{issue.title}</h4>
                  <p className="font-body-md text-body-md text-on-surface-variant text-sm">{issue.desc}</p>
                </div>
                {isSelected && <span className="material-symbols-outlined text-primary">check_circle</span>}
              </div>
            );
          })}
        </div>
      </section>

      {/* Step 3: Email */}
      <section className={`space-y-6 transition-opacity duration-300 ${!selectedIssue ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md transition-colors ${selectedIssue ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>3</div>
          <h3 className="font-headline-md text-headline-md text-on-surface">Email de contacto</h3>
        </div>
        <div className="max-w-md">
          <input 
            type="email" 
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value.trim())}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Step 4: Phone */}
      <section className={`space-y-6 transition-opacity duration-300 ${!email ? 'opacity-50 pointer-events-none' : ''}`}>
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-label-md text-label-md transition-colors ${email ? 'bg-primary text-on-primary' : 'bg-surface-container-highest text-on-surface'}`}>4</div>
          <h3 className="font-headline-md text-headline-md text-on-surface">Teléfono de contacto</h3>
        </div>
        <div className="max-w-md">
          <input 
            type="tel" 
            placeholder="+1 234 567 8900"
            value={phone}
            onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
            className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
          />
        </div>
      </section>

      {/* Final Step: Generate Quote */}
      <section className={`mt-16 bg-surface-container rounded-[32px] p-8 md:p-12 flex flex-col items-center justify-center relative overflow-hidden transition-opacity duration-500 ${!isFormComplete ? 'opacity-30 pointer-events-none grayscale' : ''}`}>
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
        
        <div className="z-10 w-full max-w-sm flex flex-col items-center">
          <h3 className="font-headline-md text-headline-md text-on-surface mb-2">Obtener Presupuesto</h3>
          <p className="font-body-sm text-body-sm text-on-surface-variant text-center mb-6">Generaremos una cotización estimada y guardaremos tu solicitud.</p>
          
          <button 
            disabled={!isFormComplete || isSubmitting}
            onClick={handleSubmit}
            className="w-full bg-primary text-on-primary font-label-md text-label-md h-[56px] px-8 rounded-[16px] hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isSubmitting ? (
              <>
                <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                Calculando...
              </>
            ) : (
              <>
                COTIZAR
                <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">request_quote</span>
              </>
            )}
          </button>
        </div>
      </section>
    </main>
  );
}
