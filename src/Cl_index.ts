/**
 *  Sistema de Gestión de Jurados (UCLA)I. Resumen y Arquitectura GeneralEl proyecto 
 * es un Sistema de Gestión de Jurados 2para la Universidad Centroccidental Lisandro Alvarado (UCLA)
 *  33en Barquisimeto, Venezuela44. Es una Aplicación Web 55diseñada para la gestión de la evaluación
 *  y calificación de proyectos propuestos por bachilleres6666. El sistema debe registrar evaluadores
 *  por categoría y procesar resultados de forma ponderada7777.La arquitectura se basa en el siguiente 
 * modelo de 
 * clases:ClaseResponsabilidad PrincipalCL_ControladorGestiona las colecciones de jurados 
 * (#jurados: CL_mJurado[]) y puntuaciones (#puntuaciones: CL_mPuntuacion[]). Es el punto de entrada para 
 * agregar ambos objetos.CL_mJuradoModela un evaluador. Contiene la lógica para validar y gestionar (CRUD)
 *  un solo registro de jurado.CL_PuntajeModela una valoración. Contiene la lógica central para calcular 
 * la puntuación final ponderada y la posición en el ranking.
 * 1. 🎯 Propósito y Rol
La clase CL_mJurado modela al Evaluador o Jurado en el Sistema de Gestión de Jurados de la UCLA.
 Su propósito es encapsular la información del evaluador y su lógica de gestión, principalmente la 
 validación antes de su registro.

2. 🧱 Atributos Clave
Los siguientes atributos deben ser implementados como privados o protegidos (usando # en JS/TS) 
para garantizar el encapsulamiento:



#categoria: string (La categoría asignada, que determina la ponderación).


 */



// Archivo placeholder para evitar el error TS18003

import Cl_controlador from "./Cl_controlador.js";
import mPrincipal from "./mPrincipal.js";
import principal from "./principal.js";
import Cl_dcytDb from "https://gtplus.net/forms2/dcytDb/api/Cl_dcytDb.php?v251110-2150";

export default class Cl_index {
  private modelo: mPrincipal;
  
  constructor() {
    this.modelo = new mPrincipal();
    this.modelo.cargar((error: string | false) => {
      if (error) alert(error);
      if (error) throw new Error(error);

      
      let vista = new principal();
      let controlador = new Cl_controlador(this.modelo, vista);
      vista.controlador = controlador;
      
      vista.refresh();
    });
    
    // Exponer función global para limpiar datos
    (window as any).limpiarTodosDatos = () => this.limpiarTodosDatos();
  }
  
  // Método para limpiar todos los datos
  limpiarTodosDatos(): void {
    console.log("🗑️ Iniciando limpieza de todos los datos...");
    
    const db = new Cl_dcytDb({ aliasCuenta: "TERANEXUS CORE" });
    
    // Limpiar localStorage
    localStorage.clear();
    console.log("✅ localStorage limpiado");
    
    // Eliminar todas las puntuaciones
    db.listRecords({ 
      tabla: "Puntuacion", 
      callback: ({ objects, error }: any) => {
        if (!error && objects && objects.length > 0) {
          console.log(`🗑️ Eliminando ${objects.length} puntuaciones...`);
          objects.forEach((p: any) => {
            db.deleteRecord({
              tabla: "Puntuacion",
              object: p,
              callback: () => {}
            });
          });
          console.log("✅ Puntuaciones eliminadas");
        } else {
          console.log("ℹ️ No hay puntuaciones para eliminar");
        }
      }
    });
    
    // Eliminar todos los jurados
    db.listRecords({ 
      tabla: "Jurado", 
      callback: ({ objects, error }: any) => {
        if (!error && objects && objects.length > 0) {
          console.log(`🗑️ Eliminando ${objects.length} jurados...`);
          objects.forEach((j: any) => {
            db.deleteRecord({
              tabla: "Jurado",
              object: j,
              callback: () => {}
            });
          });
          console.log("✅ Jurados eliminados");
        } else {
          console.log("ℹ️ No hay jurados para eliminar");
        }
        
        console.log("🔄 Recarga la página (F5) para ver los cambios");
        alert("Datos eliminados. Recarga la página (F5).");
      }
    });
  }
}