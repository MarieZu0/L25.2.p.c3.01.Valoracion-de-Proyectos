import Cl_controlador from "../Cl_controlador.js";

/**
 * Tipos de elementos HTML soportados
 */
export enum tHTMLElement {
  INPUT = "input",
  SELECT = "select",
  BUTTON = "button",
  LABEL = "label",
  CONTAINER = "container",
}

/**
 * Interfaz para opciones de elementos HTML
 */
interface iElementOptions {
  type?: tHTMLElement;
  oninput?: () => void;
  onchange?: () => void;
  onclick?: () => void;
  refresh?: () => void;
}

/**
 * Clase base para vistas generales
 * Proporciona métodos para crear elementos HTML y gestionar el controlador
 */
export default class Cl_vGeneral {
  protected formName: string;
  protected _controlador: Cl_controlador | null = null;
  protected form: HTMLElement | null;
  protected elements: Map<string, { element: HTMLElement; refresh?: () => void }> = new Map();

  constructor({ formName }: { formName: string }) {
    this.formName = formName;
    this.form = document.getElementById(formName);
  }

  /**
   * Getter para el controlador
   */
  get controlador(): Cl_controlador | null {
    return this._controlador;
  }

  /**
   * Setter para el controlador
   */
  set controlador(controlador: Cl_controlador | null) {
    this._controlador = controlador;
  }

  /**
   * Obtiene el ID completo del elemento (formName_elementName)
   */
  protected getElementId(elementName: string): string {
    return `${this.formName}_${elementName}`;
  }

  /**
   * Crea un elemento HTML genérico
   */
  crearHTMLElement(elementName: string, options: iElementOptions = {}): HTMLElement {
    const elementId = this.getElementId(elementName);
    const element = document.getElementById(elementId);

    if (!element) {
      console.warn(`Elemento no encontrado: ${elementId}`);
      // Crear un elemento placeholder
      const placeholder = document.createElement("div");
      placeholder.id = elementId;
      return placeholder;
    }

    // Asignar eventos
    if (options.oninput) {
      element.addEventListener("input", options.oninput);
    }
    if (options.onchange) {
      element.addEventListener("change", options.onchange);
    }
    if (options.onclick) {
      element.addEventListener("click", options.onclick);
    }

    // ✅ APLICAR ESTILOS A ELEMENTOS SELECT PARA MEJOR LEGIBILIDAD
    if (options.type === tHTMLElement.SELECT || element.tagName === "SELECT") {
      const selectElement = element as HTMLSelectElement;
      selectElement.style.fontSize = "16px";
      selectElement.style.padding = "8px 12px";
      selectElement.style.minHeight = "40px";
      // Aplicar estilos a las opciones cuando se abra el select
      this.aplicarEstilosSelect(selectElement);
    }

    // Guardar referencia con función refresh
    this.elements.set(elementName, { element, refresh: options.refresh });

    return element;
  }

  /**
   * Crea un elemento input HTML
   */
  crearHTMLInputElement(elementName: string, options: iElementOptions = {}): HTMLInputElement {
    const element = this.crearHTMLElement(elementName, options);
    return element as HTMLInputElement;
  }

  /**
   * Crea un elemento button HTML
   */
  crearHTMLButtonElement(elementName: string, options: iElementOptions = {}): HTMLButtonElement {
    const element = this.crearHTMLElement(elementName, options);
    return element as HTMLButtonElement;
  }

  /**
   * Crea un elemento label HTML
   */
  crearHTMLLabelElement(elementName: string, options: iElementOptions = {}): HTMLLabelElement {
    const element = this.crearHTMLElement(elementName, options);
    return element as HTMLLabelElement;
  }

  /**
   * Refresca todos los elementos registrados
   */
  refresh(): void {
    this.elements.forEach(({ refresh }) => {
      if (refresh) {
        refresh();
      }
    });
  }

  /**
   * Muestra u oculta el formulario
   */
  show({ ver = false }: { ver?: boolean } = {}): void {
    if (this.form) {
      this.form.style.display = ver ? "block" : "none";
    }
  }

  /**
   * Aplica estilos a un elemento SELECT para mejor legibilidad
   */
  protected aplicarEstilosSelect(selectElement: HTMLSelectElement): void {
    // Crear estilos CSS dinámicos para los option si no existen
    const styleId = 'select-option-styles';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        select {
          font-size: 16px !important;
          padding: 8px 12px !important;
          min-height: 40px !important;
        }
        select option {
          font-size: 16px !important;
          padding: 10px 12px !important;
          line-height: 1.5 !important;
        }
        /* Estilos específicos para navegadores WebKit (Chrome, Safari) */
        @media screen and (-webkit-min-device-pixel-ratio:0) {
          select {
            font-size: 16px !important;
          }
        }
      `;
      document.head.appendChild(style);
    }
  }
}
