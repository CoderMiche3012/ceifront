import { Plus } from "lucide-react";
import ModalConfirmacion from "../../../../../shared/ModalConfirmacion";
import ModalResultado from "../../../../../shared/ModalResultado";
import ServicioSocialItemCard from "./ServicioSocialItemCard";
import ModalFormularioServicioSocial from "./ModalFormularioServicioSocial";
import useServicioSocialCard from "./useServicioSocialCard";

export default function ResumenServicioSocialCard({
  idSeguimiento,
}) {
  const vm =
    useServicioSocialCard(
      idSeguimiento
    );

  if (vm.isLoading) {
    return (
      <div className="p-6 text-slate-500">
        Cargando...
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-all">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold text-slate-800">
              Servicio social
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Registro de actividades
            </p>
          </div>

          <button
            onClick={
              vm.abrirNuevo
            }
            className="bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-xl flex items-center gap-2"
          >
            <Plus size={18} />
            Agregar
          </button>
        </div>

        <div className="space-y-4">
          {vm.servicios
            .length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              Sin servicios registrados
            </div>
          ) : (
            vm.servicios.map(
              (
                item
              ) => (
                <ServicioSocialItemCard
                  key={
                    item.id_servicio_social
                  }
                  item={
                    item
                  }
                  onEditar={
                    vm.editar
                  }
                />
              )
            )
          )}
        </div>
      </div>

      <ModalFormularioServicioSocial
        open={
          vm.modalForm
        }
        data={
          vm.payload
        }
        setData={
          vm.setPayload
        }
        alerta={
          vm.alerta
        }
        loading={
          vm.loading
        }
        onClose={
          vm.cerrarFormulario
        }
        onNext={
          vm.abrirConfirmacion
        }
      />

      <ModalConfirmacion
        open={
          vm.modalConfirm
        }
        title="Guardar servicio social"
        description="Se guardará la información del servicio social."
        confirmText="Guardar"
        onClose={
          vm.cerrarConfirmacion
        }
        onConfirm={
          vm.guardar
        }
        loading={
          vm.loading
        }
      />

      <ModalResultado
        open={
          vm.modalResultado
        }
        type="success"
        title="Guardado"
        message="Servicio social actualizado correctamente"
        onClose={
          vm.cerrarResultado
        }
      />
    </>
  );
}