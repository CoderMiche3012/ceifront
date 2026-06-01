import { ui } from "../../styles/ui/uiClasses";

export default function DatosTabla({columns,data,renderCell,rowKey = "id",}) {
  return (
    <div className={ui.table.wrapper}>
      <table className={ui.table.table}>
        <thead>
          <tr className={ui.table.headerRow}>
            {columns.map((column) => (
              <th key={column.key} className={ui.table.headerCell}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row[rowKey] ?? JSON.stringify(row)} className={ui.table.row} >
                {columns.map((column) => (
                  <td key={column.key}  className={ui.table.cell}>
                    {renderCell(row, column.key)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className={ui.table.empty} >
                No se encontraron registros.
              </td>
            </tr>
          )}
        </tbody>

      </table>
    </div>
  );
}