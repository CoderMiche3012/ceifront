import { useState, useRef, useEffect } from "react";

import {
  MoreVertical,
  CalendarPlus,
  CheckCircle,
  FileText,
  CalendarClock,
  Ban,
} from "lucide-react";

import { ui } from "../../../../styles/ui/index";

import ModalResultado from "../../../../components/shared/ModalResultado";
import ModalConfirmacion from "../../../../components/shared/ModalConfirmacion";
import { useAccionesVisita } from "../../hooks/useAccionesVisita";

import {
  FormAgendar,
  FormFinalizar,
  FormCancelar,
} from "../modales/VisitaForms";

import EstudioCard from "../detalles/visitas/EstudioCard";

export default function AccionesPostulante({ item, idPostulante = null }) {

  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef(null);

  const {
    modalMode,
    setModalMode,
    loading,
    formData,
    setFormData,
    result,
    setResult,
    ejecutarAccion,
  } = useAccionesVisita(item, idPostulante);

  const estatus = item?.estado_visita?.toLowerCase() || "no agendada";

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener(
        "scroll",
        () => setMenuOpen(false),
        { passive: true }
      );
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", () => setMenuOpen(false));
    };
  }, [menuOpen]);

  const handleAction = (mode) => {
    setModalMode(mode);
    setMenuOpen(false);
  };

  const btnClass =
    "flex w-full items-center gap-2 px-4 py-2 text-sm transition-colors";

  const renderOpciones = () => {
    switch (estatus) {
      case "no agendada":
        return (
          <button
            onClick={() => handleAction("agendar")}
            className={`${btnClass} text-blue-600 hover:bg-blue-50`}
          >
            <CalendarPlus size={16} />
            Programar visita
          </button>
        );

      case "programada":
        return (
          <>
            <button
              onClick={() => handleAction("finalizar")}
              className={`${btnClass} text-green-600 hover:bg-green-50`}
            >
              <CheckCircle size={16} />
              Marcar como realizada
            </button>

            <button
              onClick={() => handleAction("agendar")}
              className={`${btnClass} text-amber-600 hover:bg-amber-50`}
            >
              <CalendarClock size={16} />
              Reprogramar
            </button>

            <button
              onClick={() => handleAction("cancelar")}
              className={`${btnClass} text-red-600 hover:bg-red-50`}
            >
              <Ban size={16} />
              Cancelar
            </button>
          </>
        );

      case "realizada":
        return (
          <button
            onClick={() => handleAction("capturar_estudio")}
            className={`${btnClass} text-indigo-600 hover:bg-indigo-50`}
          >
            <FileText size={16} />
            Capturar Estudio
          </button>
        );

      default:
        return (
          <button
            onClick={() => handleAction("agendar")}
            className={`${btnClass} text-amber-600 hover:bg-amber-50`}
          >
            <CalendarClock size={16} />
            Reintentar Visita
          </button>
        );
    }
  };

  const renderModal = () => {
    if (!modalMode) return null;

    if (modalMode === "capturar_estudio") {
      return (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-2xl">
            <div className={ui.modal.formContainer}>

              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-indigo-100 text-indigo-600`}>
                  <FileText size={22} />
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    Capturar estudio socioeconómico
                  </h2>
                  <p className={ui.modal.description}>
                    Revisa la información del postulante
                  </p>
                </div>

                <button
                  onClick={() => setModalMode(null)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  ✕
                </button>
              </div>

              <div className={ui.modal.formBody}>
                <div className={ui.modal.formScroll}>
                  <EstudioCard data={item} />
                </div>

                <div className={ui.modal.formActions}>
                  <button
                    onClick={() => setModalMode(null)}
                    className="px-4 py-2 rounded-xl bg-slate-100"
                  >
                    Cerrar
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      );
    }

    const config = {
      agendar: {
        title: "Programar visita",
        icon: <CalendarPlus size={22} />,
        color: "bg-[#0E5F63]/10 text-[#0E5F63]",
        form: (
          <FormAgendar data={formData} onChange={setFormData} />
        ),
      },
      finalizar: {
        title: "Finalizar visita",
        icon: <CheckCircle size={22} />,
        color: "bg-green-100 text-green-600",
        form: (
          <FormFinalizar data={formData} onChange={setFormData} />
        ),
      },
      cancelar: {
        title: "Cancelar visita",
        icon: <Ban size={22} />,
        color: "bg-red-100 text-red-600",
        form: (
          <FormCancelar data={formData} onChange={setFormData} />
        ),
      },
    };

    const current = config[modalMode];

    return (
      <div className={ui.modal.formOverlay}>
        <div className="w-full max-w-xl">
          <div className={ui.modal.formContainer}>

            <div className={ui.modal.formHeader}>
              <div className={`${ui.modal.iconWrapper} ${current.color}`}>
                {current.icon}
              </div>

              <div className="flex-1">
                <h2 className={ui.modal.title}>{current.title}</h2>
                <p className={ui.modal.description}>
                  Completa la información
                </p>
              </div>

              <button
                onClick={() => setModalMode(null)}
                className="p-2 hover:bg-slate-100 rounded-xl"
              >
                ✕
              </button>
            </div>

            <div className={ui.modal.formBody}>
              <div className={ui.modal.formScroll}>
                {current.form}
              </div>

              <div className={ui.modal.formActions}>
                <button
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => setConfirmOpen(true)}
                  disabled={loading}
                  className="px-4 py-2 rounded-xl bg-[#0E5F63] text-white"
                >
                  {loading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${menuOpen
            ? "bg-slate-200 text-slate-700"
            : "text-slate-500 hover:bg-slate-100"
          }`}
      >
        <MoreVertical size={18} />
      </button>

      {/* MENU */}
      {menuOpen && (
        <div
          className="fixed z-[9999] w-56 rounded-xl border border-slate-200 bg-white shadow-2xl"
          style={{
            top:
              menuRef.current?.getBoundingClientRect().top + 35 + "px",
            left:
              menuRef.current?.getBoundingClientRect().left - 200 + "px",
          }}
        >
          <div className="py-1">
            <div className="my-1 border-t border-slate-100" />
            {renderOpciones()}
          </div>
        </div>
      )}

      {renderModal()}
      {confirmOpen && (
        <div className={ui.modal.formOverlay}>
          <div className="w-full max-w-md">
            <div className={ui.modal.formContainer}>

              <div className={ui.modal.formHeader}>
                <div className={`${ui.modal.iconWrapper} bg-amber-100 text-amber-600`}>
                  ⚠️
                </div>

                <div className="flex-1">
                  <h2 className={ui.modal.title}>
                    Confirmar acción
                  </h2>
                  <p className={ui.modal.description}>
                    ¿Seguro que deseas continuar?
                  </p>
                </div>

                <button
                  onClick={() => setConfirmOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-xl"
                >
                  ✕
                </button>
              </div>

              <div className={ui.modal.formBody}>
                <div className="text-sm text-slate-600">
                  Esta acción se aplicará al registro actual.
                </div>

                <div className={ui.modal.formActions}>
                  <button
                    onClick={() => setConfirmOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-100"
                  >
                    Cancelar
                  </button>

                  <button
                    onClick={async () => {
                      setConfirmOpen(false);
                      await ejecutarAccion();
                    }}
                    disabled={loading}
                    className="px-4 py-2 rounded-xl bg-[#0E5F63] text-white"
                  >
                    {loading ? "Procesando..." : "Confirmar"}
                  </button>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      <ModalResultado
        {...result}
        onClose={() =>
          setResult((prev) => ({ ...prev, open: false }))
        }
      />
    </div>
  );
}
