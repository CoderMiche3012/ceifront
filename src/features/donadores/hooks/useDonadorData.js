// por corregir
import { useMemo, useState, } from "react";

import { useDonadores } from "./useDonadores";
import { useBeneficiarios } from "../../beneficiarios/hooks/useBeneficiarios";

export const useDonadorData = ( id ) => {

  const [tab, setTab] = useState( "generales" );
  const { data: donadores = [], isLoading: loadingDonadores, error: errorDonadores, } = useDonadores();
  const { data: beneficiarios = [], isLoading: loadingBeneficiarios, error: errorBeneficiarios,} = useBeneficiarios();

  const data =
    useMemo(() => {
      if (!id) return null;
      // busca el donador especifico
      const donador = donadores.find( (d) => String( d.id_donador ) === String( id ) );
      if (!donador)  return null;
      // id de las personas que apoya
      const idsRelacionados = ( donador.beneficiarios_apoyados || [] ).map( (b) => typeof b === "object" ? b.id_beneficiario : b );
      // Buscar la información real de esos beneficiarios
      const beneficiariosRelacionados = beneficiarios.filter( (b) => idsRelacionados.includes( b.id_beneficiario ) );

      return {
        ...donador,
        beneficiarios: beneficiariosRelacionados,
        total_beneficiarios: beneficiariosRelacionados.length,
      };
    }, [ id, donadores, beneficiarios, ]);

  return {
    data,
    setData: () => {},
    loading: loadingDonadores || loadingBeneficiarios,
    error: errorDonadores || errorBeneficiarios,
    tab,
    setTab,
  };
};