import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";
export default class Cl_mJurado extends Cl_mTablaWeb {
    constructor({ id, creadoEl, alias, nombre, categoria }) {
        super({ id, creadoEl, alias });
        this._nombre = "";
        this._categoria = "";
        this.nombre = nombre;
        this.categoria = categoria;
    }
    set categoria(categoria) {
        this._categoria = categoria;
    }
    get categoria() {
        return this._categoria;
    }
    set nombre(nombre) {
        this._nombre = nombre;
    }
    get nombre() {
        return this._nombre;
    }
    get nombreOk() {
        return this.nombre.length > 5;
    }
    get juradoOk() {
        return this.categoria.length > 0;
    }
    toJSON() {
        // unir los datos de la clase base con los de la clase derivada, usando super.toJSON()
        return Object.assign(Object.assign({}, super.toJSON()), { nombre: this._nombre, categoria: this._categoria });
    }
}
