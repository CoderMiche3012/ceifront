import { useState, useEffect } from "react";
import { obtenerBeneficiario } from "../../beneficiarios/services/beneficiariosService";
import { obtenerDonador } from "../services/donadoresService";
export const useDonadorData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("generales");
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        //obtener lista de donadores
        const donadoresRes = await obtenerDonador();

        const listaDonadores = Array.isArray(donadoresRes)
          ? donadoresRes
          : donadoresRes?.results || [];

        //buscar el donador por ID
        const donador = listaDonadores.find(
          (d) => String(d.id_donador) === String(id)
        );
        if (!donador) {
          setData(null);
          return;
        }
        //obtener IDs de beneficiarios
        const idsRelacionados =
          donador.beneficiarios_apoyados?.map((b) =>
            typeof b === "object" ? b.id_beneficiario : b
          ) || [];

        //obtener beneficiarios SOLO si hay IDs
        let beneficiarios = [];

        if (idsRelacionados.length > 0) {
          beneficiarios = await Promise.all(
            idsRelacionados.map((id_beneficiario) =>
              obtenerBeneficiario(id_beneficiario)
            )
          );
        }

        setData({
          ...donador,
          beneficiarios,
          total_beneficiarios: beneficiarios.length,
        });

      } catch (err) {
        console.error("Error cargando donador:", err);
        setError(err.message || "Error inesperado");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  return {
    data,
    setData,
    loading,
    error,
    tab,
    setTab,
  };
};