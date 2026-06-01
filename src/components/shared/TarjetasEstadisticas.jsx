import { ui } from "../../styles/ui/uiClasses";

export default function TarjetasEstadisticas({ items = [] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4">
      {items.map(
        ( { label, value, icon: Icon, color, }, index ) => (
          <div
            key={index}
            className={ui.statCard}
          >
            <div>
              <p className={ ui.statLabel }>
                {label}
              </p>
              <h3 className={`text-3xl font-bold text-${color}-600`} >
                {value}
              </h3>
            </div>
            <div className={`bg-${color}-100 text-${color}-600 p-3 rounded-2xl`} >
              <Icon size={24} />
            </div>
          </div>
        )
      )}
    </div>
  );
}