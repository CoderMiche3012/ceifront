import DatosDonador from "./DatosDonador";
import ResumenCard from "./ResumenCard";
import NotasSeguimientoCard from "./NotasSeguimientoCard";
import BeneficiariosVinculadosCard from "./BeneficiariosVinculadosCard";

export default function DatosGenerales({ data, setData }) {
  
  const handleUpdateEstatus = (nuevoEstatus) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      estatus: nuevoEstatus,
    }));
  };
  return (
    <div className="grid grid-cols-3 gap-6">
      
      <div className="col-span-2 space-y-6">
        <DatosDonador data={data} setData={setData} />
        <NotasSeguimientoCard data={data} setData={setData} />
      </div>

      <div className="col-span-1 space-y-6">
        <ResumenCard data={data} setData={setData} />
        <BeneficiariosVinculadosCard data={data} setData={setData} />

      </div>
    </div>
  );
}