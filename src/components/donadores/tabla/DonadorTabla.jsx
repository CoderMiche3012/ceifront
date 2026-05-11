import { NavLink } from "react-router-dom";
import DatosTabla from "../../tablas/DatosTabla";
import AvatarGeneral from "../../shared/AvatarGeneral";
import { Calendar, Clock, Eye, Printer, Check, X, Lock, Pencil } from "lucide-react";
import EditarDatosGenerales from "../modales/EditarDatosGenerales";



const COLUMNS = [
    { key: "donadores", label: "donadores" },
    { key: "tipo", label: "tipo" },
    { key: "contacto", label: "contacto" },
    { key: "asignados", label: "Niños Asignados" },
    { key: "donaciones", label: "Donaciones (Periodo Activo)" },

    { key: "estatus", label: "Estatus" },
    { key: "acciones", label: "Acciones" },
];
export default function DonadoresTabla({ donadores = [], onRefresh, onEditar }) {

    const renderCell = (item, key) => {
        const donador = item || {};
        //posicionamiento de las acciones
        switch (key) {
            case "donadores":
                return (
                    <div className="flex items-center gap-3">
                        <AvatarGeneral nombre={donador.nombre || " "} apellidoP={donador.apellido_p || " "} />
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800 uppercase leading-none">
                                {`${donador.nombre || ""} ${donador.apellido_p || ""} ${donador.apellido_m || ""}`}
                            </span>
                        </div>
                    </div>
                );
            case "estatus": {
                const estatus = donador.estatus?.toLowerCase();
                const configEstatus = {
                    activo: "bg-amber-100 text-amber-700 border-amber-200",
                    inactivo: "bg-blue-100 text-blue-700 border-blue-200",
                    pausa: "bg-emerald-100 text-emerald-700 border-emerald-200",
                };
                const estilo = configEstatus[estatus] || "bg-slate-100 text-slate-600 border-slate-200";
                return (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
                        {donador.estatus}
                    </span>
                );
            }
            case "tipo":
                return (
                    <div className="flex flex-col leading-tight">
                        <span className="text-sm font-medium text-slate-800">
                            {donador.tipo}
                        </span>
                    </div>
                );
            case "contacto":
                return (
                    <div className="flex items-center gap-3">
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold text-slate-800 leading-none">
                                {donador.correo || ""}
                            </span>

                            <span className="text-xs text-slate-500 mt-1">
                                {donador.telefono || ""}
                            </span>
                        </div>
                    </div>
                );
            case "asignados": {
                const cantidad = donador.beneficiarios_apoyados?.length || 0;

                return (
                    <span className="text-sm font-semibold text-slate-700">
                        {cantidad} niños
                    </span>
                );
            }
            case "donador": {
                const estatus = donador.estado_visita?.toLowerCase();
                return (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
                        {"Sin donador"}
                    </span>
                );
            }
            case "donaciones": {
                const totales = donador.totalesPeriodoActivo || {};

                const monedas = Object.entries(totales);

                if (monedas.length === 0) {
                    return (
                        <span className="text-xs text-slate-400">
                            Sin donaciones
                        </span>
                    );
                }

                return (
                    <div className="flex flex-col gap-1">
                        {monedas.map(([moneda, monto]) => (
                            <span
                                key={moneda}
                                className="text-sm font-semibold text-slate-700"
                            >
                                {moneda}: ${Number(monto).toLocaleString("es-MX")}
                            </span>
                        ))}
                    </div>
                );
            }
            case "acciones":
                return (
                    <div className="flex items-center gap-2">
                        {/* VER */}
                        <NavLink
                            to={`/App/donadores/donador/${donador.id_donador}`}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-blue-600 transition-all"
                            title="Ver donador"
                        >
                            <Eye size={18} />
                        </NavLink>

                        {/* EDITAR */}
                        <button
                            onClick={() => onEditar(donador)}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-all"
                            title="Editar donador"
                        >
                            <Pencil size={18} />
                        </button>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <DatosTabla
            columns={COLUMNS}
            data={donadores}
            renderCell={renderCell}
            rowKey="id_donador"
        />
    );
}