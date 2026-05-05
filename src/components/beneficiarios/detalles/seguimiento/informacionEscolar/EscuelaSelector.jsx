import { Plus, Check, X } from "lucide-react";
import Input from "../../../../ui/Input";
import Field from "../../../../ui/Field";


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
                    className="flex-1 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#0E5F63]"
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
                <div className="absolute z-10 mt-2 w-full bg-white rounded-lg shadow-sm max-h-60 overflow-y-auto">
                    {filtradas.length > 0 ? (
                        filtradas.map((i) => (
                            <div
                                key={i.id_institucion}
                                onClick={() => seleccionarInstitucion(i)}
                                className="px-4 py-2 cursor-pointer transition hover:bg-[#0E5F63]/10 hover:text-[#0E5F63]"
                            >
                                {i.nombre}
                            </div>
                        ))
                    ) : (
                        <div className="px-4 py-2 text-gray-400">
                            Sin resultados
                        </div>
                    )}
                </div>
            )}

            {/* Crear escuela con contorno */}
            {/* Crear escuela con contorno */}
            {crearModo && (
                <div className="mt-3 border border-gray-200 rounded-xl p-4 bg-white shadow-sm space-y-4">

                    {/* Título */}
                    <div className="text-sm font-medium text-gray-600">
                        Crear escuela
                    </div>

                    {/* Inputs en la misma línea */}
                    <div className="flex gap-3">

                        {/* Escuela */}
                        <div className="flex-1 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0E5F63]">
                            <Input
                                placeholder="Nombre de la escuela"
                                value={nuevaEscuela.nombre}
                                onChange={(e) =>
                                    setNuevaEscuela({
                                        ...nuevaEscuela,
                                        nombre: e.target.value,
                                    })
                                }
                                className="border-0 focus:outline-none w-full"
                            />
                        </div>

                        {/* Clave */}
                        <div className="w-40 border border-gray-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-[#0E5F63]">
                            <Input
                                placeholder="Clave"
                                value={nuevaEscuela.clave_escolar}
                                onChange={(e) =>
                                    setNuevaEscuela({
                                        ...nuevaEscuela,
                                        clave_escolar: e.target.value,
                                    })
                                }
                                className="border-0 focus:outline-none w-full"
                            />
                        </div>

                    </div>

                    {/* Acciones */}
                    <div className="flex justify-end gap-5 text-sm pt-1">

                        <button
                            onClick={() => setCrearModo(false)}
                            className="flex items-center gap-1 text-gray-500 hover:text-gray-700 transition"
                        >
                            <X size={16} />
                            Cancelar
                        </button>

                        <button
                            onClick={handleCrearEscuela}
                            className="flex items-center gap-1 text-[#0E5F63] font-medium hover:opacity-80 transition"
                        >
                            <Check size={16} />
                            Crear
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
}