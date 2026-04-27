import { useEffect, useMemo, useState } from "react";
import { Folder, Plus, ChevronDown, X, DollarSign, Calendar, Tag, Save } from "lucide-react";
import { obtenerDonativos, crearDonativo, actualizarDonativo, } from "../../../services/donativosService";
import { obtenerPeriodos } from "../../../services/periodoService";
import DonativoTabla from "../tabla/DonativoTabla";
import Boton from "../../../components/ui/BotonInterno";
import PaginacionTabla from "../../tablas/PaginacionTabla";
import FiltrosTabla from "../../tablas/FiltrosTabla";
import ModalResultado from "../../shared/ModalResultado";
import ModalConfirmacion from "../../shared/ModalConfirmacion";
import useHistorialDonativos from "../../../hooks/donadores/useHistorialDonativos";
import Alerta from "../../ui/AlertaError";

const PAGE_SIZE = 2;
export default function HistorialDonativos({ data }) {
    const {
        donativos,
        periodosOrdenados,
        modalConf,
        modalRes,
        loading,
        openId,
        pages,
        searchByPeriodo,
        showModal,
        showModalEditar,
        saving,
        form,
        setOpenId,
        setModalConf,
        setModalRes,
        setShowModalEditar,
        setForm,
        abrirModal,
        abrirModalEditar,
        cerrarModal: cerrarModalOriginal,
        handleSubmitClick,
        handleConfirmarGuardado,
        changePage,
        handleSearchChange,
        errorForm,setErrorForm
    } = useHistorialDonativos(data);
    const cerrarModal = () => { setErrorForm(""); cerrarModalOriginal(); };
    return (
        <div className="mt-2">
            <h3 className="text-sm font-bold text-slate-800 mb-4">
                Historial de Donativos
            </h3>
            <div className="space-y-4">
                {periodosOrdenados.map((periodo) => {
                    const search = searchByPeriodo[periodo.id_periodo] || "";
                    const baseItems = donativos.filter((d) => Number(d.id_periodo) === Number(periodo.id_periodo));
                    const items = baseItems.filter((d) => d.concepto?.toLowerCase().includes(search.toLowerCase()));
                    const total = items.reduce((sum, item) => sum + Number(item.monto || 0), 0);
                    const abierto = openId === periodo.id_periodo;
                    const currentPage = pages[periodo.id_periodo] || 1;
                    const totalPages = Math.ceil(items.length / PAGE_SIZE) || 1;
                    const inicio = (currentPage - 1) * PAGE_SIZE;
                    const dataPaginada = items.slice(inicio, inicio + PAGE_SIZE);
                    const hayRegistros = baseItems.length > 0;
                    return (
                        <div key={periodo.id_periodo} className="bg-white border border-slate-200 rounded-2xl shadow-sm" >
                            <button
                                onClick={() => setOpenId(abierto ? null : periodo.id_periodo)}
                                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                                        <Folder className="w-5 h-5" />
                                    </div>
                                    <p className="font-semibold text-slate-800">
                                        Ciclo Escolar {periodo.ciclo_escolar}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                                            Total del periodo
                                        </p>
                                        <p className="text-sm font-bold text-teal-600">
                                            ${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                        </p>
                                    </div>
                                    <ChevronDown
                                        className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${abierto ? "rotate-180" : ""
                                            }`}
                                    />
                                </div>
                            </button>

                            {abierto && (
                                <div className="border-t border-slate-100 p-5">
                                    <div className="flex justify-end mb-4">
                                        <Boton
                                            onClick={() => abrirModal(periodo)}
                                            icon={<Plus className="w-4 h-4" />}
                                        >
                                            Agregar Donativo
                                        </Boton>
                                    </div>

                                    {!hayRegistros ? (
                                        <div className="text-center py-8 text-slate-500">
                                            Sin registros
                                        </div>
                                    ) : (
                                        <>
                                            <div className="mb-4">
                                                <FiltrosTabla
                                                    searchValue={search}
                                                    onSearchChange={(value) =>
                                                        handleSearchChange(
                                                            periodo.id_periodo,
                                                            value
                                                        )
                                                    }
                                                    onClearFilters={() =>
                                                        handleSearchChange(periodo.id_periodo, "")
                                                    }
                                                    searchPlaceholder="Buscar por concepto..."
                                                />
                                            </div>

                                            <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
                                                <DonativoTabla
                                                    donativos={dataPaginada}
                                                    onEditar={(donativo) => abrirModalEditar(donativo)}
                                                />
                                            </div>

                                            <PaginacionTabla
                                                currentPage={currentPage}
                                                totalPages={totalPages}
                                                totalItems={items.length}
                                                pageSize={PAGE_SIZE}
                                                onPageChange={(page) =>
                                                    changePage(periodo.id_periodo, page)
                                                }
                                            />
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            {showModalEditar && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onKeyDown={(e) => e.key === 'Escape' && setShowModalEditar(false)}
                >
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={() => setShowModalEditar(false)}
                    />

                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50/50">
                            <h2 className="font-bold text-xl text-slate-800">Editar Donativo</h2>
                            <button
                                onClick={() => setShowModalEditar(false)}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <Alerta mensaje={errorForm} tipo="error" />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-slate-400" /> Concepto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Concepto del donativo"
                                    value={form.concepto}
                                    onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-400" /> Monto
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={form.monto}
                                        onChange={(e) => setForm({ ...form, monto: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" /> Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={form.fecha}
                                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600 transition-all"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
                            <button
                                onClick={() => setShowModalEditar(false)}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => handleSubmitClick('EDITAR')}
                                disabled={saving}
                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-teal-600/20 transition-all active:scale-95 flex items-center gap-2 ${saving ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Actualizando...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        Actualizar
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
                    onKeyDown={(e) => e.key === 'Escape' && cerrarModal()}
                >
                    <div
                        className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                        onClick={cerrarModal}
                    />

                    <div className="relative bg-white w-full max-w-md rounded-2xl shadow-2xl p-0 overflow-hidden transform transition-all animate-in zoom-in-95 duration-200">

                        <div className="flex justify-between items-center px-6 py-4 border-b bg-slate-50/50">
                            <h2 className="font-bold text-xl text-slate-800">Agregar Donativo</h2>
                            <button
                                onClick={cerrarModal}
                                className="p-2 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="p-6 space-y-5">
                            <Alerta mensaje={errorForm} tipo="error" />
                            <div className="space-y-1.5">
                                <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                    <Tag className="w-4 h-4 text-slate-400" /> Concepto
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ej. Colecta anual"
                                    value={form.concepto}
                                    onChange={(e) => setForm({ ...form, concepto: e.target.value })}
                                    className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <DollarSign className="w-4 h-4 text-slate-400" /> Monto
                                    </label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={form.monto}
                                        onChange={(e) => setForm({ ...form, monto: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                                    />
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                                        <Calendar className="w-4 h-4 text-slate-400" /> Fecha
                                    </label>
                                    <input
                                        type="date"
                                        value={form.fecha}
                                        onChange={(e) => setForm({ ...form, fecha: e.target.value })}
                                        className="w-full border border-slate-200 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-600 transition-all"
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="px-6 py-4 bg-slate-50 border-t flex justify-end gap-3">
                            <button
                                onClick={cerrarModal}
                                className="px-5 py-2.5 rounded-xl border border-slate-200 font-medium text-slate-600 hover:bg-white hover:border-slate-300 transition-all active:scale-95"
                            >
                                Cancelar
                            </button>

                            <button
                                onClick={() => handleSubmitClick('CREAR')}
                                disabled={saving}
                                className={`px-6 py-2.5 rounded-xl font-bold text-white shadow-lg shadow-teal-600/20 transition-all active:scale-95 flex items-center gap-2 ${saving ? "bg-teal-400 cursor-not-allowed" : "bg-teal-600 hover:bg-teal-700"
                                    }`}
                            >
                                {saving ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Guardando...
                                    </>
                                ) : "Guardar Donativo"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <ModalConfirmacion
                open={modalConf.open}
                title="¿Confirmar registro?"
                description="Estás a punto de guardar la información del donativo. ¿Deseas continuar?"
                onConfirm={handleConfirmarGuardado}
                onClose={() => setModalConf({ open: false, data: null })}
                loading={loading}
                color="teal"
            />
            <ModalResultado
                open={modalRes.open}
                type={modalRes.type}
                title={modalRes.title}
                message={modalRes.message}
                onClose={() => setModalRes({ ...modalRes, open: false })}
            />
        </div>
    );
}