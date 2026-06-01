import { Folder, Plus, ChevronDown } from "lucide-react";

import DonativoTabla from "../tabla/DonativoTabla";
import PaginacionTabla from "../../../../components/tablas/PaginacionTabla";
import FiltrosTabla from "../../../../components/tablas/FiltrosTabla";
import ModalResultado from "../../../../components/shared/ModalResultado";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import Boton from "../../../../components/ui/BotonInterno";

import ModalDonativo from "../modales/ModalDonativo";
import useHistorialDonativos from "../../hooks/useHistorialDonativos";
import { formatMoney } from "../../../../utils/formatMoney";

const PAGE_SIZE = 2;

export default function HistorialDonativos({ data }) {

  const {
    donativos,
    periodosOrdenados,

    modalConf,
    modalRes,

    loading,
    saving,

    openId,
    pages,
    searchByPeriodo,

    showModal,
    showModalEditar,

    form,
    errorForm,

    setOpenId,
    setModalConf,
    setModalRes,
    setShowModalEditar,
    setForm,
    setErrorForm,

    abrirModal,
    abrirModalEditar,
    cerrarModal: cerrarModalOriginal,

    handleSubmitClick,
    handleConfirmarGuardado,

    changePage,
    handleSearchChange,

  } = useHistorialDonativos(data);

  const cerrarModal = () => { setErrorForm(""); cerrarModalOriginal(); };
  const donadorInactivo = data?.estatus?.toLowerCase() === "inactivo";

  return (
    <div className="mt-2">

      <h3 className="text-sm font-bold text-slate-800 mb-4">
        Historial de Donativos
      </h3>

      <div className="space-y-4">

        {periodosOrdenados.map((periodo) => {

          const search = searchByPeriodo[periodo.id_periodo] || "";
          const baseItems = donativos.filter((d) => Number(d.id_periodo) === Number(periodo.id_periodo));
          const items = baseItems.filter((d) => d.concepto?.toLowerCase().includes(search.toLowerCase()));

          const totalPorMoneda = items.reduce(
            (acc, item) => {
              const moneda = item.moneda || "MXN";
              acc[moneda] = (acc[moneda] || 0) + Number(item.monto || 0);
              return acc;
            },
            {}
          );

          const abierto = openId === periodo.id_periodo;
          const currentPage = pages[periodo.id_periodo] || 1;
          const totalPages = Math.ceil(items.length / PAGE_SIZE) || 1;
          const inicio = (currentPage - 1) * PAGE_SIZE;

          const dataPaginada = items.slice(inicio, inicio + PAGE_SIZE);
          const hayRegistros = baseItems.length > 0;

          return (
            <div
              key={periodo.id_periodo}
              className="bg-white border border-slate-200 rounded-2xl shadow-sm"
            >
              <button
                onClick={() => setOpenId(abierto ? null : periodo.id_periodo)}
                className="w-full px-5 py-4 flex items-center justify-between hover:bg-slate-50 transition"
              >
                <div className="flex items-center gap-4">

                  <div className="h-10 w-10 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center">
                    <Folder className="w-5 h-5" />
                  </div>

                  <p className="font-semibold text-slate-800">
                    Periodo Escolar {periodo.ciclo_escolar}
                  </p>

                </div>

                <div className="flex items-center gap-4">

                  <div className="text-right space-y-1">

                    <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold mb-0.5">
                      Total del Periodo Escolar
                    </p>

                    {Object.entries(totalPorMoneda).map(
                      ([moneda, total]) => (
                        <p
                          key={moneda}
                          className="text-sm font-bold text-teal-600"
                        >
                          {formatMoney(total, moneda)}
                        </p>
                      )
                    )}

                  </div>

                  <ChevronDown
                    className={` w-5 h-5 text-slate-400 transition-transform duration-200 ${abierto ? "rotate-180" : ""} `}
                  />

                </div>
              </button>

              {abierto && (

                <div className="border-t border-slate-100 p-5">

                  <div className="flex justify-end mb-4">

                    {!donadorInactivo && (
                      <Boton
                        onClick={() => abrirModal(periodo)}
                        icon={<Plus className="w-4 h-4" />}
                      >
                        Agregar Donativo
                      </Boton>
                    )}

                  </div>

                  {!hayRegistros ? (

                    <div className="text-center py-8 text-slate-500">
                      Sin registros
                    </div>

                  ) : (
                    <>

                      <div className="mb-4">

                        <FiltrosTabla
                          searchValue={search}
                          searchPlaceholder="Buscar por concepto..."
                          onSearchChange={(value) => handleSearchChange(periodo.id_periodo, value)}
                          onClearFilters={() => handleSearchChange(periodo.id_periodo, "")}
                        />

                      </div>

                      <div className="w-full overflow-x-auto rounded-xl border border-slate-100">
                        <DonativoTabla
                          donativos={dataPaginada}
                          onEditar={abrirModalEditar}
                        />
                      </div>

                      <PaginacionTabla
                        currentPage={currentPage}
                        totalPages={totalPages}
                        totalItems={items.length}
                        pageSize={PAGE_SIZE}
                        onPageChange={(page) => changePage(periodo.id_periodo, page)}
                      />

                    </>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* MODAL CREAR */}
      <ModalDonativo
        open={showModal}
        onClose={cerrarModal}
        form={form}
        setForm={setForm}
        error={errorForm}
        saving={saving}
        modo="crear"
        onSubmit={() =>
          handleSubmitClick("CREAR")
        }
      />

      {/* MODAL EDITAR */}
      <ModalDonativo
        open={showModalEditar}
        onClose={() =>
          setShowModalEditar(false)
        }
        form={form}
        setForm={setForm}
        error={errorForm}
        saving={saving}
        modo="editar"
        onSubmit={() =>
          handleSubmitClick("EDITAR")
        }
      />

      {/* MODAL CONFIRMACION */}
      <ModalConfirmacion
        open={modalConf.open}
        title="¿Confirmar registro?"
        description="Estás a punto de guardar la información del donativo. ¿Deseas continuar?"
        onConfirm={handleConfirmarGuardado}
        onClose={() =>
          setModalConf({
            open: false,
            data: null,
          })
        }
        loading={loading}
        color="teal"
      />

      {/* MODAL RESULTADO */}
      <ModalResultado
        open={modalRes.open}
        type={modalRes.type}
        title={modalRes.title}
        message={modalRes.message}
        onClose={() =>
          setModalRes({
            ...modalRes,
            open: false,
          })
        }
      />
    </div>
  );
}

