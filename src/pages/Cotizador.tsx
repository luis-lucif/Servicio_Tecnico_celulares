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
  
  // Wizard state
  const [currentStep, setCurrentStep] = useState(1);

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
          // Cambiamos el nombre de algunos modelos si es necesario para que coincidan con las imágenes
          const updatedData = data.map(m => {
            if (m.nombre_modelo === 'iPhone 13') {
              return { ...m, nombre_modelo: 'iPhone 13 Pro Max' };
            }
            // Si solo tienen Galaxy S24, lo renombramos a Ultra para que puedas probarlo
            if (m.nombre_modelo === 'Galaxy S24' || m.nombre_modelo === 'S24') {
              return { ...m, nombre_modelo: 'Galaxy S24 Ultra' };
            }
            return m;
          });
          
          setModelos(updatedData);
          const uniqueMarcas = Array.from(new Set(updatedData.map((m) => m.marca)));
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
    const numeroWhatsApp = import.meta.env.VITE_WHATSAPP_NUMBER;
    
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

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleMarcaSelect = (marca: string) => {
    setSelectedMarca(marca);
    setSelectedModelo(null);
    setTimeout(nextStep, 300);
  };

  const handleModeloSelect = (modelo: ModeloDispositivo) => {
    setSelectedModelo(modelo);
    setTimeout(nextStep, 300);
  };

  const handleIssueSelect = (issueId: string) => {
    setSelectedIssue(issueId);
    setTimeout(nextStep, 300);
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

  const stepTitles = [
    "Selecciona tu marca",
    "Selecciona el modelo",
    "¿Qué necesita reparación?",
    "Datos de contacto"
  ];

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 flex flex-col items-center">
      {/* Header & Progress Indicator */}
      <div className="w-full max-w-3xl mb-12 space-y-6">
        <div className="text-center space-y-4">
          <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Cotizador Inteligente</h2>
          <p className="font-body-lg text-body-lg text-on-surface-variant">Paso {currentStep} de 4: {stepTitles[currentStep - 1]}</p>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-surface-variant rounded-full h-2 overflow-hidden flex">
          <div 
            className="bg-primary h-full transition-all duration-500 ease-out" 
            style={{ width: `${(currentStep / 4) * 100}%` }}
          />
        </div>
      </div>

      <div className="w-full max-w-3xl bg-surface-container-low border border-outline-variant/30 rounded-[32px] p-8 min-h-[400px] flex flex-col relative overflow-hidden shadow-sm animate-in fade-in duration-500">
        
        {/* Navigation - Back Button */}
        {currentStep > 1 && (
          <button 
            onClick={prevStep}
            className="absolute top-6 left-6 text-on-surface-variant hover:text-primary transition-colors flex items-center gap-1 font-label-md text-sm z-10"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Atrás
          </button>
        )}

        <div className="flex-grow pt-8 pb-4">
          {/* Step 1: Brand Selection */}
          {currentStep === 1 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              {isLoading ? (
                <div className="text-on-surface-variant flex items-center justify-center gap-2 h-32">
                  <span className="material-symbols-outlined animate-spin">refresh</span>
                  Cargando marcas...
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {marcas.map((marca) => {
                    const isSelected = selectedMarca === marca;
                    
                    // Mapeo simple de marca a archivo de imagen
                    const getMarcaImage = (m: string) => {
                      const lower = m.toLowerCase();
                      if (lower.includes('apple') || lower.includes('iphone')) return '/iphone.webp';
                      if (lower.includes('samsung')) return '/samsung.webp';
                      if (lower.includes('motorola')) return '/motorola.webp';
                      if (lower.includes('redmi') || lower.includes('xiaomi')) return '/redmi.webp';
                      return null;
                    };
                    
                    const imgSrc = getMarcaImage(marca);

                    return (
                      <div 
                        key={marca}
                        onClick={() => handleMarcaSelect(marca)}
                        className={`rounded-[24px] p-6 flex flex-col items-center justify-center gap-4 cursor-pointer transition-all duration-200 ${
                          isSelected 
                            ? 'bg-primary-container/20 border-2 border-primary scale-[1.02] shadow-sm' 
                            : 'bg-surface-container hover:bg-surface-container-high border-2 border-transparent'
                        }`}
                      >
                        {imgSrc ? (
                          <div className={`w-24 h-24 flex items-center justify-center transition-transform ${isSelected ? 'scale-110' : ''}`}>
                            <img src={imgSrc} alt={marca} className="max-w-full max-h-full object-cover rounded-2xl drop-shadow-sm" />
                          </div>
                        ) : (
                          <span className={`material-symbols-outlined text-5xl ${isSelected ? 'text-primary icon-fill' : 'text-on-surface-variant'}`}>
                            smartphone
                          </span>
                        )}
                        <span className={`font-label-md text-label-md text-center ${isSelected ? 'text-primary font-bold' : 'text-on-surface-variant'}`}>
                          {marca}
                        </span>
                      </div>
                    );
                  })}
                  {marcas.length === 0 && (
                    <div className="col-span-full text-on-surface-variant text-center">
                      No hay modelos registrados en la base de datos.
                    </div>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Step 2: Model Selection */}
          {currentStep === 2 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {modelosDeMarca.map((modelo) => {
                  const isSelected = selectedModelo?.id === modelo.id;
                  
                  // Lógica para asignar imagen específica por modelo
                  const getModeloImg = (nombre: string) => {
                    const lower = nombre.toLowerCase();
                    if (lower.includes('13') && lower.includes('pro') && lower.includes('max')) {
                      return '/iphone13_pro_max.webp';
                    }
                    if (lower.includes('s24') && lower.includes('ultra')) {
                      return '/galaxy_s24_ultra.webp';
                    }
                    return null; // Sin imagen específica, usará el ícono por defecto
                  };
                  
                  const modeloImg = getModeloImg(modelo.nombre_modelo);
                  
                  return (
                    <div 
                      key={modelo.id}
                      onClick={() => handleModeloSelect(modelo)}
                      className={`rounded-[20px] p-4 flex flex-col items-center text-center gap-3 cursor-pointer transition-all duration-200 ${
                        isSelected 
                          ? 'bg-primary-container/20 border-2 border-primary shadow-md scale-[1.02]' 
                          : 'bg-surface-container border-2 border-transparent hover:border-primary/50 hover:bg-surface-container-high'
                      }`}
                    >
                      {modeloImg ? (
                        <div className="w-20 h-24 flex items-center justify-center">
                          <img src={modeloImg} alt={modelo.nombre_modelo} className="max-w-full max-h-full object-contain drop-shadow-sm transition-transform hover:scale-105" />
                        </div>
                      ) : (
                        <div className="w-20 h-24 flex items-center justify-center bg-surface-container-highest/50 rounded-2xl">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant/50">smartphone</span>
                        </div>
                      )}
                      
                      <div className="flex-grow flex flex-col justify-end w-full">
                        <div className={`font-label-md text-sm md:text-base font-bold leading-tight ${isSelected ? 'text-primary' : 'text-on-surface'}`}>
                          {modelo.nombre_modelo}
                        </div>
                        {modelo.serie && (
                          <div className={`text-xs mt-1 ${isSelected ? 'text-primary/80' : 'text-on-surface-variant'}`}>
                            {modelo.serie}
                          </div>
                        )}
                      </div>
                      
                      {/* Check icon top right if selected */}
                      {isSelected && (
                        <div className="absolute top-3 right-3 text-primary bg-surface rounded-full">
                          <span className="material-symbols-outlined text-xl">check_circle</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Step 3: Issue Type */}
          {currentStep === 3 && (
            <section className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'pantalla', title: 'Reemplazo de Pantalla', desc: 'Cristal roto o visualización', icon: 'splitscreen' },
                  { id: 'bateria', title: 'Reemplazo de Batería', desc: 'No retiene la carga', icon: 'battery_alert' },
                  { id: 'camara', title: 'Reparación de Cámara', desc: 'Lentes borrosos o rotos', icon: 'photo_camera' },
                  { id: 'agua', title: 'Daño por Agua', desc: 'Exposición a líquidos', icon: 'water_drop' },
                ].map(issue => {
                  const isSelected = selectedIssue === issue.id;
                  return (
                    <div 
                      key={issue.id}
                      onClick={() => handleIssueSelect(issue.id)}
                      className={`rounded-[24px] p-6 flex items-center gap-4 cursor-pointer transition-transform hover:scale-[1.01] ${
                        isSelected ? 'bg-primary-container/10 border-2 border-primary' : 'bg-surface-container hover:bg-surface-container-high border-2 border-transparent'
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
          )}

          {/* Step 4: Contact Info & Submit */}
          {currentStep === 4 && (
            <section className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-300 flex flex-col items-center max-w-md mx-auto w-full">
              
              <div className="w-full space-y-4">
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface">Email de contacto</label>
                  <input 
                    type="email" 
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value.trim())}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                </div>
                
                <div className="space-y-2">
                  <label className="font-label-md text-on-surface">Teléfono de contacto</label>
                  <input 
                    type="tel" 
                    placeholder="11 2345 6789"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/[^\d+]/g, ''))}
                    className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface placeholder:text-outline focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all shadow-sm"
                  />
                </div>
              </div>

              <div className="w-full bg-surface-container rounded-[24px] p-6 flex flex-col items-center justify-center relative overflow-hidden mt-6">
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
                      COTIZAR AHORA
                      <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">request_quote</span>
                    </>
                  )}
                </button>
              </div>

            </section>
          )}

        </div>
      </div>
    </main>
  );
}

