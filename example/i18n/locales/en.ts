import { registerTranslations } from '../index';

const translations = {
  common: {
    welcome: 'Welcome to Next-Lite',
    description: 'A lightweight alternative to Next.js',
    buttons: {
      submit: 'Submit',
      cancel: 'Cancel',
      save: 'Save',
      delete: 'Delete',
    },
  },
  navigation: {
    home: 'Home',
    about: 'About',
    features: 'Features',
    contact: 'Contact',
  },
  errors: {
    notFound: 'Page not found',
    serverError: 'Server error',
    formInvalid: 'Please check the form for errors',
  },
  auth: {
    signIn: 'Sign In',
    signUp: 'Sign Up',
    signOut: 'Sign Out',
    username: 'Username',
    password: 'Password',
    email: 'Email',
  },
  greeting: 'Hello, {{name}}!',
};

// Register English translations
registerTranslations('en', translations);

export default translations;
