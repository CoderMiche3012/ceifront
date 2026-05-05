import { useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";

import { crearDatosEscolaresInd } from "../../../services/escuelaService";
import {
  obtenerInstituciones,
  crearInstitucion,
} from "../../../services/institucionesService";

export default function useDatosEscolares(id_seguimiento) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    grupo: "",
    turno: "",
    modalidad_educativa: "",
    especialidad: "",
    id_escolaridad: "",
  });

  const [institucionSeleccionada, setInstitucionSeleccionada] =
    useState(null);

  /* ================= ESCUELAS ================= */
  const [busqueda, setBusqueda] = useState("");
  const [mostrarResultados, setMostrarResultados] = useState(false);

  const [crearModo, setCrearModo] = useState(false);
  const [nuevaEscuela, setNuevaEscuela] = useState({
    nombre: "",
    clave_escolar: "",
  });

  const refEscuela = useRef();

  const { data: instituciones = [] } = useQuery({
    queryKey: ["instituciones"],
    queryFn: obtenerInstituciones,
  });

  const filtradas = instituciones.filter((i) =>
    i.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionarInstitucion = (inst) => {
    setInstitucionSeleccionada(inst);
    setBusqueda(inst.nombre);
    setMostrarResultados(false);
  };

  const handleCrearEscuela = async () => {
    try {
      const nueva = await crearInstitucion(nuevaEscuela);

      setInstitucionSeleccionada(nueva);
      setBusqueda(nueva.nombre);
      setCrearModo(false);
      setNuevaEscuela({ nombre: "", clave_escolar: "" });
    } catch (err) {
      setError(err.message);
    }
  };

  /* ================= ESCOLARIDAD ================= */

  const gradosMock = [
    { id: 1, nivel: "Preescolar", grado: "1°" },
    { id: 2, nivel: "Primaria", grado: "1°" },
    { id: 3, nivel: "Secundaria", grado: "1°" },
    { id: 4, nivel: "Preparatoria", grado: "1°" },
  ];

  const nivelSeleccionado = gradosMock.find(
    (g) => g.id === form.id_escolaridad
  )?.nivel;

  /* ================= FORM ================= */

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");

      if (!institucionSeleccionada) {
        throw new Error("Selecciona una escuela");
      }

      if (!form.id_escolaridad) {
        throw new Error("Selecciona escolaridad");
      }

      if (
        nivelSeleccionado === "Preparatoria" &&
        !form.especialidad
      ) {
        throw new Error("La especialidad es requerida");
      }

      await crearDatosEscolaresInd({
        ...form,
        id_institucion: institucionSeleccionada.id_institucion,
        id_seguimiento,
      });

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
    gradosMock,

    // submit
    handleSubmit,
  };
}