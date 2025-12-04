//import Cl_mP, { iJurado } from "./Cl_mJurado.js";
import Cl_mJurado, { iJurado } from "./Cl_mJurado.js";
import { iPuntuacion } from "./Cl_mPuntuacion.js";
import mPrincipal, {iResultadoReporte} from "./mPrincipal.js";
import principal from "./principal.js";
import { opcionFicha } from "./tools/core.tools.js";

export default class Cl_controlador {
  public modelo: mPrincipal;
  public vista: principal;
  constructor(modelo:mPrincipal, vista: principal) {
    this.modelo = modelo;
    this.vista = vista;
  }
  addJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | false) => void;
  }): void {
    this.modelo.addJurado({
      dtJurado,
      callback,
    });
  }
  editJurado({
    dtJurado,
    callback,
  }: {
    dtJurado: iJurado;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.editJurado({
      dtJurado,
      callback,
    });
  }
 
  deleteJurado({
    nombre,
    callback,
  }: {
    nombre: string;
    callback: (error: string | boolean) => void;
  }): void {
    this.modelo.deleteJurado({
      nombre,
      callback,
    });
  }
  Jurado(codigo: string): Cl_mJurado | null {
    let Jurado = this.modelo.Jurado(codigo);
    if (Jurado) return new Cl_mJurado(Jurado.toJSON());
    else return null;
  }
  
get dtJurado(): iJurado[] {
  console.log("🔍 CONTROLADOR - dtJurado getter llamado");
  let dtJurado = this.modelo.dtJurado();
  console.log("🔍 CONTROLADOR - dtJurado llamado - Retornando:", dtJurado.length, "jurados");
  console.log("🔍 CONTROLADOR - Jurados recibidos del modelo:", dtJurado.map(j => `${j.nombre} (${j.categoria})`));
  console.log("🔍 CONTROLADOR - Jurados ordenados:", dtJurado.map(j => `${j.nombre} (${j.categoria})`));
  return dtJurado;
}
  //codigo para Puntuacion

 addPuntuacion({
  dtPuntuacion,
  callback,
}: {
  dtPuntuacion: iPuntuacion;
  callback: (error: string | false) => void;
}): void {
  this.modelo.addPuntuacion({
    dtPuntuacion,
    callback,
  });
}
  
get dtPuntuacion(): iPuntuacion[] {
  let dtPuntuacion = this.modelo.dtPuntuacion();
  console.log("Controlador está retornando estas puntuaciones:", dtPuntuacion);
  //dtPuntuacion.sort((a, b) => a.equipo.localeCompare(b.equipo));
  return dtPuntuacion;
}



//codigo para Reporte
get dtReporte(): iResultadoReporte[] {
    // Solicita el reporte al modelo
    return this.modelo.generarReporte();
  }

  activarVista({
  vista,
  opcion,
  objeto,
  puntuacion,
}: {
  vista: string;
  opcion?: opcionFicha;
  objeto?: Cl_mJurado;
  puntuacion?: iPuntuacion;
}): void {
(this.vista as any).activarVista({ vista, opcion, objeto, puntuacion, controlador: this });
}


verificarEstadoPuntuaciones(): void {
  console.log("🔍 CONTROLADOR - ===== ESTADO ACTUAL DE PUNTUACIONES =====");
  console.log("🔍 CONTROLADOR - Total de puntuaciones:", this.dtPuntuacion.length);
  console.log("🔍 CONTROLADOR - Detalles:");
  this.dtPuntuacion.forEach((p, index) => {
    console.log(`  ${index + 1}. Equipo: ${p.equipo} | Jurado: ${p.Jurado} | Puntuación: ${p.puntuacionMax} | Observación: ${p.observacion}`);
  });
  console.log("🔍 CONTROLADOR - ===== FIN VERIFICACIÓN =====");
}
}