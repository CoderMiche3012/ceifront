export default function HeaderAnalisis({ prioridad, justificacion }) {
  return (
    <div className="p-4 bg-orange-50/50 border-l-4 border-orange-500 rounded-lg">
      <h3 className="text-lg font-bold text-orange-900">Análisis IA: Prioridad {prioridad}</h3>
      <p className="text-sm text-orange-800/80 mt-1">{justificacion}</p>
    </div>
  );
}