//llaves que usa React Query
export const authKeys = {
  all: ["auth"],
  perfil: (id) => [...authKeys.all, "perfil", id],
};