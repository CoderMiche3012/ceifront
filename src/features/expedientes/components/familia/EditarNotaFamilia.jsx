import { useState } from 'react';
import { X, Save, Loader2, User } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query'; // Importamos hooks
import ModalConfirmacion from '../../../../components/shared/ModalConfirmacion';
import ModalResultado from '../../../../components/shared/ModalResultado';
import Field from '../../../../components/ui/Field';
import { actualizarExpediente } from '../../services/expedientesService';

export default function EditarNotaFamilia({ isOpen, onClose, data }) {
    const queryClient = useQueryClient();
    const [showConfirm, setShowConfirm] = useState(false);
    const [formDataCache, setFormDataCache] = useState(null);
    const [resultado, setResultado] = useState({ open: false, type: 'success', title: '', message: '' });

    // Definimos la mutación
    const mutation = useMutation({
        mutationFn: async (payload) => {
            return await actualizarExpediente(data.id_expediente, payload);
        },
        onSuccess: () => {
            // Invalidamos las queries relacionadas para que los datos se refresquen
            queryClient.invalidateQueries(['beneficiarios']);
            queryClient.invalidateQueries(['expediente', data.id_expediente]);

            setResultado({
                open: true,
                type: 'success',
                title: '¡Actualización Exitosa!',
                message: 'La nota de situación familiar se ha actualizado correctamente.'
            });
            setShowConfirm(false);
        },
        onError: (error) => {
            setResultado({
                open: true,
                type: 'error',
                title: 'Error al actualizar',
                message: error.message || 'No se pudo conectar con el servidor.'
            });
            setShowConfirm(false);
        }
    });

    if (!isOpen) return null;

    const preSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const payload = Object.fromEntries(formData.entries());
        setFormDataCache(payload);
        setShowConfirm(true);
    };

    const handleFinalConfirm = () => {
        mutation.mutate(formDataCache);
    };

    const handleCloseSuccess = () => {
        setResultado(prev => ({ ...prev, open: false }));
        if (resultado.type === 'success') onClose();
    };

    return (
        <>
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 backdrop-blur-md p-4">
                <div className="bg-[#F8FAFC] rounded-[2rem] shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-300 border border-white">
                    
                    {/* Header */}
                    <div className="flex items-center justify-between p-8 bg-white border-b border-slate-100">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-[#0E5F63]/10 rounded-2xl">
                                <User className="w-6 h-6 text-[#0E5F63]" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-slate-800 tracking-tight">Situación Familiar</h2>
                                <p className="text-sm text-slate-500 font-medium">Actualiza las observaciones del beneficiario</p>
                            </div>
                        </div>
                        <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all active:scale-90">
                            <X className="w-6 h-6 text-slate-400" />
                        </button>
                    </div>

                    <form onSubmit={preSubmit} className="p-8">
                        <div className="space-y-6">
                            <Field label="Nota de situación familiar">
                                <textarea
                                    name="nota_situacion_familiar"
                                    defaultValue={data.nota_situacion_familiar || ''} 
                                    placeholder="Escribe una observación detallada..."
                                    rows={6}
                                    className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#0E5F63] resize-none transition-all"
                                />
                            </Field>
                        </div>

                        <div className="flex justify-end gap-4 mt-12">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-8 py-3.5 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-2xl transition-all"
                            >
                                Descartar
                            </button>
                            <button
                                type="submit"
                                disabled={mutation.isLoading}
                                className="flex items-center gap-3 px-10 py-3.5 bg-[#0E5F63] text-white text-sm font-bold rounded-2xl hover:bg-[#0A4D50] shadow-xl shadow-[#0E5F63]/20 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {mutation.isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                                Guardar Cambios
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <ModalConfirmacion
                open={showConfirm}
                title="¿Confirmar cambios?"
                description="Se actualizará la nota en el expediente del beneficiario."
                onConfirm={handleFinalConfirm}
                onClose={() => setShowConfirm(false)}
                loading={mutation.isLoading}
                color="teal"
            />

            <ModalResultado
                open={resultado.open}
                type={resultado.type}
                title={resultado.title}
                message={resultado.message}
                onClose={handleCloseSuccess}
            />
        </>
    );
}