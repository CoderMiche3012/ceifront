import { useState } from "react";

import EncabezadoPagina from "../../components/shared/EncabezadoPagina";

import ReporteBeneficiariosTab from "./components/BeneficiariosGeneral";
import ReporteAcademicoTab from "./components/ReporteAcademicoTab";
import ReporteApoyosEconomicosTab from "./components/ReporteApoyosEconomicosTab";

export default function ReporteBeneficiarios() {
    const [tabActiva, setTabActiva] = useState("general");

    return (
        <div className="space-y-6">
            <EncabezadoPagina
                titulo="Reporte de Donativos"
                descripcion="Consulta, filtra y exporta información relacionada con los donativos registrados."
            />

            <div className="border-b border-gray-200">
                <nav className="flex gap-2">
                    <button
                        onClick={() => setTabActiva("general")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === "general"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        General
                    </button>
                    <button
                        onClick={() => setTabActiva("rendimiento")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === "rendimiento"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Rendimiento Economico
                    </button>
                    <button
                        onClick={() => setTabActiva("apoyos")}
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${tabActiva === "apoyos"
                                ? "border-blue-600 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`}
                    >
                        Apoyos economicos
                    </button>
                    
                </nav>
            </div>

            {tabActiva === "general" && <ReporteBeneficiariosTab />}
            {tabActiva === "rendimiento" && <ReporteAcademicoTab />}
            {tabActiva === "apoyos" && <ReporteApoyosEconomicosTab />}

        </div>
    );
}