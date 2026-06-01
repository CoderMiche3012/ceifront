//llaves que usa React Query
export const authKeys = {
  all: ["auth"],
  perfil: () => [
    ...authKeys.all,
    "perfil",
  ],
};