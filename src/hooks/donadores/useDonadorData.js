import { useState, useEffect } from "react";
import { obtenerBeneficiario } from "../../services/beneficiariosService";
import { obtenerDonador } from "../../services/donadoresService";

export const useDonadorData = (id) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("generales");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [beneficiariosRes, donadoresRes] = await Promise.all([
          obtenerBeneficiario(),
          obtenerDonador(),
        ]);

        const listaBeneficiarios = Array.isArray(beneficiariosRes)
          ? beneficiariosRes
          : beneficiariosRes.results || [];

        const listaDonadores = Array.isArray(donadoresRes)
          ? donadoresRes
          : donadoresRes.results || [];

        /* Buscar donador */
        const donador = listaDonadores.find(
          (d) => String(d.id_donador) === String(id)
        );

        if (!donador) {
          setData(null);
          return;
        }

        /* IDs relacionados */
        const idsRelacionados =
          donador.beneficiarios_apoyados?.map((b) =>
            typeof b === "object"
              ? b.id_beneficiario
              : b
          ) || [];

        /* Beneficiarios completos */
        const beneficiariosRelacionados = listaBeneficiarios.filter((b) =>
          idsRelacionados.includes(b.id_beneficiario)
        );

        setData({
          ...donador,

          beneficiarios: beneficiariosRelacionados,

          total_beneficiarios: beneficiariosRelacionados.length,
        });
      } catch (error) {
        console.error("Error cargando donador:", error);
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
    tab,
    setTab,
  };
};