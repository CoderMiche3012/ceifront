import React from 'react';
import logoCei from "../../../assets/imagenes/logo.png";

const OPCIONES_PAREDES = [
    ["Lámina", "Tin"],
    ["Adobe", "Mud bricks"],
    ["Tabique", "Brick"],
    ["Cartón", "Cardboard"],
    ["Otros", "Others"]
];

const OPCIONES_TECHO = [
    ["Lámina", "Tin"],
    ["Construcción", "Concrete"],
    ["Cartón", "Cardboard"],
    ["Otros", "Others"]
];

const OPCIONES_PISO = [
    ["Tierra", "Dirt"],
    ["Cemento", "Cement"],
    ["Mosaico", "Tiles"],
    ["Loseta", "Ceramic"]
];

const OPCIONES_SERVICIOS = [
    ["Agua potable", "Drinking water"],
    ["Luz", "Electricity"],
    ["Alumbrado público", "Street lighting"],
    ["Pavimento", "Pavement"],
    ["Seguridad o Vigilancia", "Security or Surveillance"]
];

const OPCIONES_COCINA = [
    ["Lámina", "Tin"],
    ["Tabicón", "Bricks"],
    ["Madera", "Wood"],
    ["Cartón", "Cardboard"],
    ["Construcción Completa", "Complete Construction"]
];

const OPCIONES_BANO = [
    ["Lámina", "Tin"],
    ["Tabicón", "Bricks"],
    ["Madera", "Wood"],
    ["Cartón", "Cardboard"]
];

const OPCIONES_SERVICIOS_EXTRA = [
    ["Fosa séptica", "Latrine"],
    ["Letrina", "Latrine"],
    ["Baño ecológico", "Ecological toilet"]
];

const ALIMENTOS = [
    ["Carnes rojas", "Beef"],
    ["Pollo", "Chicken"],
    ["Pescado", "Fish"],
    ["Huevos", "Eggs"],
    ["Leche", "Milk"],
    ["Frijol", "Beans"],
    ["Pastas", "Pasta"],
    ["Arroz", "Rice"],
    ["Enlatados", "Canned food"],
    ["Verduras", "Vegetables"],
    ["Tortillas y pan", "Bread"]
];

