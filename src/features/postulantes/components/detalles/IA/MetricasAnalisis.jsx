export default function MetricasAnalisis({ datos }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {datos.map((item, i) => (
        <div key={i} className="bg-gray-50 p-4 rounded-xl border border-gray-100">
          <p className="text-[10px] text-gray-400 uppercase tracking-wider font-bold">{item.label}</p>
          <p className="text-sm font-bold text-gray-800 mt-1">{item.val}</p>
        </div>
      ))}
    </div>
  );
}