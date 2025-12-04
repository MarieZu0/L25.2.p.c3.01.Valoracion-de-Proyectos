import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mPuntuacion from "./Cl_mPuntuacion.js";
import Cl_mJurado from "./Cl_mJurado.js";
export default class mPrincipal {
    constructor() {
        this.tbJurado = "Jurado";
        this.tbPuntuacion = "Puntuacion";
        // Lista de todos los equipos disponibles
        this.equiposDisponibles = [
            "TheGitGuardians", "SigmaDev", "ATLAS", "THE CODE RANGERS",
            "Advanced One Logic", "HyperLinkBlocked", "Bug Busters",
            "PowerSquad", "CodeBreakers", "TeraNexus Core",
            "Brothers of Matrix", "InitCode", "SevenPixels&TwoBugs"
        ];
        this.db = new Cl_dcytDb({ aliasCuenta: "TERANEXUS CORE" });
        this.Jurados = [];
        this.Puntuacion = [];
    }
    addJurado({ dtJurado, callback, }) {
        let Jurado = new Cl_mJurado(dtJurado);
        // Validar que no exista otra Jurado con el mismo código
        // Validar que la Jurado sea correcta
        if (!Jurado.juradoOk)
            callback(" Jurado no es correcta.");
        // Guardar la Jurado
        else
            this.db.addRecord({
                tabla: this.tbJurado,
                registroAlias: dtJurado.nombre, // Usar nombre como alias único (permite múltiples de misma categoría)
                object: Jurado,
                callback: ({ id, objects: Jurados, error }) => {
                    if (!error) {
                        this.llenarJurados(Jurados);
                        this.sincronizarWebStorage(); // 💾 Guardar en web storage
                        console.log("✅ MODELO - Jurado agregado y sincronizado");
                    }
                    console.log("ID nuevo Jurado:", this.Jurados);
                    callback === null || callback === void 0 ? void 0 : callback(error);
                },
            });
    }
    editJurado({ dtJurado, callback, }) {
        let Jurado = new Cl_mJurado(dtJurado);
        // Validar que la Jurado sea correcta
        if (!Jurado.juradoOk)
            callback("El Jurado no es correcto.");
        else
            this.db.editRecord({
                tabla: this.tbJurado,
                object: Jurado,
                callback: ({ objects: Jurados, error }) => {
                    if (!error) {
                        console.log("🔧 MODELO - Cambios guardados exitosamente");
                        console.log("🔧 MODELO - Jurados recibidos de BD:", Jurados);
                        // ✅ SOLUCIÓN: Recargar todos los datos desde la BD después de editar
                        console.log("🔄 MODELO - Recargando todos los jurados desde la BD...");
                        this.db.listRecords({
                            tabla: this.tbJurado,
                            callback: ({ objects, error: listError }) => {
                                if (!listError && objects) {
                                    console.log("🔄 MODELO - Datos actualizados recibidos:", objects);
                                    // ✅ FORZAR RECARGA COMPLETA Y ACTUALIZACIÓN
                                    this.llenarJurados(objects);
                                    // ✅ VERIFICAR QUE LOS DATOS ESTÁN EN EL ARRAY
                                    console.log("🔄 MODELO - Array Jurados actualizado:", this.Jurados.length);
                                    console.log("🔄 MODELO - Jurados finales:", this.Jurados.map(j => `${j.nombre} (${j.categoria})`));
                                    // ✅ FORZAR ACTUALIZACIÓN DE LA VISTA
                                    setTimeout(() => {
                                        console.log("🔄 MODELO - Forzando recarga de la vista...");
                                        this.cargar((error) => {
                                            if (!error) {
                                                console.log("🔄 MODELO - Vista recargada exitosamente");
                                            }
                                        });
                                    }, 100);
                                }
                                callback(false);
                            }
                        });
                    }
                    else {
                        console.error("🔧 MODELO - Error al guardar cambios:", error);
                        callback(error);
                    }
                },
            });
    }
    deleteJurado({ nombre, callback, }) {
        console.log("🔍 Modelo - Intentando eliminar jurado:", nombre);
        // VALIDACIÓN: Verificar que el nombre no esté vacío
        if (!nombre || nombre.trim() === "") {
            console.error("❌ Error: Nombre está vacío en el modelo");
            callback("El nombre del jurado está vacío");
            return;
        }
        const nombreTrim = nombre.trim();
        console.log("🔍 Buscando jurado con nombre:", nombreTrim);
        let indice = this.Jurados.findIndex((m) => m.nombre === nombreTrim);
        // Verificar si la Jurado existe
        if (indice === -1) {
            console.error("❌ Jurado no encontrado:", nombreTrim);
            console.log("🔍 Jurados disponibles:", this.Jurados.map(j => j.nombre));
            callback(`el Jurado con Nombre ${nombreTrim} no existe.`);
        }
        else {
            // Verificar si están inscritos Puntuacions en la Jurado
            // Eliminar la Jurado
            this.db.deleteRecord({
                tabla: this.tbJurado,
                object: this.Jurados[indice],
                callback: ({ objects: Jurados, error }) => {
                    if (!error)
                        this.llenarJurados(Jurados);
                    this.sincronizarWebStorage(); // 💾 Guardar en web storage
                    callback === null || callback === void 0 ? void 0 : callback(error);
                },
            });
        }
    }
    // codigo para Puntuacion
    addPuntuacion({ dtPuntuacion, callback, }) {
        console.log("🔢 MODELO - Intentando agregar puntuación:", dtPuntuacion);
        let Puntuacion = new Cl_mPuntuacion(dtPuntuacion);
        // Validar que la puntuación sea correcta
        if (!Puntuacion.PuntuacionOk) {
            console.error("❌ MODELO - Puntuación inválida:", Puntuacion);
            callback("La puntuación no es correcta.");
            return;
        }
        // ✅ VALIDACIÓN FINAL: Verificar duplicados antes de guardar
        const puntuacionesExistentes = this.Puntuacion.map(p => p.toJSON());
        if (!Cl_mPuntuacion.puedePuntuarJuradoEquipo(dtPuntuacion.Jurado, dtPuntuacion.equipo, puntuacionesExistentes)) {
            console.error("❌ MODELO - Validación fallida: El jurado ya puntúo este equipo");
            callback(Cl_mPuntuacion.obtenerErrorJuradoYaPuntuo(dtPuntuacion.Jurado, dtPuntuacion.equipo));
            return;
        }
        console.log("✅ MODELO - Puntuación válida, guardando en BD...");
        this.db.addRecord({
            tabla: this.tbPuntuacion,
            registroAlias: `${dtPuntuacion.equipo.replace(/[^A-Z]/g, '').substring(0, 8)}_${(Date.now() % 10000).toString().padStart(4, '0')}`,
            object: Puntuacion,
            callback: ({ id, objects: Puntuacion, error }) => {
                if (!error) {
                    console.log("✅ MODELO - Puntuación guardada exitosamente");
                    console.log("🔢 MODELO - Datos recibidos de BD:", Puntuacion);
                    this.llenarPuntuacion(Puntuacion);
                    console.log("🔢 MODELO - Array Puntuacion actualizado:", this.Puntuacion.length, "elementos");
                    this.sincronizarWebStorage(); // 💾 Guardar en web storage
                    console.log("🔢 MODELO - Array Puntuacion actualizado:", this.Puntuacion.length, "elementos");
                }
                else {
                    console.error("❌ MODELO - Error guardando puntuación:", error);
                }
                callback === null || callback === void 0 ? void 0 : callback(error);
            },
        });
    }
    // codigo para reporte
    determinarPesoJurado(categoria) {
        console.log(`🔍 DEBUG - Calculando peso para categoría: "${categoria}"`);
        switch (categoria.toLowerCase()) {
            case 'maestro': return 20;
            case 'autoridad': return 10;
            case 'docente': return 10;
            case 'experto': return 5;
            case 'invitado': return 1;
            default: return 1;
        }
    }
    generarReporte() {
        const resultadosPorEquipo = {};
        // 1. INICIALIZAR TODOS LOS EQUIPOS (aunque no tengan puntuaciones)
        this.equiposDisponibles.forEach(equipo => {
            resultadosPorEquipo[equipo] = { puntuaciones: [] };
        });
        // 2. Agregar las puntuaciones existentes a cada equipo
        this.Puntuacion.forEach(p => {
            const equipo = p.equipo;
            const jurado = this.Jurado(p.Jurado); // Busca el objeto Jurado por nombre
            // Si el equipo no existe en la lista, agregarlo
            if (!resultadosPorEquipo[equipo]) {
                resultadosPorEquipo[equipo] = { puntuaciones: [] };
            }
            if (jurado) {
                resultadosPorEquipo[equipo].puntuaciones.push({
                    puntuacion: p.puntuacionMax,
                    categoriaJurado: jurado.categoria // Usamos la categoría del Jurado
                });
            }
        });
        const resultados = [];
        // 3. Calcular la ponderación y el promedio para cada equipo
        let contadorEquipo = 1;
        for (const equipo in resultadosPorEquipo) {
            const data = resultadosPorEquipo[equipo].puntuaciones;
            let sumaPonderada = 0;
            let pesoTotal = 0;
            const componentes = [];
            const pesosComponentes = [];
            if (data.length > 0) {
                data.forEach(({ puntuacion, categoriaJurado }) => {
                    const peso = this.determinarPesoJurado(categoriaJurado);
                    console.log(`🔍 DEBUG - Puntuación: ${puntuacion}, Categoría: "${categoriaJurado}", Peso: ${peso}`);
                    const producto = puntuacion * peso;
                    sumaPonderada += producto;
                    pesoTotal += peso;
                    // Formato para las expresiones matemáticas
                    componentes.push(`${puntuacion}×${peso}`);
                    pesosComponentes.push(`${peso}`);
                });
            }
            const promedio = pesoTotal > 0 ? (sumaPonderada / pesoTotal) : 0;
            const expresionMatematica = data.length > 0 ? `${componentes.join(' + ')} = ${sumaPonderada}` : 'Sin valoraciones';
            const expresionPesos = data.length > 0 ? `${pesosComponentes.join(' + ')} = ${pesoTotal}` : '0';
            // ID secuencial para cada equipo
            const idEquipo = `E${contadorEquipo.toString().padStart(2, '0')}`;
            contadorEquipo++;
            resultados.push({
                id_equipo: idEquipo,
                nombre_equipo: equipo,
                suma_ponderada: expresionMatematica,
                peso_total: expresionPesos,
                puntaje_final: Math.round(promedio * 100) / 100,
                ranking: 0
            });
        }
        // 4. Ordenar por puntaje_final (de mayor a menor) y asignar el ranking
        resultados.sort((a, b) => b.puntaje_final - a.puntaje_final);
        resultados.forEach((r, index) => {
            r.ranking = index + 1;
        });
        console.log("📊 MODELO - Reporte generado:", resultados.length, "equipos");
        return resultados;
    }
    dtJurado() {
        console.log("🔍 MODELO - dtJurado() llamado - Retornando:", this.Jurados.length, "jurados");
        console.log("🔍 MODELO - Contenido actual:", this.Jurados.map(j => `${j.nombre} (${j.categoria})`));
        const result = this.Jurados.map((m) => m.toJSON());
        console.log("🔍 MODELO - dtJurado() retornando array:", result.length, "elementos");
        return result;
    }
    dtPuntuacion() {
        return this.Puntuacion.map((e) => e.toJSON());
    }
    Jurado(nombre) {
        let Jurado = this.Jurados.find((m) => m.nombre === nombre);
        return Jurado ? Jurado : null;
    }
    cargar(callback) {
        console.log("🔄 MODELO - Iniciando carga de datos...");
        // 💾 PRIMERO: Cargar desde Web Storage como respaldo
        const datosLocales = this.cargarDesdeWebStorage();
        this.db.listRecords({
            tabla: this.tbJurado,
            callback: ({ objects, error }) => {
                if (error) {
                    console.warn("⚠️ MODELO - Error cargando de BD, usando Web Storage:", error);
                    // Si falla la BD, usar datos locales de Web Storage
                    if (datosLocales.jurados.length > 0 || datosLocales.puntuaciones.length > 0) {
                        this.llenarJurados(datosLocales.jurados);
                        this.llenarPuntuacion(datosLocales.puntuaciones);
                        console.log("✅ MODELO - Datos cargados desde Web Storage");
                        // Generar reporte con datos locales
                        const reporte = this.generarReporte();
                        console.log("📊 MODELO - Reporte generado con datos locales:", reporte.length, "equipos");
                        callback(false);
                    }
                    else {
                        console.log("ℹ️ MODELO - BD sin datos y Web Storage vacío");
                        this.llenarJurados([]);
                        this.llenarPuntuacion([]);
                        callback(false);
                    }
                }
                else {
                    // ✅ BD DISPONIBLE - Cargar desde BD
                    this.db.listRecords({
                        tabla: this.tbPuntuacion,
                        callback: ({ Puntuacion, error }) => {
                            if (error) {
                                console.warn("⚠️ MODELO - Error cargando puntuaciones de BD:", error);
                                // Combinar BD con datos locales si existen
                                this.llenarJurados(objects !== null && objects !== void 0 ? objects : []);
                                this.llenarPuntuacion(datosLocales.puntuaciones);
                            }
                            else {
                                this.llenarJurados(objects !== null && objects !== void 0 ? objects : []);
                                this.llenarPuntuacion(Puntuacion !== null && Puntuacion !== void 0 ? Puntuacion : []);
                            }
                            // 💾 SINCRONIZAR CON WEB STORAGE
                            this.sincronizarWebStorage();
                            // 📊 GENERAR REPORTE INICIAL
                            console.log("📊 MODELO - Generando reporte inicial...");
                            const reporte = this.generarReporte();
                            console.log("📊 MODELO - Reporte inicial generado:", reporte.length, "equipos");
                            console.log("🔄 MODELO - Datos cargados exitosamente:");
                            console.log(`   - Jurados: ${this.Jurados.length}`);
                            console.log(`   - Puntuaciones: ${this.Puntuacion.length}`);
                            callback(false);
                        },
                    });
                }
            },
        });
    }
    llenarJurados(Jurados) {
        this.Jurados = [];
        Jurados.forEach((Jurado) => this.Jurados.push(new Cl_mJurado(Jurado)));
    }
    llenarPuntuacion(Puntuacion) {
        this.Puntuacion = [];
        Puntuacion.forEach((Puntuacion) => this.Puntuacion.push(new Cl_mPuntuacion(Puntuacion)));
    }
    // 💾 MÉTODOS PARA PERSISTENCIA WEB STORAGE
    // 💾 MÉTODOS WEB STORAGE COMPLETOS
    guardarEnWebStorage(resultadosReporte) {
        try {
            const datos = {
                jurados: this.Jurados.map(j => j.toJSON()),
                puntuaciones: this.Puntuacion.map(p => p.toJSON()),
                reporte: resultadosReporte || null,
                timestamp: Date.now()
            };
            localStorage.setItem('sistemaJurados_webStorage', JSON.stringify(datos));
            console.log("💾 WEB STORAGE - Datos guardados exitosamente");
        }
        catch (error) {
            console.error("❌ WEB STORAGE - Error guardando:", error);
        }
    }
    cargarDesdeWebStorage() {
        var _a, _b;
        try {
            const datosStr = localStorage.getItem('sistemaJurados_webStorage');
            if (datosStr) {
                const datos = JSON.parse(datosStr);
                console.log("💾 WEB STORAGE - Datos cargados:", (_a = datos.jurados) === null || _a === void 0 ? void 0 : _a.length, "jurados,", (_b = datos.puntuaciones) === null || _b === void 0 ? void 0 : _b.length, "puntuaciones");
                return {
                    jurados: datos.jurados || [],
                    puntuaciones: datos.puntuaciones || [],
                    reporte: datos.reporte || null
                };
            }
        }
        catch (error) {
            console.error("❌ WEB STORAGE - Error cargando:", error);
        }
        return { jurados: [], puntuaciones: [] };
    }
    sincronizarWebStorage() {
        try {
            if (this.Jurados.length > 0 || this.Puntuacion.length > 0) {
                this.guardarEnWebStorage();
            }
        }
        catch (error) {
            console.error("❌ WEB STORAGE - Error sincronizando:", error);
        }
    }
    limpiarWebStorage() {
        try {
            localStorage.removeItem('sistemaJurados_webStorage');
            console.log("🗑️ WEB STORAGE - Datos eliminados");
        }
        catch (error) {
            console.error("❌ WEB STORAGE - Error limpiando:", error);
        }
    }
}
