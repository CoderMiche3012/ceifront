export default function DatosTabla({ columns, data, renderCell }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[980px]">
        <thead>
          <tr className="border-b border-[#edf2f7] text-left">
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-5 text-[11px] font-bold uppercase tracking-wide text-slate-400"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id_usuario}
                className="border-b border-[#f1f5f9] last:border-b-0"
              >
                {columns.map((column) => (
                  <td key={column.key} className="px-6 py-5 align-middle">
                    {/* Render dinámico de cada celda */}
                    {renderCell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-10 text-center text-sm text-slate-400"
              >
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}