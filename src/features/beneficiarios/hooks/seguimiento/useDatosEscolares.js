import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useCrearDatosEscolares, useActualizarDatosEscolares, } from "../../hooks/seguimiento/useDatosEscolaresK";
import { obtenerInstituciones, crearInstitucion, } from "../../services/institucionesService";
import { obtenerMunicipios } from "../../services/municipiosService";

export default function useDatosEscolares(id_seguimiento, datosIniciales) {

  const queryClient = useQueryClient();
  const crearDatosEscolares = useCrearDatosEscolares();
  const actualizarDatosEscolares = useActualizarDatosEscolares();

  const esEdicion = !!datosIniciales?.id_datos_escolares;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    grupo: "",
    turno: "",
    modalidad_educativa: "",
    especialidad: "",
    id_escolaridad: "",
    nivel_educativo: "",
  });

  const [institucionSeleccionada, setInstitucionSeleccionada] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);
  const [crearModo, setCrearModo] = useState(false);
  const [nuevaEscuela, setNuevaEscuela] = useState({ nombre: "", municipio_escuela: "", });
  const refEscuela = useRef();

  const { data: instituciones = [] } =
    useQuery({
      queryKey: ["instituciones"],
      queryFn: obtenerInstituciones,
    });

  const { data: municipios = [] } = useQuery({
    queryKey: ["municipios"],
    queryFn: obtenerMunicipios,
  });

  const filtradas = useMemo(() => {
    const b = busqueda.toLowerCase().trim();

    if (!b) return instituciones;

    return instituciones.filter((i) => {
      const nombre = i.nombre?.toLowerCase() || "";
      const municipio = i.municipio_escuela?.nombre?.toLowerCase() || "";

      return (
        nombre.includes(b) ||
        municipio.includes(b)
      );
    });
  }, [instituciones, busqueda]);
  const obtenerNombreMunicipio = (inst) => {
    if (typeof inst.municipio_escuela === "object") {
      return inst.municipio_escuela?.nombre || "";
    }

    return (
      municipios.find(
        (m) => Number(m.id) === Number(inst.municipio_escuela)
      )?.nombre || ""
    );
  };
  const seleccionarInstitucion = (inst) => {
    const municipio = obtenerNombreMunicipio(inst);

    setInstitucionSeleccionada(inst);

    setBusqueda(
      municipio
        ? `${inst.nombre} - ${municipio}`
        : inst.nombre
    );

    setMostrarResultados(false);
  };

  const handleCrearEscuela = async () => {
    try {
      const nombreLimpio = nuevaEscuela.nombre?.trim();
      const municipioId = Number(nuevaEscuela.municipio_escuela);
      if (!nombreLimpio) {
        throw new Error("El nombre de la escuela no puede estar vacío");
      }
      if (!municipioId || isNaN(municipioId)) {
        throw new Error("Debes seleccionar un municipio válido");
      }

      const payload = {
        nombre: nombreLimpio,
        municipio_escuela: municipioId,
      };
      const nueva = await crearInstitucion(payload);
      queryClient.setQueryData(["instituciones"], (old = []) => [nueva, ...old]);
      setInstitucionSeleccionada(nueva);
      const municipio = obtenerNombreMunicipio(nueva);
      setBusqueda(
        municipio
          ? `${nueva.nombre} - ${municipio}`
          : nueva.nombre
      );
      setMostrarResultados(false);
      setCrearModo(false);
      setNuevaEscuela({ nombre: "", municipio_escuela: "" });
      setError("");

    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    }
  };

  useEffect(() => {
    if (datosIniciales) {
      const escolaridadId = datosIniciales.id_escolaridad?.id_escolaridad;
      const escolaridad = gradosMock.find((g) => g.id === escolaridadId);
      let nivelEducativo = "";

      if (
        ["Preescolar", "Primaria", "Secundaria"]
          .includes(escolaridad?.nivel)
      ) {
        nivelEducativo = "BASICA";
      }

      if (
        escolaridad?.nivel === "Preparatoria"
      ) {
        nivelEducativo =
          "MEDIA_SUPERIOR";
      }

      if (
        escolaridad?.nivel === "Universidad"
      ) {
        nivelEducativo =
          "SUPERIOR";
      }

      setForm({
        grupo: datosIniciales.grupo || "",
        turno: datosIniciales.turno?.toUpperCase() || "",
        modalidad_educativa: datosIniciales.modalidad_educativa?.toUpperCase() || "",
        especialidad: datosIniciales.especialidad || "",
        id_escolaridad: escolaridadId || "",
        nivel_educativo: nivelEducativo,
      });

      if (datosIniciales.id_institucion) {
        const inst = {
          id_institucion: datosIniciales.id_institucion.id_institucion,
          nombre: datosIniciales.id_institucion.nombre,
          municipio_escuela: datosIniciales.id_institucion.municipio_escuela,
        };

        setInstitucionSeleccionada(inst);

        const municipio = obtenerNombreMunicipio(inst);

        setBusqueda(
          municipio
            ? `${inst.nombre} - ${municipio}`
            : inst.nombre
        );
      }
    }
  }, [datosIniciales]);

  const nivelesEducativos = {
    BASICA: [
      "Preescolar",
      "Primaria",
      "Secundaria",
    ],

    MEDIA_SUPERIOR: [
      "Preparatoria",
    ],

    SUPERIOR: [
      "Universidad",
    ],
  };

  const gradosMock = [
    {
      id: 1,
      nivel: "Preescolar",
      grado: "1°",
    },
    {
      id: 2,
      nivel: "Preescolar",
      grado: "2°",
    },
    {
      id: 3,
      nivel: "Preescolar",
      grado: "3°",
    },

    {
      id: 4,
      nivel: "Primaria",
      grado: "1°",
    },
    {
      id: 5,
      nivel: "Primaria",
      grado: "2°",
    },
    {
      id: 6,
      nivel: "Primaria",
      grado: "3°",
    },
    {
      id: 7,
      nivel: "Primaria",
      grado: "4°",
    },
    {
      id: 8,
      nivel: "Primaria",
      grado: "5°",
    },
    {
      id: 9,
      nivel: "Primaria",
      grado: "6°",
    },

    {
      id: 10,
      nivel: "Secundaria",
      grado: "1°",
    },
    {
      id: 11,
      nivel: "Secundaria",
      grado: "2°",
    },
    {
      id: 12,
      nivel: "Secundaria",
      grado: "3°",
    },

    {
      id: 13,
      nivel: "Preparatoria",
      grado: "1°",
    },
    {
      id: 14,
      nivel: "Preparatoria",
      grado: "2°",
    },
    {
      id: 15,
      nivel: "Preparatoria",
      grado: "3°",
    },

    {
      id: 16,
      nivel: "Universidad",
      grado: "1°",
    },
    {
      id: 17,
      nivel: "Universidad",
      grado: "2°",
    },
    {
      id: 18,
      nivel: "Universidad",
      grado: "3°",
    },
    {
      id: 19,
      nivel: "Universidad",
      grado: "4°",
    },
    {
      id: 20,
      nivel: "Universidad",
      grado: "5°",
    },
    {
      id: 21,
      nivel: "Universidad",
      grado: "6°",
    },
    {
      id: 22,
      nivel: "Universidad",
      grado: "7°",
    },
  ];

  const gradosFiltrados = useMemo(() => {
    if (!form.nivel_educativo)
      return [];

    const nivelesPermitidos = nivelesEducativos[form.nivel_educativo] || [];

    return gradosMock.filter((g) =>
      nivelesPermitidos.includes(
        g.nivel
      )
    );
  }, [form.nivel_educativo]);

  const nivelSeleccionado =
    gradosMock.find(
      (g) =>
        g.id === form.id_escolaridad
    )?.nivel;

  const mostrarEspecialidad = form.nivel_educativo === "MEDIA_SUPERIOR" ||  form.nivel_educativo === "SUPERIOR";

  const tieneBoletas = datosIniciales?.boletas?.length > 0;

  useEffect(() => {
    if (
      form.nivel_educativo === "BASICA"
    ) {
      setForm((prev) => ({
        ...prev,
        modalidad_educativa:
          "ANUAL",
        especialidad: "",
      }));
    }

    if (form.nivel_educativo === "MEDIA_SUPERIOR" || form.nivel_educativo ===  "SUPERIOR" ) {
      setForm((prev) => ({
        ...prev,
        modalidad_educativa:
          "SEMESTRAL",
      }));
    }
  }, [form.nivel_educativo]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!institucionSeleccionada) {
        throw new Error("Selecciona una escuela valida");
      }

      if (!form.id_escolaridad) {
        throw new Error("Selecciona escolaridad valida");
      }

      if (mostrarEspecialidad && !form.especialidad) {
        throw new Error("La especialidad es requerida");
      }

      const { nivel_educativo, ...formularioLimpio } = form;

      const payload = {
        ...formularioLimpio,
        id_institucion: institucionSeleccionada.id_institucion,
        id_seguimiento,
      };

      let result;
      // editar
      if (esEdicion) {
        result = await actualizarDatosEscolares.mutateAsync({
          id: datosIniciales.id_datos_escolares,
          data: payload,
        });
      }
      // crear
      else {
        result = await crearDatosEscolares.mutateAsync(payload);
      }
      return true;
    } catch (err) {
      setError(err.message || "Error inesperado");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    // form
    form,
    setForm,
    handleChange,
    // estados
    error,
    loading,
    tieneBoletas,
    // escuela
    busqueda,
    setBusqueda,
    mostrarResultados,
    setMostrarResultados,
    crearModo,
    setCrearModo,
    nuevaEscuela,
    setNuevaEscuela,
    instituciones,
    filtradas,
    seleccionarInstitucion,
    handleCrearEscuela,
    refEscuela,
    institucionSeleccionada,
    obtenerNombreMunicipio,
    gradosMock: gradosFiltrados,
    mostrarEspecialidad,
    handleSubmit,
    municipios,

  };
}