const FormatoImpresionComponent = React.forwardRef(({ postulante }, ref) => {
    if (!postulante) return null;
    const { expediente, fecha_visita, fecha_nacimiento, tutor_nombre, tutor_telefono } = postulante;
    const familia = expediente?.familia || [];
    const direccion = postulante?.expediente?.direccion;
    const geo = direccion?.geografia;
    const fechaEncuesta = fecha_visita
        ? new Date(fecha_visita).toLocaleDateString()
        : "________________";

    const totalPersonasEnCasa =
        1 + familia.filter(f => f.vive_en_casa === true).length;

    const contactosFamilia = familia
        .filter(f => f.telefono) // solo los que tienen teléfono
        .map(f => `${f.parentesco} ${f.nombre}: ${f.telefono}`)
        .join(", ");

    const calcularEdad = (fechaNacimiento) => {
        if (!fechaNacimiento) return "--";
        const hoy = new Date();
        const cumple = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - cumple.getFullYear();
        const m = hoy.getMonth() - cumple.getMonth();
        if (m < 0 || (m === 0 && hoy.getDate() < cumple.getDate())) {
            edad--;
        }
        return edad;
    };

    return (
        <div ref={ref} className="bg-white text-[11px] leading-tight text-black font-sans mt-[5.5mm] print:mt-[5.5mm] p-10 print:px-4 print:pb-4 print:pt-0 break-inside-avoid-page page-break-inside-avoid">
            <div className="mb-4">
                {/* Encabezado */}
                <div className="flex items-center mb-4">

                    {/* Logo SIN contorno */}
                    <div className="flex items-center justify-center w-1/3">
                        <img
                            src={logoCei}
                            alt="Logo CEI"
                            className="h-28 object-contain"
                        />
                    </div>
                    <div className="w-2/3">
                        <div className="border border-black text-center py-2">
                            <h1 className="text-base font-bold tracking-wide">
                                ESTUDIO SOCIOECONÓMICO FAMILIAR
                            </h1>
                            <p className="text-[10px] italic">
                                FAMILY INTAKE ASSESSMENT
                            </p>
                        </div>
                    </div>

                </div>
            </div>
            <div className="text-right mb-4">
                <p>
                    Fecha de la encuesta / Date of register:{" "}
                    <span className="border-b border-black inline-block min-w-[150px] text-center">
                        {fechaEncuesta}
                    </span>
                </p>
            </div>

            {/* Sección de Datos Personales en una sola línea */}
            <div className="mt-4 text-slate-800 border-b border-slate-300 pb-3">
                <div className="flex flex-row items-baseline gap-x-4 flex-nowrap">

                    {/* Contenedor Nombre */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            Nombre del niño / <span className="text-[10px] italic font-normal text-slate-600">Name:</span>
                        </span>
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            {postulante.expediente?.nombre} {postulante.expediente?.apellido_p} {postulante.expediente?.apellido_m}
                        </span>
                    </div>

                    {/* Contenedor Edad */}
                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            Edad / <span className="text-[10px] italic font-normal text-slate-600">Age:</span>
                        </span>
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            {calcularEdad(postulante.expediente?.fecha_nacimiento)} años
                        </span>
                    </div>

                    <div className="flex items-baseline gap-2">
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            Grado Esc./ <span className="text-[10px] italic font-normal text-slate-600">Level School:</span>
                        </span>
                        <span className="text-[11px] font-bold whitespace-nowrap">
                            {postulante.grado_escolar_inicial} ° {postulante.nivel_escolar_inicial}
                        </span>
                    </div>

                </div>
            </div>
            {/* Tabla de Estructura Familiar */}
            <div className="mt-6">
                <table className="w-full border-collapse border border-black">
                    <thead>
                        <tr className="bg-slate-50">
                            <th className="border border-black p-1 text-[9px] w-[25%]">Nombre / <br /><span className="italic lowercase">Name</span></th>
                            <th className="border border-black p-1 text-[9px] w-[15%]">Parentesco / <br /><span className="italic lowercase">Relationship</span></th>
                            <th className="border border-black p-1 text-[9px] w-[10%]">Edad / <br /><span className="italic lowercase">Age</span></th>
                            <th className="border border-black p-1 text-[9px] w-[20%]">Ocupación o grado escolar / <br /><span className="italic lowercase">Occupation</span></th>
                            <th className="border border-black p-1 text-[9px] w-[15%]">Salario o Escuela / <br /><span className="italic lowercase">Monthly Income</span></th>
                        </tr>
                    </thead>
                    <tbody>
                        {familia.length > 0 ? (
                            familia.map((miembro, index) => (
                                <tr key={index} className="text-center h-8">
                                    <td className="border border-black p-1 text-[10px] text-left">{miembro.nombre} {miembro.apellido_p} {miembro.apellido_m}</td>
                                    <td className="border border-black p-1 text-[10px]">{miembro.parentesco}</td>
                                    <td className="border border-black p-1 text-[10px]">{miembro.fecha_nacimiento ? `${calcularEdad(miembro.fecha_nacimiento)} años` : "--"}</td>
                                    <td className="border border-black p-1 text-[10px]">{miembro.actividad_principal || "---"}</td>
                                    <td className="border border-black p-1 text-[10px]">${miembro.salario || "0.00"}</td>
                                </tr>
                            ))
                        ) : (
                            // Filas vacías para llenado manual si no hay datos
                            [...Array(5)].map((_, i) => (
                                <tr key={i} className="h-8">
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                    <td className="border border-black p-1"></td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
                <p className="text-[11px] font-bold text-slate-500">
                    Total de personas en el hogar:{" "}
                    <span className="text-[11px] font-bold text-slate-500">
                        {totalPersonasEnCasa}
                    </span>
                </p>
                <p className="text-[11px] font-bold text-slate-500">
                    Dirección:{" "}
                    <span className="text-[11px] font-bold text-slate-500">
                        Calle {direccion?.calle || "____"}, #
                        {direccion?.numero || "____"},
                        Col. {geo?.colonia || "____"},
                        {geo?.municipio || "____"},
                        C.P {geo?.codigo_postal || "____"}
                    </span>
                </p>
                <p className="text-[11px] font-bold text-slate-500">
                    Referencia:{" "}
                    <span className="text-[11px] font-bold text-slate-500">
                        {postulante.estudio?.referencia_casa || ""}
                    </span>
                </p>
                <p className="text-[11px] font-bold text-slate-500">
                    ¿Por medio de quien se enteró del Programa?{" "}
                    <span className="text-[11px] font-bold text-slate-500">
                        {postulante.estudio?.referencia_ingreso || ""}
                    </span>
                </p>
                <p className="text-[11px] font-bold text-slate-500">
                    ¿Sus hijos son del mismo padre, o ha tenido diferentes parejas?{" "}
                </p>
            </div>
            <div className="mt-4 text-[11px]">
                {/* Estado civil */}
                <div className="mb-2">
                    <p className="font-bold">
                        Estado civil actual de los padres /
                        <span className="text-[11px] italic font-normal text-slate-600">Marital  status of parents now:</span>
                    </p>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-[11px]">

                        {/* Unión libre */}
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border border-black"></span>
                            <span>Unión libre/</span>
                            <span className="italic text-slate-600">Living together</span>
                        </div>

                        {/* Separados */}
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border border-black"></span>
                            <span>Separados/</span>
                            <span className="italic text-slate-600">Divorced</span>
                        </div>

                        {/* Madre soltera */}
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border border-black"></span>
                            <span>Madre soltera/</span>
                            <span className="italic text-slate-600">Single Mother</span>
                        </div>

                        {/* Casados */}
                        <div className="flex items-center gap-1">
                            <span className="inline-block w-3 h-3 border border-black"></span>
                            <span>Casados/</span>
                            <span className="italic text-slate-600">Married</span>
                        </div>

                        {/* Otro */}
                        <div className="flex items-center gap-1">
                            <span>Otro:</span>
                            <span className="border-b border-black inline-block min-w-[120px]"></span>
                        </div>

                    </div>
                </div>

                {/* Familia en programa */}
                <p className="font-bold">
                    ¿Tiene algún otro miembro de su familia en el programa? /
                    <span className="text-[11px] italic font-normal text-slate-600">do you have any other family members in the program?</span>
                </p>

                {/* Tipo de casa */}
                <div className="mb-2">
                    <div className="flex items-center gap-3 text-[10px]">

                        <p className="font-bold whitespace-nowrap">
                            Su casa es /
                            <span className="italic text-slate-600"> Your house is:</span>
                        </p>

                        {[
                            ["Rentada", "Rented"],
                            ["Prestada", "Borrowed"],
                            ["Propia", "Own"]
                        ].map(([es, en], i) => (
                            <div key={i} className="flex items-center gap-1 whitespace-nowrap">
                                <span className="w-3 h-3 border border-black"></span>
                                <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                            </div>
                        ))}

                    </div>
                </div>

                {/* Renta */}
                <p className="font-bold">
                    Si paga renta, ¿cuánto paga mensualmente? /
                    <span className="text-[11px] italic font-normal text-slate-600">If you pay rent, how much do you pay monthly?</span>
                </p>

                <p className="font-bold text-[11px] border-b border-black leading-none inline mb-0 pb-0">
                    Tipo de construcción de la casa /
                    <span className="text-[12px] italic font-normal text-slate-600 ml-1">
                        Type of construction
                    </span>
                </p>

                <div className="mt-4 text-[10px] leading-tight space-y-1">

                    {/* PAREDES */}
                    <div>
                        <p className="font-bold">
                            ¿De qué tipo de material son las paredes? /
                            <span className="italic text-slate-600"> What kind of material are the walls?</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_PAREDES.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* TECHO */}
                    <div>
                        <p className="font-bold">
                            ¿De qué tipo de material es el techo? /
                            <span className="italic text-slate-600"> What kind of material is the roof made of?</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_TECHO.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* PISO */}
                    <div>
                        <p className="font-bold">
                            ¿De qué tipo de material es el piso? /
                            <span className="italic text-slate-600"> What kind of material is the floor made of?</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_PISO.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* CUARTOS */}
                    <div className="flex items-center gap-2">
                        <p className="font-bold">
                            ¿Cuántos cuartos tiene la casa? /
                            <span className="italic text-slate-600"> How many rooms does your house have?</span>
                        </p>
                        <span className="border-b border-black min-w-[40px] inline-block"></span>
                    </div>

                    <div className="flex items-center gap-2">
                        <p className="">
                            N° de camas /
                            <span className="italic text-slate-600"> Number of beds</span>
                        </p>
                        <span className="border-b border-black min-w-[40px] inline-block"></span>
                        <p className="">
                            Otros /
                            <span className="italic text-slate-600"> Other</span>
                        </p>
                        <span className="border-b border-black min-w-[40px] inline-block"></span>
                    </div>

                    {/* COCINA */}
                    <div>
                        <p className="font-bold">
                            ¿De qué material está hecha la cocina? /
                            <span className="italic text-slate-600"> What kind of material is the kitchen made of?</span>
                        </p>

                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_COCINA.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-3 h-3 border border-black"></span>
                            <span>
                                No hay cocina /
                                <span className="italic text-slate-600"> There is no kitchen</span>
                            </span>
                        </div>
                    </div>

                    {/* BAÑO */}
                    <div>
                        <p className="font-bold">
                            ¿Qué tipo de material tiene el baño? /
                            <span className="italic text-slate-600"> What kind of material does the bathroom have?</span>
                        </p>

                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_BANO.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 mt-1">
                            <span className="w-3 h-3 border border-black"></span>
                            <span>
                                Construcción completa (regadera, lavamanos, wc, azulejo) /
                                <span className="italic text-slate-600"> Complete construction (shower, toilet, tiles)</span>
                            </span>
                        </div>
                    </div>

                    {/* FAMILIAS BAÑO */}
                    <div className="flex items-center gap-2">
                        <p className="font-bold">
                            ¿Cuántas familias comparten el baño? /
                            <span className="italic text-slate-600"> How many families share the bathroom?</span>
                        </p>
                        <span className="border-b border-black min-w-[40px] inline-block"></span>
                    </div>

                    {/* UBICACIÓN BAÑO */}
                    <div className="flex items-center gap-4 text-[10px] break-inside-avoid-page">

                        <p className="font-bold whitespace-nowrap">
                            ¿Dónde se localiza el baño? /
                            <span className="italic text-slate-600"> Where is the bathroom located?</span>
                        </p>

                        <div className="flex items-center gap-3 whitespace-nowrap">
                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 border border-black"></span>
                                <span>Baño interior / <span className="italic text-slate-600">Inside</span></span>
                            </div>

                            <div className="flex items-center gap-1">
                                <span className="w-3 h-3 border border-black"></span>
                                <span>Baño exterior / <span className="italic text-slate-600">Outside</span></span>
                            </div>
                        </div>

                    </div>

                    {/* DRENAJE */}
                    <div>
                        <div className="flex items-center gap-4 text-[10px] break-inside-avoid-page">

                            <p className="font-bold whitespace-nowrap">
                                ¿Cuenta con drenaje? /
                                <span className="italic text-slate-600"> Does the house have drainage?</span>
                            </p>

                            <div className="flex items-center gap-3 whitespace-nowrap">
                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>Sí / <span className="italic text-slate-600">Yes</span></span>
                                </div>

                                <div className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>No</span>
                                </div>
                            </div>

                        </div>

                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_SERVICIOS_EXTRA.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* SERVICIOS */}
                    <div className="flex items-center gap-4 text-[10px] break-inside-avoid-page">
                        <p className="font-bold">
                            ¿Con qué servicios se cuenta? /
                            <span className="italic text-slate-600"> What services are available?</span>
                        </p>
                        <div className="flex flex-wrap gap-3 mt-1">
                            {OPCIONES_SERVICIOS.map(([es, en], i) => (
                                <div key={i} className="flex items-center gap-1">
                                    <span className="w-3 h-3 border border-black"></span>
                                    <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                                </div>
                            ))}
                            <p className="">
                                Otros /
                                <span className="italic text-slate-600"> Other</span>
                            </p>
                            <span className="border-b border-black min-w-[40px] inline-block"></span>
                        </div>
                    </div>

                    <div className="flex items-center gap-4 text-[10px] break-inside-avoid-page">

                        <p className="font-bold whitespace-nowrap">
                            ¿Cuánto gasta en agua cada mes? /
                            <span className="italic text-slate-600"> How much do you spend in water monthly?</span>
                        </p>

                        <div className="flex items-center gap-3 whitespace-nowrap">
                            <span>
                                Garrafón / <span className="italic text-slate-600">bottle</span> $
                                <span className="border-b border-black inline-block min-w-[50px] ml-1"></span>
                            </span>

                            <span>
                                Red / <span className="italic text-slate-600">network</span> $
                                <span className="border-b border-black inline-block min-w-[50px] ml-1"></span>
                            </span>

                            <span>
                                Pipa / <span className="italic text-slate-600">tank</span> $
                                <span className="border-b border-black inline-block min-w-[50px] ml-1"></span>
                            </span>
                        </div>

                    </div>
                    <div className="flex items-center gap-6 text-[10px] whitespace-nowrap break-inside-avoid-page">

                        <span className="font-bold">
                            ¿Cuánto gasta en luz cada mes? /
                            <span className="italic text-slate-600"> Electricity monthly?</span>
                        </span>
                        $
                        <span className="border-b border-black inline-block min-w-[60px] ml-1"></span>

                        <span className="font-bold ml-4">Gas</span> $
                        <span className="border-b border-black inline-block min-w-[60px] ml-1"></span>

                    </div>
                    <div className="flex items-center gap-4 text-[10px] break-inside-avoid-page">

                        <p className="font-bold whitespace-nowrap">
                            ¿Cuánto gasta en teléfono cada mes? /
                            <span className="italic text-slate-600"> How much do you spend in telephone monthly?</span>
                        </p>

                        <div className="flex items-center gap-3 whitespace-nowrap ">
                            <span>
                                Recargas / <span className="italic text-slate-600">mobile</span> $
                                <span className="border-b border-black inline-block min-w-[50px] ml-1"></span>
                            </span>

                            <span>
                                Local / <span className="italic text-slate-600">homeline</span> $
                                <span className="border-b border-black inline-block min-w-[50px] ml-1"></span>
                            </span>
                        </div>

                    </div>
                    <div className="flex items-center gap-4 text-[10px] whitespace-nowrap break-inside-avoid-page">

                        <span className="font-bold">
                            ¿Cuánto gasta toda la familia en transporte? /
                            <span className="italic text-slate-600"> Transport per week?</span>
                        </span>

                        <span>
                            Semana / <span className="italic text-slate-600">week</span> $
                            <span className="text-[11px] font-bold whitespace-nowrap">
                                {(postulante.estudio?.gastos?.[0]?.monto ?? 0) / 4}
                            </span>
                        </span>

                        <span>
                            Mes / <span className="italic text-slate-600">month</span> $
                            <span className="text-[11px] font-bold whitespace-nowrap">
                                {postulante.estudio?.gastos?.[0]?.monto ?? 0}
                            </span>
                        </span>

                    </div>

                    <div className="flex items-center gap-4 text-[10px] whitespace-nowrap mt-1 break-inside-avoid-page">
                        <span className="font-bold">
                            ¿Cuánto gasta en comida para la familia? /
                            <span className="italic text-slate-600"> Food per week?</span>
                        </span>
                        <span>
                            Semana / <span className="italic text-slate-600">week</span> $
                            <span className="text-[11px] font-bold whitespace-nowrap">
                                {(postulante.estudio?.gastos?.[1]?.monto ?? 0) / 4}
                            </span>
                        </span>
                        <span>
                            Mes / <span className="italic text-slate-600">month</span> $
                            <span className="text-[11px] font-bold whitespace-nowrap">
                                {postulante.estudio?.gastos?.[1]?.monto ?? 0}
                            </span>
                        </span>
                    </div>
                    <div className="flex items-center gap-4 text-[10px] flex-wrap break-inside-avoid-page">

                        <span className="font-bold">
                            ¿Qué aparatos electrónicos tiene? /
                            <span className="italic text-slate-600"> Electronic appliances?</span>
                        </span>

                        {[
                            ["Televisión", "TV"],
                            ["Estéreo", "Stereo"],
                            ["DVD", "DVD"],
                            ["Computadora", "Computer"],
                            ["Teléfono", "Cell phone"]
                        ].map(([es, en], i) => (
                            <div key={i} className="flex items-center gap-1 whitespace-nowrap">
                                <span className="w-3 h-3 border border-black"></span>
                                <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                            </div>
                        ))}

                        <span>
                            Otros / <span className="italic text-slate-600">Others:</span>
                            <span className="border-b border-black inline-block min-w-[80px] ml-1"></span>
                        </span>

                    </div>
                    <div className="flex items-center gap-4 text-[10px] flex-wrap break-inside-avoid-page print:mt-8">

                        <span className="font-bold">
                            ¿Qué tipo de electrodomésticos tiene? /
                            <span className="italic text-slate-600"> Household appliances?</span>
                        </span>

                        {[
                            ["Estufa", "Stove"],
                            ["Parrilla", "Grill"],
                            ["Refrigerador", "Refrigerator"],
                            ["Microondas", "Microwaves"],
                            ["Licuadora", "Blender"],
                            ["Plancha", "Iron"],
                            ["Lavadora", "Washing machine"]
                        ].map(([es, en], i) => (
                            <div key={i} className="flex items-center gap-1 whitespace-nowrap">
                                <span className="w-3 h-3 border border-black"></span>
                                <span>{es}/<span className="italic text-slate-600">{en}</span></span>
                            </div>
                        ))}

                        <span>
                            Otros / <span className="italic text-slate-600">Others:</span>
                            <span className="border-b border-black inline-block min-w-[80px] ml-1"></span>
                        </span>

                    </div>

                </div>
                <div className="mt-3 text-[10px] break-inside-avoid-page">
                    <div className="mt-3 text-[10px]">
                        {/* Título */}
                        <p className="font-bold mb-1">
                            Con qué frecuencia come lo siguiente: /
                            <span className="italic text-slate-600"> How frequently do you eat the following:</span>
                        </p>

                        {/* Encabezados */}
                        <div className="grid grid-cols-4 gap-2 font-bold text-center">
                            <span></span>
                            <span>Cada 3 días<br /><span className="italic font-normal">Every 3 days</span></span>
                            <span>Cada 8 días<br /><span className="italic font-normal">Every 8 days</span></span>
                            <span>Cada 15 días<br /><span className="italic font-normal">Every 15 days</span></span>
                        </div>

                        {/* Filas */}
                        {ALIMENTOS.map(([es, en], i) => (
                            <div key={i} className="grid grid-cols-4 gap-2 items-center mt-1">

                                {/* Nombre */}
                                <span>
                                    {es} / <span className="italic text-slate-600">{en}</span>
                                </span>

                                {/* Opciones */}
                                {[1, 2, 3].map((_, j) => (
                                    <div key={j} className="flex justify-center">
                                        <span className="w-3 h-3 border border-black"></span>
                                    </div>
                                ))}

                            </div>
                        ))}

                    </div>
                </div>

                <div className="mt-3 text-[10px] space-y-2">

                    <span className="font-bold">
                        ¿Qué tipo de comida se encontró en la casa? /
                        <span className="italic text-slate-600"> What kind of food was found in the house?</span>
                    </span>
                    <div className="flex items-center gap-3">
                        <span className="font-bold">
                            ¿Tiene algún familiar con enfermedades crónicas/degenerativas o alguna discapacidad? /
                            <span className="italic text-slate-600"> Do you have any family members with chronic/degenerative diseases or any disability?</span>
                        </span>

                        <span>SI</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>NO</span>
                        <span className="w-3 h-3 border border-black"></span>
                    </div>
                    <span className="font-bold">
                        ¿Cuál es el diagnóstico? /
                        <span className="italic text-slate-600"> What is the diagnosis?</span>
                        <span className="border-b border-black inline-block min-w-[100px] ml-1"></span>
                    </span>
                    <span className="font-bold">
                        ¿Qué tipos de cuidado necesita?/
                        <span className="italic text-slate-600"> What types of care does he/she need??</span>
                        <span className="border-b border-black inline-block min-w-[100px] ml-1"></span>
                    </span>

                    <div className="flex items-center gap-3">
                        <span className="font-bold">
                            ¿Tienes seguro popular? /
                            <span className="italic text-slate-600"> Do you have medical insurance?</span>
                        </span>

                        <span>SI</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>NO</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>IMSS</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>ISSSTE</span>
                        <span className="w-3 h-3 border border-black"></span>
                        <span>
                            Otros / <span className="italic text-slate-600">Others:</span>
                            <span className="border-b border-black inline-block min-w-[80px] ml-1"></span>
                        </span>

                    </div>

                    <p className="font-bold">
                        ¿El responsable o madre cuenta con algún método anticonceptivo? /
                        <span className="italic text-slate-600"> Contraceptive method?</span>
                    </p>
                    <span className="border-b border-black inline-block w-full"></span>

                    <p className="font-bold">
                        En caso de ser contactados, ¿con quién se puede comunicar? /
                        <span className="italic text-slate-600">
                            In case of contact, who can be reached?
                        </span>
                    </p>

                    <p className="border-b border-black inline-block w-full">
                        {contactosFamilia || "__________________________"}
                    </p>
                    <p className="font-bold">
                        Motivos Por los que considera que necesita el apoyo /
                        <span className="italic text-slate-600"> Reasons why you feel you need the support</span>
                    </p>
                    <div className="flex items-center gap-3">


                        <span>Continuar mis estudios</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>Situación económica limitada</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span>Gastos médicos o familiares</span>
                        <span className="w-3 h-3 border border-black"></span>

                        <span className="w-3 h-3 border border-black"></span>
                        <span>
                            Otros / <span className="italic text-slate-600">Others:</span>
                            <span className="border-b border-black inline-block min-w-[80px] ml-1"></span>
                        </span>

                    </div>
                    <p className="font-bold">
                        Situación especial de la familia /
                        <span className="italic text-slate-600"> Special situation of the family</span>
                    </p>
                    <span className="border-b border-black inline-block w-full"></span>
                    <p className="font-bold">
                        Nombre y firma de la persona que realizó el estudio /
                        <span className="italic text-slate-600"> Name and signature of the person who conducted the study</span>
                    </p>

                </div>

            </div>
        </div>
    );
});
export const FormatoImpresion = React.memo(FormatoImpresionComponent);



