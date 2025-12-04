import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mPuntuacion extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, Jurado, equipo, puntuacionMax, observacion }) {
        super({ id, creadoEl, alias });
        this._Jurado = "";
        this._equipo = "";
        this._puntuacionMax = 0;
        this._observacion = "";
        this.Jurado = Jurado;
        this.equipo = equipo;
        this.puntuacionMax = puntuacionMax;
        this.observacion = observacion;
    }
    set observacion(observacion) {
        this._observacion = observacion;
    }
    get observacion() {
        return this._observacion;
    }
    set equipo(equipo) {
        this._equipo = equipo;
    }
    get equipo() {
        return this._equipo;
    }
    set Jurado(Jurado) {
        this._Jurado = Jurado;
    }
    get Jurado() {
        return this._Jurado;
    }
    set puntuacionMax(puntuacionMax) {
        this._puntuacionMax = puntuacionMax;
    }
    get puntuacionMax() {
        return this._puntuacionMax;
    }
    get JuradoOk() {
        return this.Jurado.length > 5;
    }
    get PuntuacionOk() {
        return this.equipo.length > 0 && this.JuradoOk && this.PuntuacionMaxOk;
    }
    get PuntuacionMaxOk() {
        return this.puntuacionMax >= 0 && this.puntuacionMax <= 100;
    }
    static determinarPesoJurado(categoria) {
        const categoriaLower = categoria.toLowerCase();
        if (categoriaLower.includes('maestro')) {
            return 20;
        }
        else if (categoriaLower.includes('autoridad') || categoriaLower.includes('docente')) {
            return 10;
        }
        else {
            // Invitado, etc.
            return 1;
        }
    }
    /**
   * ✅ Valida si un jurado puede puntuar un equipo específico
   * @param jurado Nombre del jurado
   * @param equipo Nombre del equipo
   * @param puntuacionesExistentes Array de puntuaciones existentes
   * @returns true si el jurado puede puntuar, false si ya puntúo ese equipo
   */
    static puedePuntuarJuradoEquipo(jurado, equipo, puntuacionesExistentes) {
        // Normalizar: trim y lowercase para comparación robusta
        const juradoNorm = jurado.trim().toLowerCase();
        const equipoNorm = equipo.trim().toLowerCase();
        const yaExiste = puntuacionesExistentes.some(p => p.Jurado.trim().toLowerCase() === juradoNorm &&
            p.equipo.trim().toLowerCase() === equipoNorm);
        console.log(`🔍 Validando duplicado: Jurado="${jurado}" Equipo="${equipo}" -> ${yaExiste ? 'YA EXISTE' : 'OK'}`);
        return !yaExiste;
    }
    /**
     * Obtiene el mensaje de error específico cuando un jurado ya puntúo un equipo
     * @param jurado Nombre del jurado
     * @param equipo Nombre del equipo
     * @returns Mensaje de error descriptivo
     */
    static obtenerErrorJuradoYaPuntuo(jurado, equipo) {
        return `El jurado "${jurado}" ya ha puntuado al equipo "${equipo}". Un jurado solo puede puntuar cada equipo una vez.`;
    }
    toJSON() {
        // unir los datos de la clase base con los de la clase derivada, usando super.toJSON()
        return Object.assign(Object.assign({}, super.toJSON()), { Jurado: this._Jurado, equipo: this._equipo, puntuacionMax: this._puntuacionMax, observacion: this._observacion });
    }
}
