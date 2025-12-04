/**
 * Tipos de elementos HTML soportados
 */
export var tHTMLElement;
(function (tHTMLElement) {
    tHTMLElement["INPUT"] = "input";
    tHTMLElement["SELECT"] = "select";
    tHTMLElement["BUTTON"] = "button";
    tHTMLElement["LABEL"] = "label";
    tHTMLElement["CONTAINER"] = "container";
})(tHTMLElement || (tHTMLElement = {}));
/**
 * Clase base para vistas generales
 * Proporciona métodos para crear elementos HTML y gestionar el controlador
 */
export default class Cl_vGeneral {
    constructor({ formName }) {
        this._controlador = null;
        this.elements = new Map();
        this.formName = formName;
        this.form = document.getElementById(formName);
    }
    /**
     * Getter para el controlador
     */
    get controlador() {
        return this._controlador;
    }
    /**
     * Setter para el controlador
     */
    set controlador(controlador) {
        this._controlador = controlador;
    }
    /**
     * Obtiene el ID completo del elemento (formName_elementName)
     */
    getElementId(elementName) {
        return `${this.formName}_${elementName}`;
    }
    /**
     * Crea un elemento HTML genérico
     */
    crearHTMLElement(elementName, options = {}) {
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
            const selectElement = element;
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
    crearHTMLInputElement(elementName, options = {}) {
        const element = this.crearHTMLElement(elementName, options);
        return element;
    }
    /**
     * Crea un elemento button HTML
     */
    crearHTMLButtonElement(elementName, options = {}) {
        const element = this.crearHTMLElement(elementName, options);
        return element;
    }
    /**
     * Crea un elemento label HTML
     */
    crearHTMLLabelElement(elementName, options = {}) {
        const element = this.crearHTMLElement(elementName, options);
        return element;
    }
    /**
     * Refresca todos los elementos registrados
     */
    refresh() {
        this.elements.forEach(({ refresh }) => {
            if (refresh) {
                refresh();
            }
        });
    }
    /**
     * Muestra u oculta el formulario
     */
    show({ ver = false } = {}) {
        if (this.form) {
            this.form.style.display = ver ? "block" : "none";
        }
    }
    /**
     * Aplica estilos a un elemento SELECT para mejor legibilidad
     */
    aplicarEstilosSelect(selectElement) {
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
