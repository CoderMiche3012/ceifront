// componente para los titulos de las paginas principales

import { ui } from "../../styles/ui/uiClasses";

export default function EncabezadoPagina({ titulo, descripcion, accion, }) {
  return (
    <div className={ui.header.container}>
      <div>
        <h1 className={ui.text.h1}>
          {titulo}
        </h1>
        {descripcion ? (
          <p className={ui.text.subtitle + " mt-1"}>
            {descripcion}
          </p>
        ) : null}
      </div>

      {accion ? (
        <div className="w-full md:w-auto">
          {accion}
        </div>
      ) : null}
    </div>
  )
}