import { UserPlus } from "lucide-react";
import Boton from "../../components/ui/Boton";
import EncabezadoPagina from "../../components/shared/EncabezadoPagina";

export default function PeriodosPagina() {
  
  return (
    <section className="space-y-6">
      <EncabezadoPagina
        titulo="Gestión de Beneficiarios"
        descripcion="Monitoreo y organizacion de expedientes"
        accion={
          <Boton icon={<UserPlus size={18} />}>
            Registrar Beneficiario
          </Boton>
        }
      />
    </section>
  );
}