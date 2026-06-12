import logoCei from "../assets/imagenes/logo.png";

let cacheLogo = null;

export const obtenerLogoBase64 = async () => {
  if (cacheLogo) return cacheLogo;

  const response = await fetch(logoCei);
  const blob = await response.blob();

  cacheLogo = await new Promise((resolve) => {
    const reader = new FileReader();

    reader.onloadend = () => {
      resolve(reader.result.split(",")[1]);
    };

    reader.readAsDataURL(blob);
  });

  return cacheLogo;
};