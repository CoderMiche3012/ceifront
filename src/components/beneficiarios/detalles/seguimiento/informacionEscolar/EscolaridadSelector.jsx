import { useState, useRef, useEffect } from "react";
import Input from "../../../../ui/Input";

export default function EscolaridadSelector({
  gradosMock,
  setForm,
  form,
}) {
  const [busqueda, setBusqueda] =
    useState("");

  const [mostrar, setMostrar] =
    useState(false);

  const ref = useRef();

  /* ================= CLICK OUTSIDE ================= */

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        ref.current &&
        !ref.current.contains(e.target)
      ) {
        setMostrar(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* ================= VALOR INICIAL ================= */

  useEffect(() => {
    if (form?.id_escolaridad) {

      const seleccionado =
        gradosMock.find(
          (g) =>
            g.id ===
            form.id_escolaridad
        );

      if (seleccionado) {
        setBusqueda(
          `${seleccionado.nivel} - ${seleccionado.grado}`
        );
      }
    }
  }, [
    form?.id_escolaridad,
    gradosMock,
  ]);

  /* ================= LIMPIAR BÚSQUEDA ================= */

  useEffect(() => {
    if (!form?.id_escolaridad) {
      setBusqueda("");
    }
  }, [form?.id_escolaridad]);

  /* ================= FILTRO ================= */

  const filtrados = gradosMock.filter(
    (g) =>
      `${g.nivel} ${g.grado}`
        .toLowerCase()
        .includes(
          busqueda.toLowerCase()
        )
  );

  return (
    <div
      ref={ref}
      className="relative w-full"
    >

      <Input
        value={busqueda}

        disabled={
          !form?.nivel_educativo
        }

        onFocus={() =>
          setMostrar(true)
        }

        onChange={(e) => {
          setBusqueda(
            e.target.value
          );

          setMostrar(true);
        }}

        placeholder={
          form?.nivel_educativo
            ? "Seleccionar grado..."
            : "Primero selecciona nivel educativo"
        }

        className="w-full text-sm bg-transparent border-0 outline-none 
                   focus:ring-0 focus:outline-none 
                   disabled:opacity-50"
      />

      {/* ================= DROPDOWN ================= */}

      {mostrar &&
        form?.nivel_educativo && (
          <div
            className="absolute z-50 mt-2 w-full bg-white 
                       border border-slate-200 
                       rounded-xl shadow-lg 
                       max-h-52 overflow-auto"
          >

            {filtrados.length > 0 ? (

              filtrados.map((g) => (
                <div
                  key={g.id}

                  onClick={() => {
                    setForm((prev) => ({
                      ...prev,

                      id_escolaridad:
                        g.id,
                    }));

                    setBusqueda(
                      `${g.nivel} - ${g.grado}`
                    );

                    setMostrar(false);
                  }}

                  className="px-4 py-2 text-sm cursor-pointer transition
                             hover:bg-[#0E5F63]/10 
                             hover:text-[#0E5F63]"
                >

                  <div className="font-medium">
                    {g.nivel}
                  </div>

                  <div className="text-xs text-slate-400">
                    {g.grado}
                  </div>

                </div>
              ))

            ) : (

              <div className="px-4 py-2 text-sm text-slate-400">
                Sin resultados
              </div>

            )}

          </div>
        )}
    </div>
  );
}