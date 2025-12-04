//import Cl_mP, { iJurado } from "./Cl_mJurado.js";
import Cl_mJurado from "./Cl_mJurado.js";
export default class Cl_controlador {
    constructor(modelo, vista) {
        this.modelo = modelo;
        this.vista = vista;
    }
    addJurado({ dtJurado, callback, }) {
        this.modelo.addJurado({
            dtJurado,
            callback,
        });
    }
    editJurado({ dtJurado, callback, }) {
        this.modelo.editJurado({
            dtJurado,
            callback,
        });
    }
    deleteJurado({ nombre, callback, }) {
        this.modelo.deleteJurado({
            nombre,
            callback,
        });
    }
    Jurado(codigo) {
        let Jurado = this.modelo.Jurado(codigo);
        if (Jurado)
            return new Cl_mJurado(Jurado.toJSON());
        else
            return null;
    }
    get dtJurado() {
        console.log("🔍 CONTROLADOR - dtJurado getter llamado");
        let dtJurado = this.modelo.dtJurado();
        console.log("🔍 CONTROLADOR - dtJurado llamado - Retornando:", dtJurado.length, "jurados");
        console.log("🔍 CONTROLADOR - Jurados recibidos del modelo:", dtJurado.map(j => `${j.nombre} (${j.categoria})`));
        console.log("🔍 CONTROLADOR - Jurados ordenados:", dtJurado.map(j => `${j.nombre} (${j.categoria})`));
        return dtJurado;
    }
    //codigo para Puntuacion
    addPuntuacion({ dtPuntuacion, callback, }) {
        this.modelo.addPuntuacion({
            dtPuntuacion,
            callback,
        });
    }
    get dtPuntuacion() {
        let dtPuntuacion = this.modelo.dtPuntuacion();
        console.log("Controlador está retornando estas puntuaciones:", dtPuntuacion);
        //dtPuntuacion.sort((a, b) => a.equipo.localeCompare(b.equipo));
        return dtPuntuacion;
    }
    //codigo para Reporte
    get dtReporte() {
        // Solicita el reporte al modelo
        return this.modelo.generarReporte();
    }
    activarVista({ vista, opcion, objeto, puntuacion, }) {
        this.vista.activarVista({ vista, opcion, objeto, puntuacion, controlador: this });
    }
    verificarEstadoPuntuaciones() {
        console.log("🔍 CONTROLADOR - ===== ESTADO ACTUAL DE PUNTUACIONES =====");
        console.log("🔍 CONTROLADOR - Total de puntuaciones:", this.dtPuntuacion.length);
        console.log("🔍 CONTROLADOR - Detalles:");
        this.dtPuntuacion.forEach((p, index) => {
            console.log(`  ${index + 1}. Equipo: ${p.equipo} | Jurado: ${p.Jurado} | Puntuación: ${p.puntuacionMax} | Observación: ${p.observacion}`);
        });
        console.log("🔍 CONTROLADOR - ===== FIN VERIFICACIÓN =====");
    }
}
