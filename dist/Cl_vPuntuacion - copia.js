import Cl_mPuntuacion from "./Cl_mPuntuacion.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";
export default class Cl_vPuntuacion extends Cl_vGeneral {
    constructor() {
        // La sección se llama "puntuacion" en el HTML; usar el mismo id
        super({ formName: "puntuacion" });
        // los elementos internos también usan el prefijo en minúscula 'puntuacion_...'
        this.formName = "puntuacion";
        this.opcion = null;
        this.Puntuacion = new Cl_mPuntuacion({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            Jurado: "",
            equipo: "",
            puntuacionMax: 0,
            observacion: "",
        });
        this.inJurado = this.crearHTMLInputElement("inJurado", {
            oninput: () => {
                this.inJurado.value = this.Puntuacion.Jurado = this.inJurado.value
                    .toUpperCase()
                    .trim();
                this.refresh();
            },
            refresh: () => (this.inJurado.style.borderColor = this.Puntuacion.JuradoOk ? "" : "red"),
        });
        this.inJurado.disabled = this.opcion === opcionFicha.edit;
        this.inEquipo = this.crearHTMLElement("inEquipo", {
            type: tHTMLElement.SELECT,
            onchange: () => {
                this.Puntuacion.equipo = this.inEquipo.value
                    .trim()
                    .toUpperCase();
                this.refresh();
            },
            refresh: () => (this.inEquipo.style.borderColor = this.Puntuacion.equipo ? "" : "red"),
        });
        this.inPuntuacionMax = this.crearHTMLInputElement("inPuntuacionMax", {
            oninput: () => {
                const valor = this.inPuntuacionMax.valueAsNumber;
                this.Puntuacion.puntuacionMax = isNaN(valor) ? 0 : valor;
                this.inPuntuacionMax.valueAsNumber = this.Puntuacion.puntuacionMax;
                this.refresh();
            },
            refresh: () => (this.inPuntuacionMax.style.borderColor = this.Puntuacion.PuntuacionMaxOk ? "" : "red"),
        });
        this.inPuntuacionMax.disabled = this.opcion === opcionFicha.edit;
        this.inObservacion = this.crearHTMLInputElement("inObservacion", {
            oninput: () => {
                this.inObservacion.value = this.Puntuacion.observacion = this.inObservacion.value;
                this.refresh();
            },
            refresh: () => (this.inObservacion.style.borderColor = this.Puntuacion.observacion ? "" : "red"),
        });
        this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
            onclick: () => this.AgregarPuntuacion(),
            refresh: () => {
                this.btAgregar.disabled = this.Puntuacion.PuntuacionOk !== true;
            },
        });
        this.btCancelar = this.crearHTMLButtonElement("btVolver", {
            onclick: () => this.controlador.activarVista({ vista: "principal" }),
        });
    }
    addPuntuacion() {
        var _a;
        // Si el botón tiene addJurado, el flujo correcto debe ser primero agregar y luego limpiar/refrescar.
        // Asumiendo que addJurado es solo para iniciar el modo ADD (como en el repositorio de referencia):
        (_a = this.controlador) === null || _a === void 0 ? void 0 : _a.activarVista({
            vista: "puntuacion",
            opcion: opcionFicha.add,
        });
    }
    AgregarPuntuacion() {
        console.log("🎯 VISTA - Iniciando agregar puntuación...");
        console.log("🎯 VISTA - Opción actual:", this.opcion);
        if (this.opcion === opcionFicha.add) {
            console.log("✅ VISTA - Validaciones pasadas, agregando puntuación...");
            this.controlador.addPuntuacion({
                dtPuntuacion: this.Puntuacion.toJSON(),
                callback: (error) => {
                    if (!error) {
                        console.log("✅ VISTA - Puntuación agregada exitosamente");
                        // Limpiar inputs después de guardar
                        this.Puntuacion.Jurado = this.inJurado.value = "";
                        this.Puntuacion.equipo = this.inEquipo.value = "";
                        this.Puntuacion.puntuacionMax = this.inPuntuacionMax.valueAsNumber;
                        this.Puntuacion.observacion = this.inObservacion.value = "";
                        this.refresh();
                    }
                    else {
                        console.log("❌ VISTA - Error al agregar puntuación:", error);
                        alert(`Error: ${error}`);
                    }
                },
            });
        }
        else {
            console.log("⚠️ VISTA - Opción no es 'add', es:", this.opcion);
        }
    }
    show({ ver = false, Puntuacion = new Cl_mPuntuacion({
        id: 0,
        creadoEl: new Date().toISOString(),
        alias: "",
        Jurado: "",
        equipo: "",
        puntuacionMax: 0,
        observacion: "",
    }), opcion, } = {
        ver: false,
        Puntuacion: new Cl_mPuntuacion({
            id: 0,
            creadoEl: new Date().toISOString(),
            alias: "",
            Jurado: "",
            equipo: "",
            puntuacionMax: 0,
            observacion: "",
        }),
    }) {
        super.show({ ver });
        if (opcion) {
            this.opcion = opcion;
            this.Puntuacion.puntuacionMax = this.inPuntuacionMax.valueAsNumber = Puntuacion.puntuacionMax;
            this.Puntuacion.equipo = this.inEquipo.value = Puntuacion.equipo;
            this.refresh();
        }
    }
}
