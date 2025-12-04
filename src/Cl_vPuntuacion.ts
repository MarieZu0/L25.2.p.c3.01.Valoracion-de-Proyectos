import Cl_mPuntuacion, { iPuntuacion } from "./Cl_mPuntuacion.js";
import Cl_vGeneral, { tHTMLElement } from "./tools/Cl_vGeneral.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_vPuntuacion extends Cl_vGeneral {
  private inJurado: HTMLSelectElement;
  private inEquipo: HTMLSelectElement;
  private inPuntuacionMax: HTMLInputElement;
  private inObservacion: HTMLInputElement;
  private btAgregar: HTMLButtonElement;
  private btCancelar: HTMLButtonElement;
  private Puntuacion: Cl_mPuntuacion;
  private opcion: opcionFicha | null;
  private tbodyValoraciones: HTMLElement | null;
  
  // Lista de equipos disponibles (UCLA 2025)
  private equiposDisponibles: string[] = [
    "TheGitGuardians",
    "SigmaDev",
    "Atlas",
    "The Code Rangers",
    "Advanced One Logic",
    "HyperLinkBlocked",
    "Bug Busters",
    "PowerSquad",
    "CodeBreakers",
    "TeraNexus Core",
    "Brothers of Matrix",
    "InitCode",
    "SevenPixels&TwoBugs"
  ];
  
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
    
    
    this.inJurado = this.crearHTMLElement("inJurado", {
      type: tHTMLElement.SELECT,
      onchange: () => {
        // Guardar el valor tal como viene del select (sin convertir a mayúsculas)
        this.Puntuacion.Jurado = this.inJurado.value.trim();
        console.log("🔄 Jurado seleccionado:", this.Puntuacion.Jurado);
        this.refresh();
      },
      refresh: () =>
        (this.inJurado.style.borderColor = this.Puntuacion.JuradoOk ? "" : "red"),
    }) as HTMLSelectElement;
    
    this.inEquipo = this.crearHTMLElement("inEquipo", {
      type: tHTMLElement.SELECT,
      onchange: () => {
        this.Puntuacion.equipo = this.inEquipo.value.trim();
        console.log("🔄 Equipo seleccionado:", this.Puntuacion.equipo);
        this.refresh();
      },
      refresh: () =>
        (this.inEquipo.style.borderColor = this.Puntuacion.equipo ? "" : "red"),
    }) as HTMLSelectElement;

    this.inPuntuacionMax = this.crearHTMLInputElement("inPuntuacionMax", {
      oninput: () => {
        const valor = this.inPuntuacionMax.valueAsNumber;
        this.Puntuacion.puntuacionMax = isNaN(valor) ? 0 : valor;
        this.inPuntuacionMax.valueAsNumber = this.Puntuacion.puntuacionMax;
        this.refresh();
      },
      refresh: () =>
        (this.inPuntuacionMax.style.borderColor = this.Puntuacion.PuntuacionMaxOk ? "" : "red"),
    });
    this.inPuntuacionMax.disabled = this.opcion === opcionFicha.edit;
    
    this.inObservacion = this.crearHTMLInputElement("inObservacion", {
      oninput: () => {
        this.Puntuacion.observacion = this.inObservacion.value;
        this.refresh();
      },
      refresh: () => {
        // La observación es opcional, no marcar como error si está vacía
        this.inObservacion.style.borderColor = "";
      },
    });
    
    this.btAgregar = this.crearHTMLButtonElement("btAgregar", {
      onclick: () => this.AgregarPuntuacion(),
      refresh: () => {
        this.btAgregar.disabled = this.Puntuacion.PuntuacionOk !== true;
        console.log("🔄 Botón agregar disabled:", this.btAgregar.disabled, "PuntuacionOk:", this.Puntuacion.PuntuacionOk);
      },
    });
    
    this.btCancelar = this.crearHTMLButtonElement("btVolver", {
      onclick: () => this.controlador!.activarVista({ vista: "principal" }),
    });
    
    // Obtener referencia a la tabla de valoraciones
    this.tbodyValoraciones = document.getElementById('puntuacion_tablaValoraciones');
  }

  addPuntuacion() {
    this.controlador?.activarVista({
      vista: "puntuacion",
      opcion: opcionFicha.add,
    });
  }
  
  AgregarPuntuacion() {
    console.log("🎯 VISTA - Iniciando agregar puntuación...");
    console.log("🎯 VISTA - Opción actual:", this.opcion);
    console.log("🎯 VISTA - Datos actuales:", this.Puntuacion.toJSON());
    
    if (this.opcion === opcionFicha.add) {
      // Validar antes de agregar
      if (!this.Puntuacion.PuntuacionOk) {
        console.log("❌ VISTA - Validación fallida");
        console.log("   - JuradoOk:", this.Puntuacion.JuradoOk);
        console.log("   - Equipo:", this.Puntuacion.equipo);
        console.log("   - PuntuacionMaxOk:", this.Puntuacion.PuntuacionMaxOk);
        alert("Por favor complete todos los campos requeridos correctamente.");
        return;
      }
      
      console.log("✅ VISTA - Validaciones pasadas, agregando puntuación...");
      
      this.controlador!.addPuntuacion({
        dtPuntuacion: this.Puntuacion.toJSON(),
        callback: (error: string | boolean) => {
          if (!error) {
            console.log("✅ VISTA - Puntuación agregada exitosamente");
            alert("✅ Puntuación agregada exitosamente");
            
            // Limpiar inputs después de guardar
            this.Puntuacion.Jurado = "";
            this.Puntuacion.equipo = "";
            this.Puntuacion.puntuacionMax = 0;
            this.Puntuacion.observacion = "";
            
            this.inJurado.value = "";
            this.inEquipo.value = "";
            this.inPuntuacionMax.value = "";
            this.inObservacion.value = "";
            
            // 📋 ACTUALIZAR TABLA DE VALORACIONES DESPUÉS DE AGREGAR
            this.llenarTablaValoraciones();
            
            this.refresh();
          } else {
            console.log("❌ VISTA - Error al agregar puntuación:", error);
            alert(`Error: ${error}`);
          }
        },
      });
    } else {
      console.log("⚠️ VISTA - Opción no es 'add', es:", this.opcion);
      alert("Error: No está en modo agregar. Por favor vuelva a intentar.");
    }
  }

  llenarComboJurados(): void {
    if (!this.controlador) {
      console.warn("⚠️ No hay controlador disponible para cargar jurados");
      return;
    }
    
    // 1. Obtener la lista de jurados del controlador
    const jurados = this.controlador.dtJurado;
    console.log("🔄 VISTA PUNTUACIÓN - Jurados cargados para combo:", jurados.length);

    // 2. Limpiar opciones anteriores
    this.inJurado.innerHTML = '<option value="">-- Seleccione un Jurado --</option>';
    
    // 3. Llenar el combo con los jurados
    if (jurados.length === 0) {
      console.warn("⚠️ No hay jurados registrados. Debe agregar jurados primero.");
    }
    
    jurados.forEach(jurado => {
      const option = document.createElement('option');
      option.value = jurado.nombre; 
      option.textContent = `${jurado.nombre} (${jurado.categoria})`;
      this.inJurado.appendChild(option);
    });

    // 4. Establecer la selección actual si existe
    if (this.Puntuacion.Jurado) {
      this.inJurado.value = this.Puntuacion.Jurado;
    }
  }

  llenarComboEquipos(): void {
    console.log("🔄 VISTA PUNTUACIÓN - Llenando combo de equipos...");
    
    // Limpiar opciones anteriores
    this.inEquipo.innerHTML = '<option value="">-- Seleccione un Equipo --</option>';
    
    // Llenar el combo con los equipos disponibles
    this.equiposDisponibles.forEach(equipo => {
      const option = document.createElement('option');
      option.value = equipo;
      option.textContent = equipo;
      this.inEquipo.appendChild(option);
    });
    
    console.log("✅ VISTA PUNTUACIÓN - Equipos cargados:", this.equiposDisponibles.length);

    // Establecer la selección actual si existe
    if (this.Puntuacion.equipo) {
      this.inEquipo.value = this.Puntuacion.equipo;
    }
  }

  // 📋 MÉTODO PARA LLENAR LA TABLA DE VALORACIONES
  llenarTablaValoraciones(): void {
    console.log("📋 VISTA PUNTUACIÓN - Llenando tabla de valoraciones...");
    
    // Buscar el tbody de la tabla
    if (!this.tbodyValoraciones) {
      this.tbodyValoraciones = document.getElementById('puntuacion_tablaValoraciones');
    }
    
    if (!this.tbodyValoraciones) {
      console.warn("⚠️ No se encontró el tbody de valoraciones (id='puntuacion_tablaValoraciones')");
      return;
    }
    
    // Obtener las puntuaciones del controlador
    if (!this.controlador) {
      console.warn("⚠️ No hay controlador disponible para cargar valoraciones");
      return;
    }
    
    const puntuaciones = this.controlador.dtPuntuacion;
    const jurados = this.controlador.dtJurado;
    console.log("📋 VISTA PUNTUACIÓN - Puntuaciones cargadas:", puntuaciones.length);
    
    // Crear mapas para generar IDs
    const mapaJuradoId: { [nombre: string]: string } = {};
    jurados.forEach((j, index) => {
      mapaJuradoId[j.nombre.trim().toLowerCase()] = `J${(index + 1).toString().padStart(2, '0')}`;
    });
    
    const mapaEquipoId: { [nombre: string]: string } = {};
    this.equiposDisponibles.forEach((e, index) => {
      mapaEquipoId[e.trim().toLowerCase()] = `E${(index + 1).toString().padStart(2, '0')}`;
    });
    
    // Limpiar la tabla
    this.tbodyValoraciones.innerHTML = '';
    
    // Si no hay valoraciones, mostrar mensaje
    if (puntuaciones.length === 0) {
      this.tbodyValoraciones.innerHTML = '<tr><td colspan="5" style="text-align: center; color: #666; padding: 20px;">No hay valoraciones registradas</td></tr>';
      return;
    }
    
    // Llenar la tabla con las puntuaciones
    puntuaciones.forEach(p => {
      const idJurado = mapaJuradoId[p.Jurado.trim().toLowerCase()] || 'N/A';
      const idEquipo = mapaEquipoId[p.equipo.trim().toLowerCase()] || 'N/A';
      
      const fila = document.createElement('tr');
      fila.innerHTML = `
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #2C3E50;">${idJurado}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.Jurado}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: 600; color: #2C3E50;">${idEquipo}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.equipo}</td>
        <td style="padding: 10px; border: 1px solid #ddd; text-align: center; font-weight: 700; color: #27ae60;">${p.puntuacionMax}</td>
        <td style="padding: 10px; border: 1px solid #ddd;">${p.observacion || '-'}</td>
      `;
      this.tbodyValoraciones!.appendChild(fila);
    });
    
    console.log("✅ VISTA PUNTUACIÓN - Tabla de valoraciones actualizada con", puntuaciones.length, "registros");
  }

  show(
    {
      ver = false,
      Puntuacion,
      opcion,
    }: { ver?: boolean; Puntuacion?: iPuntuacion | Cl_mPuntuacion; opcion?: opcionFicha } = {
      ver: false,
    }
  ): void {
    super.show({ ver });
    
    // Llenar combos siempre que se muestre la vista
    this.llenarComboJurados();
    this.llenarComboEquipos();
    
    // 📋 LLENAR TABLA DE VALORACIONES
    this.llenarTablaValoraciones();
    
    // Establecer la opción (importante para el método AgregarPuntuacion)
    if (opcion) {
      this.opcion = opcion;
      console.log("🔄 VISTA PUNTUACIÓN - Opción establecida:", this.opcion);
    } else if (ver) {
      // Si se muestra pero no se pasa opción, asumir modo agregar
      this.opcion = opcionFicha.add;
      console.log("🔄 VISTA PUNTUACIÓN - Opción por defecto: add");
    }
    
    if (Puntuacion) {
      // Soporta tanto iPuntuacion como Cl_mPuntuacion
      this.Puntuacion.puntuacionMax = this.inPuntuacionMax.valueAsNumber = Puntuacion.puntuacionMax;
      this.Puntuacion.equipo = this.inEquipo.value = Puntuacion.equipo;
      this.Puntuacion.Jurado = this.inJurado.value = Puntuacion.Jurado;
      this.Puntuacion.observacion = this.inObservacion.value = Puntuacion.observacion;
    }
    
    this.refresh();
  }
}
