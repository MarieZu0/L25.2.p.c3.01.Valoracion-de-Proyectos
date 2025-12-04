import Cl_mJurado from "./Cl_mJurado.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vJurado extends Cl_vGeneral {
    constructor() {
        super({ formName: "jurado" });
        this.opcion = null;
        this.jurado = new Cl_mJurado({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            nombre: "",
            categoria: "",
        });
        this.lblOpcion = this.crearHTMLLabelElement("lblOpcion", {
            refresh: () => (this.lblOpcion.innerHTML =
                this.opcion === opcionFicha.add ? "Agregar " : "Editar "),
        });
        this.inNombre = this.crearHTMLInputElement("inNombre", {
            oninput: () => {
                this.inNombre.value = this.jurado.nombre = this.inNombre.value
                    .toUpperCase()
                    .trim();
                this.refresh();
            },
            refresh: () => (this.inNombre.style.borderColor = this.jurado.nombreOk ? "" : "red"),
        });
        this.inNombre.disabled = this.opcion === opcionFicha.edit;
        this.inCategoria = this.crearHTMLElement("inCategoria", {
            type: tHTMLElement.SELECT,
            onchange: () => {
                this.jurado.categoria = this.inCategoria.value
                    .trim()
                    .toUpperCase();
                this.refresh();
            },
            refresh: () => (this.inCategoria.style.borderColor = this.jurado.juradoOk ? "" : "red"),
        });
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.Agregar(),
            refresh: () => {
                this.btAgregar.disabled = this.jurado.juradoOk !== true;
            },
        });
        this.btCancelar = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "principal" }),
        });
        this.divJurado = this.crearHTMLElement("divJurado", {
            type: tHTMLElement.CONTAINER,
            refresh: () => this.mostrarJurado(),
        });
    }
    addJurado() {
        var _a;
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "jurado",
            opcion: opcionFicha.add,
        });
    }
    Agregar() {
        // VALIDACIÓN PREVIA EN LA VISTA
        const nombre = this.jurado.nombre.trim();
        const categoria = this.jurado.categoria.trim();
        if (nombre.length < 6) {
            alert("El nombre debe tener al menos 6 caracteres.");
            return;
        }
        if (categoria.length === 0) {
            alert("Debe seleccionar una categoría.");
            return;
        }
        // 🎯 LÓGICA DIFERENCIADA POR MODO
        if (this.opcion === opcionFicha.add || this.opcion === null) {
            // MODO AGREGAR
            console.log("Intentando agregar jurado:", this.jurado.toJSON());
            this.controlador.addJurado({
                dtJurado: this.jurado.toJSON(),
                callback: (error) => {
                    if (!error) {
                        console.log("Jurado agregado exitosamente");
                        this.jurado.nombre = this.inNombre.value = "";
                        this.jurado.categoria = this.inCategoria.value = "";
                        this.mostrarJurado();
                        alert("Jurado agregado exitosamente.");
                        // ✅ REGRESAR A MODO AGREGAR
                        this.opcion = opcionFicha.add;
                        this.refresh();
                    }
                    else {
                        console.error("Error al agregar jurado:", error);
                        alert(`Error: ${error}`);
                    }
                },
            });
        }
        else if (this.opcion === opcionFicha.edit) {
            // MODO EDITAR - ESTA ERA LA PARTE FALTANTE
            console.log("🎯 EDITAR - Intentando editar jurado:", this.jurado.toJSON());
            this.controlador.editJurado({
                dtJurado: this.jurado.toJSON(),
                callback: (error) => {
                    var _a;
                    if (!error) {
                        console.log("✅ EDITAR - Jurado editado exitosamente");
                        this.jurado.nombre = this.inNombre.value = "";
                        this.jurado.categoria = this.inCategoria.value = "";
                        // ✅ MEJORADO: FORZAR ACTUALIZACIÓN DE DATOS
                        console.log("🔄 EDITAR - Forzando actualización de datos...");
                        // Usar setTimeout para asegurar que la BD se actualizó
                        setTimeout(() => {
                            console.log("🔄 EDITAR - Actualizando tabla después del timeout...");
                            this.mostrarJurado();
                        }, 100);
                        // ✅ FORZAR ACTUALIZACIÓN ADICIONAL DESDE CONTROLADOR
                        console.log("🔄 EDITAR - Forzando recarga desde controlador...");
                        const dtJuradoActualizado = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtJurado;
                        console.log("🔄 EDITAR - Datos desde controlador:", dtJuradoActualizado === null || dtJuradoActualizado === void 0 ? void 0 : dtJuradoActualizado.length, "jurados");
                        console.log("🔄 EDITAR - Verificando datos:", dtJuradoActualizado === null || dtJuradoActualizado === void 0 ? void 0 : dtJuradoActualizado.map(j => `${j.nombre} (${j.categoria})`));
                        // Actualizar tabla con datos frescos
                        setTimeout(() => {
                            console.log("🔄 EDITAR - Segunda actualización de tabla...");
                            this.mostrarJurado();
                        }, 50);
                        // También llamar inmediatamente (por si funciona sin timeout)
                        console.log("🔄 EDITAR - Actualizando tabla inmediatamente...");
                        this.mostrarJurado();
                        alert("Jurado editado exitosamente.");
                        // ✅ REGRESAR A MODO AGREGAR
                        this.opcion = opcionFicha.add;
                        console.log("🔄 VISTA - Forzando actualización de tabla antes de cambiar vista...");
                        this.mostrarJurado();
                        // Luego regresar a vista principal
                        console.log("🔄 VISTA - Regresando a vista principal...");
                        this.controlador.activarVista({ vista: "jurado" });
                    }
                    else {
                        console.error("❌ EDITAR - Error al editar jurado:", error);
                        alert(`Error: ${error}`);
                    }
                },
            });
        }
    }
    deleteJurado(nombre) {
        var _a;
        console.log("🗑️ Intentando eliminar jurado:", nombre);
        // VALIDACIÓN: Verificar que el nombre no esté vacío
        if (!nombre || nombre.trim() === "") {
            console.error("❌ Error: Nombre del jurado está vacío");
            alert("Error: Nombre del jurado está vacío. Recarga la página e inténtalo de nuevo.");
            return;
        }
        console.log("✅ Nombre válido, mostrando confirmación...");
        // Confirmación antes de eliminar
        if (confirm(`¿Está seguro de eliminar el jurado "${nombre}"?\n\nEsta acción no se puede deshacer.`)) {
            console.log("👤 Usuario confirmó eliminación del jurado:", nombre);
            (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.deleteJurado({
                nombre: nombre.trim(), // Asegurar que esté trim
                callback: (error) => {
                    if (error) {
                        console.error("❌ Error al eliminar jurado:", error);
                        alert(`❌ No se pudo eliminar el jurado "${nombre}".\n\nError: ${error}`);
                    }
                    else {
                        console.log("✅ Jurado eliminado exitosamente:", nombre);
                        alert(`✅ Jurado "${nombre}" eliminado exitosamente.`);
                        // Actualizar la tabla después de eliminar
                        this.mostrarJurado();
                    }
                },
            });
        }
        else {
            console.log("🚫 Usuario canceló eliminación del jurado:", nombre);
        }
    }
    editarJurado(nombre) {
        var _a, _b;
        let jurado = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.Jurado(nombre);
        if (jurado) {
            console.log("🎯 Activando modo editar para:", jurado.nombre);
            (_b = this.controlador) === null || _b === void 0 ? void 0 : _b.activarVista({
                vista: "jurado",
                opcion: opcionFicha.edit,
                objeto: jurado,
            });
        }
        else {
            console.error("❌ No se encontró el jurado:", nombre);
            alert(`No se encontró el jurado "${nombre}"`);
        }
    }
    mostrarJurado() {
        var _a;
        this.divJurado.innerHTML = "";
        let Jurado = (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.dtJurado;
        console.log("📋 Vista recibe jurados:", Jurado);
        if (!Jurado || Jurado.length === 0) {
            this.divJurado.innerHTML = '<tr><td colspan="3" style="text-align: center; color: #666;">No hay jurados registrados</td></tr>';
            return;
        }
        // ✅ CORRECCIÓN: Crear botones CONECTADOS
        Jurado.forEach((jurado, index) => {
            console.log(`🔗 Procesando jurado ${index}:`, jurado);
            const fila = document.createElement('tr');
            fila.innerHTML = `
        <td>${jurado.nombre}</td>
        <td>${jurado.categoria}</td>
        <td>
          <button id="Jurado_btEditar_${index}" style="margin-right: 5px;">Editar</button>
          <button id="Jurado_btEliminar_${index}" style="background: #ff4444; color: white; border: none; padding: 4px 8px;">X</button>
        </td>
      `;
            // 🔗 CONECTAR EL BOTÓN DE ELIMINAR - CRÍTICO
            const btnEliminar = fila.querySelector(`#Jurado_btEliminar_${index}`);
            btnEliminar.addEventListener('click', () => {
                console.log("🖱️ Click en eliminar para:", jurado.nombre);
                this.deleteJurado(jurado.nombre);
            });
            // 🔗 CONECTAR EL BOTÓN DE EDITAR
            const btnEditar = fila.querySelector(`#Jurado_btEditar_${index}`);
            btnEditar.addEventListener('click', () => {
                this.editarJurado(jurado.nombre);
            });
            this.divJurado.appendChild(fila);
        });
        console.log(`✅ Tabla actualizada con ${Jurado.length} jurados`);
    }
    show({ ver = false, Jurado = new Cl_mJurado({
        id: 0,
        creadoEl: new Date().toISOString(),
        alias: "",
        nombre: "",
        categoria: "",
    }), opcion, } = {
        ver: false,
        Jurado: new Cl_mJurado({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            nombre: "",
            categoria: "",
        }),
    }) {
        super.show({ ver });
        if (opcion) {
            this.opcion = opcion;
            // ✅ MEJORADO: Solo asignar si el nombre no está vacío (modo editar)
            if (Jurado.nombre) {
                this.jurado.nombre = this.inNombre.value = Jurado.nombre;
                this.jurado.categoria = this.inCategoria.value = Jurado.categoria;
            }
            this.refresh();
        }
        if (ver) {
            this.mostrarJurado();
        }
    }
}
