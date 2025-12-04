import Cl_mTablaWeb from "./tools/Cl_mTablaWeb.js";

export interface iJurado {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
  nombre: string;
  categoria: string;
  
}
 
export default class Cl_mJurado extends Cl_mTablaWeb {
  private _nombre: string = "";
  private _categoria: string = "";
  constructor({ id, creadoEl, alias,  nombre, categoria }: iJurado) {
    super({ id, creadoEl, alias });
    this.nombre = nombre;
    this.categoria = categoria;
  }
  set categoria(categoria: string) {
    this._categoria = categoria;
  }
  get categoria(): string {
    return this._categoria;
  }
  set nombre(nombre: string) {
    this._nombre = nombre;
  }
  get nombre(): string {
    return this._nombre;
  }

  get nombreOk(): boolean {
    return this.nombre.length > 5;
  }
  get juradoOk(): boolean {
    return this.categoria.length > 0;
  }

 
  toJSON(): iJurado {
    // unir los datos de la clase base con los de la clase derivada, usando super.toJSON()
    return {
      ...super.toJSON(),
      nombre: this._nombre,
      categoria: this._categoria,
    
     
    };
  }
}