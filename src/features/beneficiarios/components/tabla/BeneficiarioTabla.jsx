import { NavLink, useNavigate } from "react-router-dom";
import DatosTabla from "../../../../components/tablas/DatosTabla";
import AvatarGeneral from "../../../../components/shared/AvatarGeneral";
import { 
    Eye, 
    MoreVertical, 
    User, 
    GraduationCap, 
    HeartHandshake, 
    Camera, 
    Folder, 
    FileText, 
    Coins, 
    Utensils, 
    Users 
} from "lucide-react"; 
import { useState } from "react";

const COLUMNS = [
    { key: "beneficiarios", label: "beneficiarios" },
    { key: "estatus", label: "Estatus" },
    { key: "promedio", label: "Promedio" },
    { key: "donador", label: "Donador" },
    { key: "escuela", label: "Escuela/grado" },
    { key: "acciones", label: "Acciones" },
];

export default function BeneficiarioTabla({ beneficiarios = [], periodo }) {
    const navigate = useNavigate();
    
    // 🔴 Añadimos la bandera 'haciaArriba' para controlar la dirección
    const [menuData, setMenuData] = useState({ id: null, top: 0, right: 0, haciaArriba: false });

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

    // 🔴 Detecta el espacio disponible abajo antes de pintar el menú
    const handleToggleMenu = (e, id) => {
        if (menuData.id === id) {
            setMenuData({ id: null, top: 0, right: 0, haciaArriba: false });
        } else {
            const rect = e.currentTarget.getBoundingClientRect();
            const alturaMenu = 380; // La propiedad max-h-[380px] de tu menú
            
            // Calculamos el espacio que queda desde la base del botón hasta el final de la ventana visible
            const espacioDisponibleAbajo = window.innerHeight - rect.bottom;
            const abrirHaciaArriba = espacioDisponibleAbajo < alturaMenu;

            setMenuData({
                id: id,
                // Si va hacia arriba, se alinea con el 'top' del botón, si va hacia abajo con el 'bottom'
                top: abrirHaciaArriba ? rect.top + window.scrollY : rect.bottom + window.scrollY,
                right: window.innerWidth - rect.right,
                haciaArriba: abrirHaciaArriba
            });
        }
    };

    const irASeccion = (idBeneficiario, tabName) => {
        setMenuData({ id: null, top: 0, right: 0, haciaArriba: false });
        navigate(`/App/beneficiarios/expediente/${idBeneficiario}?tab=${tabName}`);
    };

    const renderCell = (item, key) => {
        const expediente = item.expediente || {};

        switch (key) {
            case "beneficiarios":
                return (
                    <div className="flex items-center gap-3">
                        <AvatarGeneral nombre={expediente.nombre_completo} />
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
                const estatus = item.estatusSeguimiento?.toLowerCase();
                const configEstatus = {
                    activo: "bg-amber-100 text-amber-700 border-amber-200",
                    inactivo: "bg-slate-100 text-slate-600 border-slate-200",
                    baja: "bg-rose-100 text-rose-700 border-rose-200",
                    pausa: "bg-emerald-100 text-emerald-700 border-emerald-200",
                };
                const estilo = configEstatus[estatus] || "bg-slate-100 text-slate-600 border-slate-200";

                return (
                    <div className="flex flex-col gap-0.5">
                        <span className={`inline-flex w-fit items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
                            {item.estatusSeguimiento}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium pl-1">
                            {item.cicloEscolar}
                        </span>
                    </div>
                );
            }

            case "promedio": {
                const promedio = Number(item.promedio);
                let color = "text-slate-500";
                if (!isNaN(promedio) && item.promedio !== null) {
                    if (promedio < 7.5) color = "text-red-600";
                    else if (promedio < 8) color = "text-amber-600";
                    else color = "text-emerald-600";
                }
                return <span className={`text-sm font-bold ${color}`}>{item.promedio ?? "—"}</span>;
            }

            case "donador": {
                const tieneDonador = item.tieneDonador;
                const estilo = tieneDonador ? "bg-blue-100 text-blue-700 border-blue-200" : "bg-amber-100 text-amber-700 border-amber-200";
                return (
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase ${estilo}`}>
                        {tieneDonador ? "Con donador" : "Sin donador"}
                    </span>
                );
            }

            case "escuela":
                return <span className="text-sm font-medium text-slate-700 uppercase">{item.nivelGrado}</span>;

            case "acciones":
                return (
                    <div className="flex items-center gap-1">
                        {/* VER EXPEDIENTE GENERAL */}
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

                        {/* TRES PUNTOS */}
                        <div className="relative flex items-center justify-center">
                            <button
                                onClick={(e) => handleToggleMenu(e, item.id_beneficiario)}
                                className={`
                                    inline-flex h-8 w-8 items-center justify-center rounded-full transition-all
                                    ${menuData.id === item.id_beneficiario ? "bg-slate-100 text-teal-600" : "text-slate-400 hover:bg-slate-100 hover:text-teal-600"}
                                `}
                                title="Accesos directos"
                            >
                                <MoreVertical size={18} />
                            </button>

                            {menuData.id === item.id_beneficiario && (
                                <>
                                    {/* Backdrop para cerrar con un clic fuera */}
                                    <div className="fixed inset-0 z-[90]" onClick={() => setMenuData({ id: null, top: 0, right: 0, haciaArriba: false })} />
                                    
                                    {/* Usamos transform translate-y para empujar el menú hacia arriba si no cabe abajo */}
                                    <div 
                                        style={{ 
                                            position: 'fixed',
                                            top: `${menuData.top}px`, 
                                            right: `${menuData.right}px`,
                                            transform: menuData.haciaArriba ? 'translateY(-100%) translateY(-4px)' : 'translateY(4px)'
                                        }}
                                        className="w-60 max-h-[380px] overflow-y-auto bg-white border border-slate-200 rounded-xl shadow-xl py-1.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 custom-scroll"
                                    >
                                        {/* SECCIÓN 1: DATOS ESTRUCTURALES */}
                                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Información Base
                                        </div>
                                       
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "familia")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Users size={14} className="text-teal-600" />
                                            Familia
                                        </button>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "estudio")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <FileText size={14} className="text-teal-600" />
                                            Estudio Socioeconómico
                                        </button>

                                        <hr className="my-1 border-slate-100" />

                                        {/* SECCIÓN 2: SEGUIMIENTO PERMANENTE */}
                                        <div className="px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                                            Seguimiento
                                        </div>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "escuela")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <GraduationCap size={14} className="text-teal-600" />
                                            Escuela
                                        </button>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "obligaciones")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <HeartHandshake size={14} className="text-teal-600" />
                                            Obligaciones
                                        </button>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "fotografias")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Camera size={14} className="text-teal-600" />
                                            Fotografías
                                        </button>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "documentos")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Folder size={14} className="text-teal-600" />
                                            Documentos
                                        </button>

                                        
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "apoyos")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Coins size={14} className="text-teal-600" />
                                            Reembolsos
                                        </button>
                                        <button
                                            onClick={() => irASeccion(item.id_beneficiario, "asistencias")}
                                            className="w-full flex items-center gap-2 px-4 py-2 text-left text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                                        >
                                            <Utensils size={14} className="text-teal-600" />
                                            Comedor y psicología
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                );

            default:
                return null;
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