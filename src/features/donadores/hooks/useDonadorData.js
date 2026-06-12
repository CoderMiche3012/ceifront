import { useMemo, useState } from "react";
import { useDonadores } from "./useDonadores";

export const useDonadorData = (id) => {
  const [tab, setTab] = useState("generales");

  const { data: donadores = [], isLoading: loading, error,} = useDonadores();
  const data = useMemo(() => {
    if (!id) return null;
    const donador = donadores.find( (d) => String(d.id_donador) === String(id));
    if (!donador) return null;
    return {
      ...donador,
      beneficiarios: donador.beneficiarios_apoyados || [],
      total_beneficiarios:donador.beneficiarios_apoyados?.length || 0,
    };
  }, [id, donadores]);

  return {
    data,
    loading,
    error,
    tab,
    setTab,
  };
};