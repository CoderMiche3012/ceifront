import { Plus, Check, X } from "lucide-react";
import Input from "../../../../../../components/ui/Input";
import Field from "../../../../../../components/ui/Field";

export default function EscuelaSelector({
    busqueda,
    setBusqueda,
    mostrarResultados,
    setMostrarResultados,
    crearModo,
    setCrearModo,
    nuevaEscuela,
    setNuevaEscuela,
    filtradas,
    seleccionarInstitucion,
    handleCrearEscuela,
    refEscuela,
    municipios = [],
    obtenerNombreMunicipio,

}) {
    return (
        <div ref={refEscuela} className="relative w-full">

            {/* Buscador */}
            <div className="flex gap-2">
                <Input
                    value={busqueda}
                    onChange={(e) => {
                        setBusqueda(e.target.value);
                        setMostrarResultados(true);
                    }}
                    onFocus={() => setMostrarResultados(true)}
                    placeholder="Buscar escuela..."
                    className="flex-1 border border-slate-300 rounded-xl focus:ring-2 focus:ring-[#0E5F63] focus:border-[#0E5F63]"
                />

                <button
                    onClick={() => setCrearModo(!crearModo)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg transition
                        ${crearModo
                            ? "text-white bg-[#0E5F63]"
                            : "text-[#0E5F63] hover:bg-gray-100"
                        }`}
                >
                    <Plus size={18} />
                </button>
            </div>

            {/* Resultados */}
            {mostrarResultados && busqueda && !crearModo && (
                <div className="absolute z-20 mt-2 w-full bg-white rounded-xl shadow-lg border border-slate-200 max-h-60 overflow-y-auto">
                    {filtradas.length > 0 ? (
                        filtradas.map((i) => (
                            <div
                                key={i.id_institucion}
                                onClick={() => seleccionarInstitucion(i)}
                                className="px-4 py-2 cursor-pointer transition hover:bg-[#0E5F63]/10 hover:text-[#0E5F63]"
                            >
                                <div className="font-medium">
                                    {i.nombre}
                                </div>

                                <div className="text-xs text-gray-400">
                                    {obtenerNombreMunicipio(i)}
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400">
                            Sin resultados
                        </div>
                    )}
                </div>
            )}

            {/* Crear escuela */}
            {crearModo && (
                <div className="mt-3 border border-gray-200 rounded-xl p-3 bg-white shadow-sm space-y-3">

                    <div className="text-xs font-medium text-gray-500">
                        Crear escuela
                    </div>

                    <div className="flex gap-2">

                        {/* Nombre escuela */}
                        <div className="flex-1 border border-gray-200 rounded-lg px-2 py-1.5 
                            focus-within:border-[#0E5F63] transition">

                            <Input
                                placeholder="Nombre de la escuela"
                                value={nuevaEscuela.nombre}
                                onChange={(e) =>
                                    setNuevaEscuela({
                                        ...nuevaEscuela,
                                        nombre: e.target.value,
                                    })
                                }
                                className="w-full text-sm h-6 p-0 border-0 bg-transparent
                                    outline-none focus:outline-none focus:ring-0"
                            />
                        </div>

                        {/* Municipio */}
                        <div className="w-48 border border-gray-200 rounded-lg px-2 py-1.5 
                            focus-within:border-[#0E5F63] transition">

                            <select
                                value={nuevaEscuela.municipio_escuela || ""}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    setNuevaEscuela({
                                        ...nuevaEscuela,
                                        municipio_escuela: val === "" ? "" : Number(val),
                                    });
                                }}
                                className="w-full text-sm h-6 bg-transparent outline-none"
                            >
                                <option value="">Municipio</option>

                                {municipios?.map((m) => (
                                    <option
                                        key={m.id ?? m.nombre}
                                        value={m.id}
                                    >
                                        {m.nombre}
                                    </option>
                                ))}
                            </select>
                        </div>

                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end gap-4 text-xs pt-1">

                        <button
                            onClick={() => setCrearModo(false)}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
                        >
                            <X size={14} />
                            Cancelar
                        </button>

                        <button
                            onClick={handleCrearEscuela}
                            className="flex items-center gap-1 text-[#0E5F63] font-medium hover:opacity-80 transition"
                        >
                            <Check size={14} />
                            Crear
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}
