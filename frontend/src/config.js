export const BACKEND_URI = process.env.REACT_APP_BACKEND_URI;

if(!BACKEND_URI){
    throw new Error("BACKEND_URI is not defined");
}