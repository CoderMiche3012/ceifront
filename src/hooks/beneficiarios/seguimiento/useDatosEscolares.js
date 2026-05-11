import { useEffect, useState, useRef, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import {
  crearDatosEscolaresInd,
  actualizarDatosEscolaresInd,
} from "../../../services/escuelaService";

import {
  obtenerInstituciones,
  crearInstitucion,
} from "../../../services/institucionesService";

export default function useDatosEscolares(
  id_seguimiento,
  datosIniciales
) {
  const queryClient = useQueryClient();

  const esEdicion =
    !!datosIniciales?.id_datos_escolares;

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    grupo: "",
    turno: "",
    modalidad_educativa: "",
    especialidad: "",
    id_escolaridad: "",
    nivel_educativo: "", // 👈 SOLO VISUAL
  });

  const [institucionSeleccionada,
    setInstitucionSeleccionada] =
    useState(null);

  /* ================= ESCUELAS ================= */

  const [busqueda, setBusqueda] = useState("");

  const [mostrarResultados,
    setMostrarResultados] =
    useState(false);

  const [crearModo, setCrearModo] =
    useState(false);

  const [nuevaEscuela,
    setNuevaEscuela] = useState({
      nombre: "",
      clave_escolar: "",
    });

  const refEscuela = useRef();

  const { data: instituciones = [] } =
    useQuery({
      queryKey: ["instituciones"],
      queryFn: obtenerInstituciones,
    });

  // 🔥 BÚSQUEDA
  const filtradas = useMemo(() => {
    const b = busqueda.toLowerCase().trim();

    if (!b) return instituciones;

    return instituciones.filter((i) => {
      const nombre =
        i.nombre?.toLowerCase() || "";

      const clave =
        i.clave_escolar?.toLowerCase() || "";

      return (
        nombre.includes(b) ||
        clave.includes(b)
      );
    });
  }, [instituciones, busqueda]);

  const seleccionarInstitucion = (inst) => {
    setInstitucionSeleccionada(inst);

    setBusqueda(
      inst.clave_escolar
        ? `${inst.nombre} (${inst.clave_escolar})`
        : inst.nombre
    );

    setMostrarResultados(false);
  };

  const handleCrearEscuela = async () => {
    try {
      const nueva =
        await crearInstitucion(nuevaEscuela);

      // ⚡ actualización inmediata
      queryClient.setQueryData(
        ["instituciones"],
        (old = []) => [nueva, ...old]
      );

      setInstitucionSeleccionada(nueva);

      setBusqueda(
        nueva.clave_escolar
          ? `${nueva.nombre} (${nueva.clave_escolar})`
          : nueva.nombre
      );

      setCrearModo(false);
      setMostrarResultados(false);

      setNuevaEscuela({
        nombre: "",
        clave_escolar: "",
      });

    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= EDICIÓN ================= */

  useEffect(() => {
    if (datosIniciales) {

      const escolaridadId =
        datosIniciales.id_escolaridad?.id_escolaridad;

      const escolaridad =
        gradosMock.find(
          (g) => g.id === escolaridadId
        );

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
        grupo:
          datosIniciales.grupo || "",

        turno:
          datosIniciales.turno?.toUpperCase() || "",

        modalidad_educativa:
          datosIniciales.modalidad_educativa?.toUpperCase() || "",

        especialidad:
          datosIniciales.especialidad || "",

        id_escolaridad:
          escolaridadId || "",

        nivel_educativo:
          nivelEducativo,
      });

      // 🔥 institución
      if (datosIniciales.id_institucion) {

        setInstitucionSeleccionada({
          id_institucion:
            datosIniciales.id_institucion.id_institucion,

          nombre:
            datosIniciales.id_institucion.nombre,

          clave_escolar:
            datosIniciales.id_institucion.clave_escolar,
        });

        setBusqueda(
          datosIniciales.id_institucion
            .clave_escolar
            ? `${datosIniciales.id_institucion.nombre} (${datosIniciales.id_institucion.clave_escolar})`
            : datosIniciales.id_institucion.nombre
        );
      }
    }
  }, [datosIniciales]);

  /* ================= NIVELES ================= */

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

  /* ================= ESCOLARIDAD ================= */

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

  // 🔥 FILTRAR SEGÚN NIVEL
  const gradosFiltrados = useMemo(() => {
    if (!form.nivel_educativo)
      return [];

    const nivelesPermitidos =
      nivelesEducativos[
      form.nivel_educativo
      ] || [];

    return gradosMock.filter((g) =>
      nivelesPermitidos.includes(
        g.nivel
      )
    );
  }, [form.nivel_educativo]);

  // 🔥 nivel actual
  const nivelSeleccionado =
    gradosMock.find(
      (g) =>
        g.id === form.id_escolaridad
    )?.nivel;

  // 🔥 mostrar especialidad
  const mostrarEspecialidad =
    form.nivel_educativo ===
    "MEDIA_SUPERIOR" ||
    form.nivel_educativo ===
    "SUPERIOR";

  /* ================= PERIODICIDAD ================= */
  const tieneBoletas =
    datosIniciales?.boletas?.length > 0;

  useEffect(() => {
    if (
      form.nivel_educativo ===
      "BASICA"
    ) {
      setForm((prev) => ({
        ...prev,
        modalidad_educativa:
          "ANUAL",
        especialidad: "",
      }));
    }

    if (
      form.nivel_educativo ===
      "MEDIA_SUPERIOR" ||

      form.nivel_educativo ===
      "SUPERIOR"
    ) {
      setForm((prev) => ({
        ...prev,
        modalidad_educativa:
          "SEMESTRAL",
      }));
    }
  }, [form.nivel_educativo]);

  /* ================= FORM ================= */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]:
        e.target.value,
    }));
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (
        !institucionSeleccionada
      ) {
        throw new Error(
          "Selecciona una escuela"
        );
      }

      if (
        !form.id_escolaridad
      ) {
        throw new Error(
          "Selecciona escolaridad"
        );
      }

      if (
        mostrarEspecialidad &&
        !form.especialidad
      ) {
        throw new Error(
          "La especialidad es requerida"
        );
      }

      // 🔥 quitar campo visual
      const {
        nivel_educativo,
        ...formularioLimpio
      } = form;

      const payload = {
        ...formularioLimpio,

        id_institucion:
          institucionSeleccionada
            .id_institucion,

        id_seguimiento,
      };

      if (esEdicion) {
        await actualizarDatosEscolaresInd(
          datosIniciales.id_datos_escolares,
          payload
        );
      } else {
        await crearDatosEscolaresInd(
          payload
        );
      }

      // 🔥 refrescar
      queryClient.invalidateQueries([
        "seguimiento",
        id_seguimiento,
      ]);

      return true;

    } catch (err) {
      setError(err.message);
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

    // escolaridad
    gradosMock:
      gradosFiltrados,

    mostrarEspecialidad,

    // submit
    handleSubmit,
  };
}

 