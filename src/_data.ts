const equipos_participantes: string[] = [
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

interface Jurado {
    id: string;
    nombre: string;
    tipo: "Maestro" | "Autoridad" | "Docente" | "Invitado";
    ponderacion: number;
}

const jurados_data: Jurado[] = [
    { id: "J001", nombre: "Dr. Juan García", tipo: "Maestro", ponderacion: 20 },
    { id: "J002", nombre: "Dra. María López", tipo: "Maestro", ponderacion: 20 },
    { id: "J003", nombre: "Ing. Carlos Rodríguez", tipo: "Autoridad", ponderacion: 10 },
    { id: "J004", nombre: "Arq. Patricia Morales", tipo: "Autoridad", ponderacion: 10 },
    { id: "J005", nombre: "Lic. Roberto Fernández", tipo: "Autoridad", ponderacion: 10 },
    { id: "J006", nombre: "Dr. Antonio Sánchez", tipo: "Autoridad", ponderacion: 10 },
    { id: "J007", nombre: "Prof. Isabel García", tipo: "Docente", ponderacion: 5 },
    { id: "J008", nombre: "Prof. Miguel Torres", tipo: "Docente", ponderacion: 5 },
    { id: "J009", nombre: "Prof. Laura Martínez", tipo: "Docente", ponderacion: 5 },
    { id: "J010", nombre: "Prof. Sofía Ramírez", tipo: "Docente", ponderacion: 5 },
    { id: "J011", nombre: "Prof. Daniela Pérez", tipo: "Docente", ponderacion: 5 },
    { id: "J012", nombre: "Invitado Especial 1", tipo: "Invitado", ponderacion: 1 },
    { id: "J013", nombre: "Invitado Especial 2", tipo: "Invitado", ponderacion: 1 },
    { id: "J014", nombre: "Invitado Especial 3", tipo: "Invitado", ponderacion: 1 },
    { id: "J015", nombre: "Invitado Especial 4", tipo: "Invitado", ponderacion: 1 },
];



interface Valoracion {
    id_jurado: string;
    id_equipo: string;
    valoracion: number;
}

const valoraciones_recibidas: Valoracion[] = [
    { id_jurado: "J01", id_equipo: "E01", valoracion: 85 },
    { id_jurado: "J01", id_equipo: "E05", valoracion: 90 },
    { id_jurado: "J02", id_equipo: "E02", valoracion: 88 },
    { id_jurado: "J02", id_equipo: "E06", valoracion: 92 },
    { id_jurado: "J03", id_equipo: "E01", valoracion: 80 },
    { id_jurado: "J03", id_equipo: "E07", valoracion: 86 },
    { id_jurado: "J04", id_equipo: "E02", valoracion: 83 },
    { id_jurado: "J04", id_equipo: "E08", valoracion: 89 },
    { id_jurado: "J05", id_equipo: "E03", valoracion: 87 },
    { id_jurado: "J05", id_equipo: "E09", valoracion: 90 },
    { id_jurado: "J06", id_equipo: "E04", valoracion: 82 },
    { id_jurado: "J06", id_equipo: "E10", valoracion: 88 },
    { id_jurado: "J07", id_equipo: "E03", valoracion: 78 },
    { id_jurado: "J07", id_equipo: "E06", valoracion: 84 },
    { id_jurado: "J08", id_equipo: "E04", valoracion: 81 },
    { id_jurado: "J08", id_equipo: "E07", valoracion: 85 },
    { id_jurado: "J09", id_equipo: "E05", valoracion: 79 },
    { id_jurado: "J09", id_equipo: "E08", valoracion: 83 },
    { id_jurado: "J10", id_equipo: "E06", valoracion: 80 },
    { id_jurado: "J10", id_equipo: "E09", valoracion: 86 },
    { id_jurado: "J11", id_equipo: "E07", valoracion: 77 },
    { id_jurado: "J11", id_equipo: "E10", valoracion: 82 },
    { id_jurado: "J12", id_equipo: "E08", valoracion: 75 },
    { id_jurado: "J13", id_equipo: "E09", valoracion: 76 },
    { id_jurado: "J13", id_equipo: "E02", valoracion: 80 },
    { id_jurado: "J14", id_equipo: "E10", valoracion: 78 },
    { id_jurado: "J14", id_equipo: "E03", valoracion: 81 },
    { id_jurado: "J15", id_equipo: "E04", valoracion: 77 },
    { id_jurado: "J15", id_equipo: "E05", valoracion: 82 },
];


interface Resultado {
    id_equipo: string;
    nombre_equipo: string;
    suma_ponderada: number; // El valor final, no la expresión
    peso_total: number;
    puntaje_final: number;
}

const resultados_finales: Resultado[] = [
    { id_equipo: "E01", nombre_equipo: "Equipo 1", suma_ponderada: 2459, peso_total: 31, puntaje_final: 79.32 },
    { id_equipo: "E02", nombre_equipo: "Equipo 2", suma_ponderada: 2623, peso_total: 31, puntaje_final: 84.61 },
    { id_equipo: "E03", nombre_equipo: "Equipo 3", suma_ponderada: 1146, peso_total: 16, puntaje_final: 71.63 },
    { id_equipo: "E04", nombre_equipo: "Equipo 4", suma_ponderada: 1412, peso_total: 16, puntaje_final: 88.25 },
    { id_equipo: "E05", nombre_equipo: "Equipo 5", suma_ponderada: 2307, peso_total: 26, puntaje_final: 88.73 },
    { id_equipo: "E06", nombre_equipo: "Equipo 6", suma_ponderada: 2720, peso_total: 30, puntaje_final: 90.67 },
    { id_equipo: "E07", nombre_equipo: "Equipo 7", suma_ponderada: 1738, peso_total: 20, puntaje_final: 86.90 },
    { id_equipo: "E08", nombre_equipo: "Equipo 8", suma_ponderada: 1595, peso_total: 16, puntaje_final: 99.69 },
    { id_equipo: "E09", nombre_equipo: "Equipo 9", suma_ponderada: 1516, peso_total: 16, puntaje_final: 94.75 },
    { id_equipo: "E10", nombre_equipo: "Equipo 10", suma_ponderada: 1728, peso_total: 20, puntaje_final: 86.40 },
];