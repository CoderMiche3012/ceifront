export default function DatosTablaCheck({
  columns,
  data,
  renderCell,
  rowKey = "id",
}) {
  return (
    <div className="overflow-x-auto border-0 shadow-none">
      <table className="w-full min-w-[980px] border-0 border-collapse">
        <thead>
          <tr className="border-b border-[#edf2f7]">
            {columns.map((column) => (
              <th
                key={column.key}
                className={`px-6 py-5 text-[11px] font-bold uppercase tracking-wide text-slate-400 ${column.className || "text-left"
                  }`}
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
                key={row[rowKey] ?? JSON.stringify(row)}
                className="border-b border-[#f1f5f9] last:border-b-0"
              >
                {columns.map((column) => (
                  <td
                    key={column.key}
                    className={`px-6 py-5 align-middle ${column.className || ""
                      }`}
                  >
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
  );
}