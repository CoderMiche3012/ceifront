export default function DocumentosCard({ data }) {
  const documentos = data?.documentos || [];

  return (
    <div className="rounded-2xl bg-white p-4 border shadow-sm space-y-3">
      <h3 className="text-sm font-bold text-slate-700">
        Documentos
      </h3>

      {documentos.length === 0 ? (
        <p className="text-xs text-slate-400">
          Sin documentos registrados
        </p>
      ) : (
        documentos.map((doc) => (
          <div
            key={doc.id}
            className="flex justify-between items-center text-sm border-b py-2"
          >
            <span>{doc.nombre}</span>

            <a
              href={doc.url}
              target="_blank"
              className="text-indigo-600 text-xs"
            >
              Ver
            </a>
          </div>
        ))
      )}
    </div>
  );
}