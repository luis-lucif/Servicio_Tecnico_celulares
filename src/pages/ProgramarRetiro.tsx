import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function ProgramarRetiro() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);

  // Form states
  const [tipoRetiro, setTipoRetiro] = useState<'domicilio' | 'local' | null>(null);
  
  // Address states
  const [nombreCompleto, setNombreCompleto] = useState('');
  const [calle, setCalle] = useState('');
  const [altura, setAltura] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');

  // Photo states
  const [photo, setPhoto] = useState<File | null>(null);
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    async function fetchOrder() {
      if (!id) return;
      try {
        const { data, error } = await supabase
          .from('ordenes')
          .select('*')
          .eq('id', id)
          .single();
          
        if (error) throw error;
        
        if (data) {
          setOrder(data);
          setEmail(data.email || '');
          setTelefono(data.telefono || '');
        }
      } catch (err) {
        console.error('Error fetching order:', err);
        alert('No se pudo encontrar la cotización.');
        navigate('/cotizador');
      } finally {
        setIsLoading(false);
      }
    }
    fetchOrder();
  }, [id, navigate]);

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('imagenes_reparaciones')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('imagenes_reparaciones')
        .getPublicUrl(filePath);

      setFotoUrl(data.publicUrl);
      setPhoto(file);
      setPreviewUrl(URL.createObjectURL(file));
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Hubo un error al subir la imagen. Por favor, intenta de nuevo.');
      setPhoto(null);
      setFotoUrl(null);
      setPreviewUrl(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPhoto(null);
    setFotoUrl(null);
    setPreviewUrl(null);
  };

  const isAddressComplete = nombreCompleto && calle && altura && codigoPostal && email && telefono;

  const handleSubmitFinal = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('ordenes')
        .update({
          tipo_retiro: tipoRetiro,
          nombre_completo: nombreCompleto,
          calle: calle,
          altura: altura,
          codigo_postal: codigoPostal,
          email: email, // in case it was updated
          telefono: telefono, // in case it was updated
          foto_url: fotoUrl,
          estado: 'Pendiente de Retiro'
        })
        .eq('id', id);

      if (error) throw error;
      setSuccess(true);
    } catch (err) {
      console.error('Error updating order:', err);
      alert('Hubo un problema al coordinar el retiro.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-4 py-24 flex items-center justify-center">
        <span className="material-symbols-outlined animate-spin text-primary text-4xl">refresh</span>
      </main>
    );
  }

  if (success) {
    return (
      <main className="flex-grow w-full max-w-container-max mx-auto px-4 py-24 flex flex-col items-center justify-center text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
        <div className="w-24 h-24 rounded-full bg-primary-container text-primary flex items-center justify-center mb-4">
          <span className="material-symbols-outlined text-[48px]">local_shipping</span>
        </div>
        <h2 className="font-display-lg text-display-lg text-on-surface">¡Retiro Coordinado!</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-md">
          {tipoRetiro === 'domicilio' 
            ? 'Hemos registrado tus datos. Nuestro mensajero pasará por tu domicilio pronto.' 
            : 'Te esperamos en nuestro local. Recuerda llevar tu dispositivo.'}
        </p>
        <div className="bg-surface-container rounded-2xl p-6 mt-8 max-w-sm w-full text-left space-y-2">
          <p className="font-label-sm text-label-sm text-on-surface-variant uppercase">Resumen de tu orden</p>
          <p className="font-body-md text-body-md text-on-surface"><strong>ID de Orden:</strong> #{order.id}</p>
          <p className="font-body-md text-body-md text-on-surface"><strong>Dispositivo:</strong> {order.marca} {order.nombre_modelo}</p>
        </div>
        <button 
          onClick={() => navigate('/')}
          className="mt-8 bg-primary text-on-primary font-label-md px-8 py-4 rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          Volver al Inicio
        </button>
      </main>
    );
  }

  return (
    <main className="flex-grow w-full max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-12 md:py-24 space-y-12">
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h2 className="font-display-lg-mobile md:font-display-lg text-display-lg-mobile md:text-display-lg text-on-surface">Coordinar Entrega</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Completa los datos para proceder con la reparación de tu {order?.marca} {order?.nombre_modelo}.</p>
      </div>

      {step === 1 && (
        <section className="max-w-2xl mx-auto space-y-8 animate-in fade-in">
          <h3 className="font-headline-md text-headline-md text-on-surface text-center">¿Cómo nos entregas el equipo?</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div 
              onClick={() => setTipoRetiro('domicilio')}
              className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${tipoRetiro === 'domicilio' ? 'border-primary bg-primary-container/10 scale-[1.02]' : 'border-transparent bg-surface-container-low hover:bg-surface-container'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${tipoRetiro === 'domicilio' ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-3xl">two_wheeler</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Retiro a Domicilio</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Pasamos a buscarlo por tu casa u oficina.</p>
              </div>
            </div>

            <div 
              onClick={() => setTipoRetiro('local')}
              className={`p-6 rounded-[24px] border-2 cursor-pointer transition-all flex flex-col items-center text-center gap-4 ${tipoRetiro === 'local' ? 'border-primary bg-primary-container/10 scale-[1.02]' : 'border-transparent bg-surface-container-low hover:bg-surface-container'}`}
            >
              <div className={`w-16 h-16 rounded-full flex items-center justify-center ${tipoRetiro === 'local' ? 'bg-primary/20 text-primary' : 'bg-surface-variant text-on-surface-variant'}`}>
                <span className="material-symbols-outlined text-3xl">storefront</span>
              </div>
              <div>
                <h4 className="font-headline-sm text-headline-sm text-on-surface">Entregar en Local</h4>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-2">Lo traes personalmente a nuestra sucursal.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <button
              disabled={!tipoRetiro}
              onClick={() => setStep(2)}
              className="bg-primary text-on-primary font-label-md px-12 py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Siguiente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {step === 2 && tipoRetiro === 'domicilio' && (
        <section className="max-w-2xl mx-auto space-y-8 animate-in slide-in-from-right-8">
          <div className="flex items-center gap-4 mb-8">
            <button onClick={() => setStep(1)} className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface">Datos de Domicilio</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Nombre Completo</label>
              <input 
                type="text" 
                value={nombreCompleto} onChange={(e) => setNombreCompleto(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Calle</label>
              <input 
                type="text" 
                value={calle} onChange={(e) => setCalle(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>
            
            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Altura / Número</label>
              <input 
                type="text" 
                value={altura} onChange={(e) => setAltura(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Código Postal</label>
              <input 
                type="text" 
                value={codigoPostal} onChange={(e) => setCodigoPostal(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Email</label>
              <input 
                type="email" 
                value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>

            <div className="space-y-2">
              <label className="font-label-sm text-label-sm text-on-surface-variant">Teléfono</label>
              <input 
                type="tel" 
                value={telefono} onChange={(e) => setTelefono(e.target.value.replace(/[^\d+]/g, ''))}
                className="w-full bg-surface-container-lowest border border-outline-variant/50 rounded-xl px-4 py-3 text-on-surface focus:border-primary outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end mt-8">
            <button
              disabled={!isAddressComplete}
              onClick={() => setStep(3)}
              className="bg-primary text-on-primary font-label-md px-12 py-4 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              Siguiente
              <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </section>
      )}

      {/* Step 3 (or Step 2 if Local): Final Summary & Photo Upload */}
      {((step === 3 && tipoRetiro === 'domicilio') || (step === 2 && tipoRetiro === 'local')) && (
        <section className="max-w-2xl mx-auto space-y-10 animate-in slide-in-from-right-8">
          <div className="flex items-center gap-4">
            <button onClick={() => setStep(tipoRetiro === 'local' ? 1 : 2)} className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-on-surface">arrow_back</span>
            </button>
            <h3 className="font-headline-md text-headline-md text-on-surface">Resumen y Detalles</h3>
          </div>

          <div className="bg-surface-container-low p-6 rounded-2xl border border-outline-variant/30 flex items-center gap-6">
             <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <span className="material-symbols-outlined text-3xl">smartphone</span>
             </div>
             <div>
               <p className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Tu Dispositivo</p>
               <p className="font-headline-sm text-headline-sm text-on-surface">{order?.marca} {order?.nombre_modelo}</p>
               <p className="font-body-md text-body-md text-on-surface-variant mt-1 capitalize">Problema: {order?.problema}</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-baseline gap-2">
              <h4 className="font-headline-sm text-headline-sm text-on-surface">Foto del problema</h4>
              <span className="font-label-sm text-label-sm text-on-surface-variant">(Opcional pero recomendado)</span>
            </div>
            
            <label className={`flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl transition-all ${isUploading ? 'bg-surface-container-highest border-outline-variant/30 cursor-wait' : 'border-outline-variant/50 cursor-pointer bg-surface-container-lowest hover:bg-surface-container-low hover:border-primary/50'}`}>
              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                {isUploading ? (
                  <>
                    <span className="material-symbols-outlined text-primary animate-spin mb-2 text-3xl">refresh</span>
                    <p className="font-body-sm text-primary">Subiendo imagen...</p>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-outline-variant mb-2 text-3xl">cloud_upload</span>
                    <p className="mb-1 font-body-sm text-body-sm text-on-surface-variant">
                      <span className="font-bold text-primary">Haz clic para subir</span> o arrastra
                    </p>
                    <p className="font-label-sm text-label-sm text-outline">JPG, PNG, GIF</p>
                  </>
                )}
              </div>
              <input 
                type="file" 
                className="hidden" 
                accept=".jpg,.jpeg,.png,.gif,.webp,.svg"
                disabled={isUploading}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
                    if (!validTypes.includes(file.type)) {
                      alert('Por favor sube solo archivos de imagen (JPG, PNG, GIF, WEBP, SVG).');
                      e.target.value = '';
                      return;
                    }
                    handleFileUpload(file);
                  }
                }}
              />
            </label>
            
            {photo && !isUploading && (
              <div className="mt-4 flex flex-col p-3 bg-primary-container/10 border border-primary/20 rounded-lg animate-in fade-in gap-3">
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <span className="material-symbols-outlined text-primary text-sm">image</span>
                    <span className="text-sm text-on-surface truncate max-w-[200px] font-medium">{photo.name}</span>
                    <span className="material-symbols-outlined text-[#16a34a] text-sm ml-2">check_circle</span>
                  </div>
                  <button 
                    onClick={handleRemovePhoto}
                    className="text-error hover:bg-error/10 p-1 rounded-full transition-colors flex items-center justify-center"
                    title="Quitar imagen"
                  >
                    <span className="material-symbols-outlined text-sm">close</span>
                  </button>
                </div>
                {previewUrl && (
                  <div className="w-full h-48 rounded-lg overflow-hidden border border-outline-variant/30">
                    <img src={previewUrl} alt="Vista previa" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-8 border-t border-outline-variant/20">
            <button
              disabled={isSubmitting || isUploading}
              onClick={handleSubmitFinal}
              className="w-full bg-primary text-on-primary font-label-md text-label-md h-[56px] rounded-[16px] hover:bg-primary-container hover:text-on-primary-container transition-colors flex items-center justify-center gap-2 shadow-md disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isSubmitting ? (
                <>
                  <span className="material-symbols-outlined animate-spin text-sm">refresh</span>
                  Guardando...
                </>
              ) : (
                <>
                  Confirmar Retiro
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">check_circle</span>
                </>
              )}
            </button>
          </div>
        </section>
      )}

    </main>
  );
}
