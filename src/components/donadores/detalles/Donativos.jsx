
import HistorialDonativos from "./HistorialDonativos";
export default function Donativos({ data, setData }) {

  const handleUpdateEstatus = (nuevoEstatus) => {
    if (!setData) return;
    setData((prev) => ({
      ...prev,
      estatus: nuevoEstatus,
    }));
  };
  return (
    <div className="w-full px-6 py-6">
      <div className="w-full">
        <HistorialDonativos
          data={data}
          setData={setData}
        />
      </div>
    </div>
  );
}