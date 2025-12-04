import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";
import Cl_mPuntuacion from "./Cl_mPuntuacion.js";
import Cl_mJurado from "./Cl_mJurado.js";
export default class mPrincipal {
    constructor() {
        this.tbJurado = "Jurado";
        this.tbPuntuacion = "Puntuacion";
        this.db = new Cl_dcytDb({ aliasCuenta: "TERANEXUS CORE" });
        this.Jurados = [];
        this.Puntuacion = [];
    }
    addJurado({ dtJurado, callback, }) {
        const juradoExistente = this.Jurado(dtJurado.nombre);
        // 1. Validar duplicados locales antes de ir a la nube (Similar a validar código en Materia)
        if (juradoExistente) {
            callback(`Ya existe un jurado con el nombre: ${dtJurado.nombre}`);
            return;
        }
        // 2. Generar ID y Fecha
        dtJurado.id = Date.now();
        dtJurado.creadoEl = new Date().toISOString();
        // 💡 SOLUCIÓN: Asegurar que la propiedad 'alias' no contenga un valor no único (como la categoría)
        dtJurado.alias = null; // <-- ¡AÑADIR ESTA LÍNEA!
        const nuevoJurado = new Cl_mJurado(dtJurado);
        // Validar que la Jurado sea correcta
        if (!nuevoJurado.juradoOk)
            callback("El Jurado no es correcto.");
        else
            this.db.addRecord({
                tabla: this.tbJurado,
                object: nuevoJurado,
                callback: ({ id, objects: Jurados, error }) => {
                    if (!error) {
                        this.llenarJurados(Jurados);
                        this.sincronizarWebStorage(); // 💾 Guardar en web storage
                        console.log("✅ MODELO - Jurado agregado y sincronizado");
                    }
                    console.log("ID nuevo Jurado:", id);
                    callback === null || callback === void 0 ? void 0 : callback(error);
                },
            });
    }
    editJurado({ dtJurado, callback, }) {
        console.log('🔄 MODELO - Iniciando edición:', dtJurado.nombre, dtJurado.categoria);
        const jurado = new Cl_mJurado(dtJurado);
        // Validar que el objeto sea correcto
        if (!jurado.juradoOk) {
            console.error('❌ MODELO - Datos de jurado inválidos');
            callback("Los datos del jurado no son correctos");
            return;
        }
        // Proceder con la edición en la base de datos
        this.db.editRecord({
            tabla: this.tbJurado,
            object: jurado.toJSON(),
            callback: ({ error }) => {
                if (!error) {
                    console.log('✅ MODELO - Edición en BD exitosa, actualizando array local...');
                    // 🔧 CORRECCIÓN: Intento de Actualización Local (Rápida)
                    const index = this.Jurados.findIndex((j) => j.id === jurado.id);
                    if (index !== -1) {
                        // ✅ ÉXITO: Se actualiza localmente creando nueva instancia
                        this.Jurados[index] = new Cl_mJurado(jurado.toJSON());
                        console.log('✅ MODELO - Jurado actualizado localmente:', this.Jurados[index].nombre, this.Jurados[index].categoria);
                        this.sincronizarWebStorage();
                        callback(false);
                    }
                    else {
                        // 🔧 FALLA: Forzar Recarga Completa (Lenta pero segura)
                        console.warn("⚠️ MODELO - JURADO NO ENCONTRADO LOCALMENTE. FORZANDO RECARGA DESDE BD.");
                        this.db.listRecords({
                            tabla: this.tbJurado,
                            callback: ({ objects: juradosActualizados, error: errorCarga }) => {
                                if (errorCarga) {
                                    console.error('❌ MODELO - Error al recargar lista:', errorCarga);
                                    callback(`Edición exitosa, pero error al recargar: ${errorCarga}`);
                                }
                                else {
                                    console.log('✅ MODELO - Recarga exitosa desde BD');
                                    this.llenarJurados(juradosActualizados !== null && juradosActualizados !== void 0 ? juradosActualizados : []);
                                    this.sincronizarWebStorage();
                                    callback(false);
                                }
                            }
                        });
                    }
                }
                else {
                    console.error('❌ MODELO - Error en edición de BD:', error);
                    callback(error);
                }
            },
        });
    }
    // ✅ NUEVO MÉTODO: Verificación para debugging
    verificarJurado(nombre) {
        console.log('🔍 VERIFICACIÓN - Buscando jurado:', nombre);
        const jurado = this.Jurado(nombre);
        if (jurado) {
            console.log('✅ VERIFICACIÓN - Jurado encontrado:', {
                nombre: jurado.nombre,
                categoria: jurado.categoria,
                id: jurado.id
            });
        }
        else {
            console.error('❌ VERIFICACIÓN - Jurado NO encontrado:', nombre);
            console.log('🔍 VERIFICACIÓN - Jurados disponibles:', this.Jurados.map(j => `${j.nombre} (${j.categoria})`));
        }
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
        // 1. Agrupar las puntuaciones por equipo y obtener la categoría del jurado
        this.Puntuacion.forEach(p => {
            const equipo = p.equipo;
            const jurado = this.Jurado(p.Jurado); // Busca el objeto Jurado por nombre
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
        // 2. Calcular la ponderación y el promedio para cada equipo
        for (const equipo in resultadosPorEquipo) {
            const data = resultadosPorEquipo[equipo].puntuaciones;
            let sumaPonderada = 0;
            let pesoTotal = 0;
            const componentes = [];
            const pesosComponentes = [];
            data.forEach(({ puntuacion, categoriaJurado }) => {
                const peso = this.determinarPesoJurado(categoriaJurado);
                console.log(`🔍 DEBUG - Puntuación: ${puntuacion}, Categoría: "${categoriaJurado}", Peso: ${peso}`);
                const producto = puntuacion * peso;
                sumaPonderada += producto;
                pesoTotal += peso;
                // Formato para las expresiones matemáticas (como en la imagen)
                componentes.push(`${puntuacion}×${peso}`);
                pesosComponentes.push(`${peso}`);
            });
            const promedio = pesoTotal > 0 ? (sumaPonderada / pesoTotal) : 0;
            const expresionMatematica = `${componentes.join(' + ')} = ${sumaPonderada}`;
            const expresionPesos = `${pesosComponentes.join(' + ')} = ${pesoTotal}`;
            // Extraer número del nombre del equipo (ej: "Equipo 1" → "1" → "E01")
            const numeroEquipo = equipo.replace(/[^0-9]/g, ''); // Extraer solo números
            const idEquipo = `E${numeroEquipo.padStart(2, '0')}`; // Formato E01, E02, etc.
            resultados.push({
                id_equipo: idEquipo,
                nombre_equipo: equipo,
                suma_ponderada: expresionMatematica, // String con la fórmula
                peso_total: expresionPesos, // String con la fórmula
                puntaje_final: Math.round(promedio * 100) / 100, // Redondeado a 2 decimales
                ranking: 0 // Se actualizará en el paso 3
            });
        }
        // 3. Ordenar por puntaje_final (de mayor a menor) y asignar el ranking
        resultados.sort((a, b) => b.puntaje_final - a.puntaje_final);
        resultados.forEach((r, index) => {
            r.ranking = index + 1;
        });
        console.log("📊 MODELO - Reporte generado:", resultados);
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
