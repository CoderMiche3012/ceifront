import Card from "./Card";
import BotonEditar from "./BotonEditar";
import { PencilLine } from "lucide-react";
// estandar para las notas en los diferentes modulos
export default function NotasCard({
  icon: Icon,
  title,
  onEdit,
  editLabel = "Editar",
  children,
}) {
  return (
    <Card>
      <div className="flex items-center justify-between mb-6">
        <h3 className="flex items-center gap-2 text-sm font-bold text-slate-800">
          {Icon && <Icon className="w-4 h-4 text-teal-600" />}
          {title}
        </h3>

        {onEdit && (
          <BotonEditar icon={PencilLine} onClick={onEdit}>
            {editLabel}
          </BotonEditar>
        )}
      </div>

      {children}
    </Card>
  );
}