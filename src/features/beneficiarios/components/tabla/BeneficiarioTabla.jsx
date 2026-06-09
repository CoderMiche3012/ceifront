import { NavLink } from "react-router-dom";
import DatosTabla from "../../../../components/tablas/DatosTabla";
import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import { Eye, PencilLine } from "lucide-react";
import EditarDatosGenerales from "../modales/EditarDatosGenerales";
import { useState } from "react";

const COLUMNS = [
    { key: "beneficiarios", label: "beneficiarios" },
    { key: "estatus", label: "Estatus" },
    { key: "promedio", label: "Promedio" },
    { key: "donador", label: "Donador" },
    { key: "escuela", label: "Escuela/grado" },
    { key: "acciones", label: "Acciones" },
];
export default function beneficiariosTabla({ beneficiarios = [], periodo }) {
    const [openEdit, setOpenEdit] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return "--";
        const hoy = new Date();
        const cumple = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    };
    const renderCell = (item, key) => {
        const expediente = item.expediente || {};
        //posicionamiento de las acciones
        const totalRegistros = beneficiarios.length;
        const indiceActual = beneficiarios.indexOf(item);
        const abrirHaciaArriba = indiceActual >= totalRegistros - 2 && totalRegistros > 1;
        switch (key) {
            case "beneficiarios":
                return (
                    <div className="flex items-center gap-3">
                        <AvatarGeneral
                            nombre={expediente.nombre_completo}
                        />

                        <div className="flex flex-col min-w-0">
                            <span className="text-sm font-semibold text-slate-800 uppercase truncate">
                                {expediente.nombre_completo || "--"}
                            </span>

                            <span className="text-xs text-slate-500">
                                {calcularEdad(expediente.fecha_nacimiento)} años
                            </span>
                        </div>
                    </div>
                );
            case "estatus": {
                const estatus = item.estatus?.toLowerCase();

                const configEstatus = {
                    activo: "bg-amber-100 text-amber-700 border-amber-200",
                    inactivo: "bg-blue-100 text-blue-700 border-blue-200",
                    graduado: "bg-rose-100 text-rose-700 border-rose-200",
                    pausa: "bg-emerald-100 text-emerald-700 border-emerald-200",
                };

                const estilo =
                    configEstatus[estatus] ||
                    "bg-slate-100 text-slate-600 border-slate-200";

                return (
                    <div className="flex flex-col gap-1">
                        <span
                            className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}
                        >
                            {item.estatus}
                        </span>

                        {periodo === "actual" && (
                            <span className="text-[11px] text-slate-500 font-medium">
                                {item.cicloEscolar}
                            </span>
                        )}
                    </div>
                );
            }
            case "promedio": {
                const promedio = Number(item.promedio);
                let color = "text-slate-500";

                if (!isNaN(promedio)) {
                    if (promedio < 6) color = "text-red-600";
                    else if (promedio < 8) color = "text-yellow-600";
                    else color = "text-green-600";
                }

                return (
                    <span className={`text-sm font-bold ${color}`}>
                        {item.promedio ?? "—"}
                    </span>
                );
            }
            case "donador": {
                const tieneDonador = item.tieneDonador;

                const estilo = tieneDonador
                    ? "bg-blue-100 text-blue-700 border-blue-200"
                    : "bg-amber-100 text-amber-700 border-amber-200";

                return (
                    <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}
                    >
                        {tieneDonador ? "Con donador" : "Sin donador"}
                    </span>
                );
            }
            case "escuela":
                return (
                    <span className="text-sm font-medium text-slate-700">
                        {item.nivelGrado}
                    </span>
                );
            case "acciones":
                return (
                    <div className="flex items-center gap-1">

                        {/* VER */}
                        <NavLink
                            to={`/App/beneficiarios/expediente/${item.id_beneficiario}`}
                            className={({ isActive }) => `
                    inline-flex h-8 w-8 items-center justify-center rounded-full transition-all
                    ${isActive ? "bg-blue-100 text-blue-600" : "text-slate-400 hover:bg-slate-100 hover:text-blue-600"}
                `}
                            title="Ver Expediente"
                        >
                            <Eye size={18} />
                        </NavLink>

                        {/* EDITAR */}
                        <button
                            onClick={() => {
                                setSelectedItem(item); setSelectedItem({
                                    ...item.expediente,
                                    id_beneficiario: item.id_beneficiario,
                                });
                                setOpenEdit(true);
                            }}
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-slate-400 hover:bg-slate-100 hover:text-emerald-600 transition-all"
                            title="Editar"
                        >
                            <PencilLine size={18} />
                        </button>

                        {/* MODAL */}
                        <EditarDatosGenerales
                            isOpen={openEdit}
                            onClose={() => setOpenEdit(false)}
                            data={selectedItem}
                        />
                    </div>
                );
            default: return null;
        }
    };

    return (
        <DatosTabla
            columns={COLUMNS}
            data={beneficiarios}
            renderCell={renderCell}
            rowKey="id_beneficiario"
        />
    );
}