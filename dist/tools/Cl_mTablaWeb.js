/**
 * Clase base para modelos de tabla web
 * Proporciona propiedades comunes: id, creadoEl, alias
 */
export default class Cl_mTablaWeb {
    constructor({ id, creadoEl, alias }) {
        this._id = id;
        this._creadoEl = creadoEl;
        this._alias = alias;
    }
    get id() {
        return this._id;
    }
    set id(value) {
        this._id = value;
    }
    get creadoEl() {
        return this._creadoEl;
    }
    set creadoEl(value) {
        this._creadoEl = value;
    }
    get alias() {
        return this._alias;
    }
    set alias(value) {
        this._alias = value;
    }
    /**
     * Convierte el objeto a JSON
     */
    toJSON() {
        return {
            id: this._id,
            creadoEl: this._creadoEl,
            alias: this._alias,
        };
    }
}
