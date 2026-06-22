import { useParams } from "react-router-dom";

import EncabezadoDetalle from "../../components/ui/EncabezadoDetalle";
import TabsDonador from "../../features/donadores/components/detalles/TabsDonador";
import DatosGenerales from "../../features/donadores/components/detalles/DatosGenerales";
import Donativos from "../../features/donadores/components/detalles/Donativos";

import { useDonadorData } from "../../features/donadores/hooks/useDonadorData";
import { ui } from "../../styles/ui/uiClasses";

import kidsAnimation from "../../assets/imagenes/kid.json";
import Lottie from "lottie-react";

export default function DonadoresDetalle() {
  const { id } = useParams();
  // para los datos del donador
  const {
    data,
    loading,
    tab,
    setTab,
  } = useDonadorData(id);
  // estados del donador
  const estatus = data?.estatus?.toLowerCase();
  const badgeClass =
    estatus === "activo"
      ? ui.badge.activo
      : estatus === "inactivo"
        ? ui.badge.inactivo
        : estatus === "pausa"
          ? ui.badge.pendiente
          : ui.badge.default;

  // mientras carga
  if (loading) {
    return (
      <div className="flex h-64 flex-col items-center justify-center">

        <div className="w-56">
          <Lottie
            animationData={kidsAnimation}
            loop={true}
          />
        </div>

        <p className="mt-4 text-slate-600 font-medium">
          Cargando los datos de los donadores...
        </p>

      </div>
    );
  }
  // si no hay datos de los donadores
  if (!data) {
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="p-10 text-center text-slate-500">
          Donador no encontrado o error en la carga.
        </div>
      </div>
    );
  }

  return (
    <section className={`${ui.layout.page} flex flex-col h-full`}>

      {/* parte fija de arriba */}
      <div className={`sticky top-0 z-10 pb-2 bg-[#f3f1f4] ${ui.layout.page}`}>
        <EncabezadoDetalle
          nombre={data.nombre}
          apellidoP={data.apellido_paterno}
          apellidoM={data.apellido_materno}
          estatus={data.estatus}
          badgeClass={badgeClass}
          avatarClassName="h-16 w-16 text-3xl"
        />
        <TabsDonador tab={tab} setTab={setTab} />
      </div>

      {/*contenido del tab */}
      <main className="flex-1 overflow-y-auto pr-2 custom-scroll pb-10">

        {tab === "generales" && (
          <DatosGenerales data={data} />
        )}

        {tab === "donativo" && (
          <Donativos data={data} />
        )}
      </main>

    </section>
  );
}