
import logoCei from "../assets/imagenes/logo.png";

export const obtenerLogoBase64 = async () => {
  const response = await fetch(logoCei);
  const blob = await response.blob();
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(',')[1]); 
    reader.readAsDataURL(blob);
  });
};