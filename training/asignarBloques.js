import { bloques } from "./bloques.js";

export function asignarBloques(usuario) {

  const nivel = usuario.nivel_nicross;
  const split = usuario.split_semanal_recomendado;

  const diasConBloques = split.dias.map(dia => {

    const bloquesDia = bloques[nivel][dia.foco];

    return {
      ...dia,
      bloques: bloquesDia
    };

  });

  return {
    ...split,
    dias: diasConBloques
  };

}