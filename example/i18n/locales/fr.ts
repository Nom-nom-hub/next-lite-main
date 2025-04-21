import { registerTranslations } from '../index';

const translations = {
  common: {
    welcome: 'Bienvenue à Next-Lite',
    description: 'Une alternative légère à Next.js',
    buttons: {
      submit: 'Soumettre',
      cancel: 'Annuler',
      save: 'Enregistrer',
      delete: 'Supprimer',
    },
  },
  navigation: {
    home: 'Accueil',
    about: 'À propos',
    features: 'Fonctionnalités',
    contact: 'Contact',
  },
  errors: {
    notFound: 'Page non trouvée',
    serverError: 'Erreur du serveur',
    formInvalid: 'Veuillez vérifier le formulaire pour les erreurs',
  },
  auth: {
    signIn: 'Se connecter',
    signUp: 'S\'inscrire',
    signOut: 'Se déconnecter',
    username: 'Nom d\'utilisateur',
    password: 'Mot de passe',
    email: 'Email',
  },
  greeting: 'Bonjour, {{name}} !',
};

// Register French translations
registerTranslations('fr', translations);

export default translations;
