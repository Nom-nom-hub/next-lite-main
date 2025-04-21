import { registerTranslations } from '../index';

const translations = {
  common: {
    welcome: 'Bienvenido a Next-Lite',
    description: 'Una alternativa ligera a Next.js',
    buttons: {
      submit: 'Enviar',
      cancel: 'Cancelar',
      save: 'Guardar',
      delete: 'Eliminar',
    },
  },
  navigation: {
    home: 'Inicio',
    about: 'Acerca de',
    features: 'Características',
    contact: 'Contacto',
  },
  errors: {
    notFound: 'Página no encontrada',
    serverError: 'Error del servidor',
    formInvalid: 'Por favor, revise el formulario para ver si hay errores',
  },
  auth: {
    signIn: 'Iniciar sesión',
    signUp: 'Registrarse',
    signOut: 'Cerrar sesión',
    username: 'Nombre de usuario',
    password: 'Contraseña',
    email: 'Correo electrónico',
  },
  greeting: '¡Hola, {{name}}!',
};

// Register Spanish translations
registerTranslations('es', translations);

export default translations;
