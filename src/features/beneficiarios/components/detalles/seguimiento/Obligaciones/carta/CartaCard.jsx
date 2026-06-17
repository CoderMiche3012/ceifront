import CartaInfoCard from "./CartaInfoCard";
import ModalFormularioCarta from "./ModalFormularioCarta";
import useCartaCard from "./useCartaCard";
import ModalConfirmacion from "../../../../../../../components/shared/ModalConfirmacion";
import ModalResultado from "../../../../../../../components/shared/ModalResultado";

export default function CartaCard({ seguimiento, editable, canCreateObligaciones }) {

  const vm = useCartaCard(seguimiento);
  if (!seguimiento) return <div className="p-6 text-slate-500">Cargando...</div>;
  return (
    <>
      <CartaInfoCard 
      carta={vm.carta} 
      onEditar={vm.handleEditar} 
      loading={vm.loading} 
      editable={editable} 
      canCreateObligaciones = {canCreateObligaciones}
      />

      <ModalFormularioCarta
        open={vm.modalForm}
        data={vm.payload}
        setData={vm.setPayload}
        alerta={vm.alerta}
        loading={vm.loading}
        onClose={vm.cerrarFormulario}
        onNext={vm.abrirConfirmacion}
      />

      <ModalConfirmacion
        open={vm.modalConfirm}
        title="Guardar cambios"
        description="Se actualizará la información de la carta."
        confirmText="Guardar"
        onClose={vm.cerrarConfirmacion}
        onConfirm={vm.confirmarAccion}
        loading={vm.loading}
      />

      <ModalResultado
        open={vm.modalResultado}
        type="success"
        title="Guardado"
        message="Actualizado correctamente"
        onClose={vm.cerrarResultado}
      />
    </>
  );
}
