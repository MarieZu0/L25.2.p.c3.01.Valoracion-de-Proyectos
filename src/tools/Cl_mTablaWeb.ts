/**
 * Interfaz base para objetos de tabla web
 */
export interface iTablaWeb {
  id: number | null;
  creadoEl: string | null;
  alias: string | null;
}

/**
 * Clase base para modelos de tabla web
 * Proporciona propiedades comunes: id, creadoEl, alias
 */
export default class Cl_mTablaWeb {
  private _id: number | null;
  private _creadoEl: string | null;
  private _alias: string | null;

  constructor({ id, creadoEl, alias }: iTablaWeb) {
    this._id = id;
    this._creadoEl = creadoEl;
    this._alias = alias;
  }

  get id(): number | null {
    return this._id;
  }

  set id(value: number | null) {
    this._id = value;
  }

  get creadoEl(): string | null {
    return this._creadoEl;
  }

  set creadoEl(value: string | null) {
    this._creadoEl = value;
  }

  get alias(): string | null {
    return this._alias;
  }

  set alias(value: string | null) {
    this._alias = value;
  }

  /**
   * Convierte el objeto a JSON
   */
  toJSON(): iTablaWeb {
    return {
      id: this._id,
      creadoEl: this._creadoEl,
      alias: this._alias,
    };
  }
}
