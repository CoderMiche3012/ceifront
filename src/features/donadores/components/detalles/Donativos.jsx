import HistorialDonativos from "./HistorialDonativos";

export default function Donativos({ data }) {
  return (
    <div className="w-full px-6 py-6">
      <div className="w-full">
        <HistorialDonativos data={data} />
      </div>
    </div>
  );
}