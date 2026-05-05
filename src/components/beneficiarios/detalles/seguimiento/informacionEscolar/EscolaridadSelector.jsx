import { useState, useRef } from "react";
import Input from "../../../../ui/Input";

export default function EscolaridadSelector({
  gradosMock,
  setForm,
}) {
  const [busqueda, setBusqueda] = useState("");
  const [mostrar, setMostrar] = useState(false);

  const ref = useRef();

  const filtrados = gradosMock.filter((g) =>
    `${g.nivel} ${g.grado}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  return (
    <div ref={ref} className="relative">
      <Input
        value={busqueda}
        onFocus={() => setMostrar(true)}
        onChange={(e) => {
          setBusqueda(e.target.value);
          setMostrar(true);
        }}
        placeholder="Buscar escolaridad..."
      />

      {mostrar && (
        <div className="absolute w-full bg-white border rounded-xl max-h-40 overflow-auto">
          {filtrados.map((g) => (
            <div
              key={g.id}
              onClick={() => {
                setForm((prev) => ({
                  ...prev,
                  id_escolaridad: g.id,
                }));
                setBusqueda(`${g.nivel} - ${g.grado}`);
                setMostrar(false);
              }}
              className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
            >
              {g.nivel} - {g.grado}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}