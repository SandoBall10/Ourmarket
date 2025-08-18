export interface User {
  id: number;
  name: string;
  email?: string;
}

export interface Message {
  idMensaje: number;
  contenido: string;
  fechaEnvio: string;
  tipoMensaje: string;
  idCliente: number;
  nombreCliente?: string;
  idInmueble: number;
  isFromCurrentUser?: boolean;
}

export interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount: number;
  isOnline: boolean;
  publicacion?: {
    id: number;
    titulo: string;
    idInmueble: number;
  };
}

export interface Conversacion {
  idInmueble: number;
  tituloPublicacion: string;
  propietarioNombre: string;
  clienteNombre: string;
  ultimoMensaje: Message;
  totalMensajes: number;
  fechaUltimoMensaje: string;
}