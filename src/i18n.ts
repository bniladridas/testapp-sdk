import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      nav: {
        project: 'Project',
        languages: 'Languages',
        download: 'Download',
        about: 'About',
      },
      hero: {
        title: 'Brat',
        subtitle: 'Together CLI',
        description:
          'Brat is the software platform. Together CLI is the command-line tool to interact with the Together API using the nvidia/Llama-3.1-Nemotron-70B-Instruct-HF model. Sleek, powerful CLI tools crafted in multiple languages.',
        github: 'View on GitHub',
        download: 'Download v1.0.0',
      },
      features: {
        title: 'Built for developers',
        terminal: 'Command Line First',
        terminalDesc:
          'Designed for developers who live in the terminal. Simple, efficient, and powerful.',
        multi: 'Multi-Language',
        multiDesc:
          'Choose your preferred language. Same functionality, different implementations.',
        ai: 'AI Powered',
        aiDesc:
          'Leverages nvidia/Llama-3.1-Nemotron-70B-Instruct-HF for intelligent responses.',
      },
      languages: {
        title: 'Available languages',
        more: '...and more!',
        moreDesc:
          'Support for additional languages is coming soon. Stay tuned!',
      },
      setup: {
        title: 'Quick setup',
        env: '1. Environment Setup',
        envDesc: 'Create a .env file in the root or language-specific folder:',
        api: '2. API Key',
        apiDesc: 'Replace your_api_key_here with your Together API key.',
        run: '3. Run',
        runDesc:
          "Each CLI takes a prompt as a command-line argument and delivers the API's response with precision.",
      },
      download: {
        title: 'Download v1.0.0',
        desc: 'Get the latest release of Together CLI tools. Available in multiple formats.',
        zip: 'Download ZIP',
        tar: 'Download TAR.GZ',
        changelog: 'View changelog',
      },
      about: {
        title: 'Built with precision',
        desc1:
          'Together CLI represents a commitment to developer experience and multi-language accessibility. Each implementation maintains the same core functionality while embracing the idioms and strengths of its respective language.',
        desc2:
          "From Rust's performance to R's data science capabilities, from Scala's elegance to Fortran's reliability—choose the tool that fits your workflow.",
        featured: 'Featured on LinkedIn',
        chatgpt: 'ChatGPT Integration',
        grok: 'Grok Integration',
      },
      footer: {
        copyright:
          '© {{year}} Brat — Together CLI. Provided as-is, without warranty.',
      },
    },
  },
  es: {
    translation: {
      nav: {
        project: 'Proyecto',
        languages: 'Idiomas',
        download: 'Descargar',
        about: 'Acerca de',
      },
      hero: {
        title: 'Brat',
        subtitle: 'Together CLI',
        description:
          'Brat es la plataforma de software. Together CLI es la herramienta de línea de comandos para interactuar con la API de Together usando el modelo nvidia/Llama-3.1-Nemotron-70B-Instruct-HF. Herramientas CLI elegantes y potentes en múltiples idiomas.',
        github: 'Ver en GitHub',
        download: 'Descargar v1.0.0',
      },
      features: {
        title: 'Hecho para desarrolladores',
        terminal: 'Primero la línea de comandos',
        terminalDesc:
          'Diseñado para desarrolladores que viven en la terminal. Simple, eficiente y potente.',
        multi: 'Multi-idioma',
        multiDesc:
          'Elige tu idioma preferido. Misma funcionalidad, diferentes implementaciones.',
        ai: 'Impulsado por IA',
        aiDesc:
          'Aprovecha nvidia/Llama-3.1-Nemotron-70B-Instruct-HF para respuestas inteligentes.',
      },
      languages: {
        title: 'Idiomas disponibles',
        more: '...¡y más!',
        moreDesc: 'Pronto habrá soporte para más idiomas. ¡Estate atento!',
      },
      setup: {
        title: 'Configuración rápida',
        env: '1. Configuración del entorno',
        envDesc:
          'Crea un archivo .env en la raíz o en la carpeta específica del idioma:',
        api: '2. Clave API',
        apiDesc: 'Reemplaza your_api_key_here con tu clave API de Together.',
        run: '3. Ejecutar',
        runDesc:
          'Cada CLI toma un prompt como argumento y entrega la respuesta de la API con precisión.',
      },
      download: {
        title: 'Descargar v1.0.0',
        desc: 'Obtén la última versión de las herramientas Together CLI. Disponible en varios formatos.',
        zip: 'Descargar ZIP',
        tar: 'Descargar TAR.GZ',
        changelog: 'Ver cambios',
      },
      about: {
        title: 'Hecho con precisión',
        desc1:
          'Together CLI representa un compromiso con la experiencia del desarrollador y la accesibilidad multi-idioma. Cada implementación mantiene la misma funcionalidad principal mientras adopta los matices y fortalezas de su respectivo idioma.',
        desc2:
          'Desde el rendimiento de Rust hasta las capacidades de ciencia de datos de R, desde la elegancia de Scala hasta la fiabilidad de Fortran: elige la herramienta que se adapte a tu flujo de trabajo.',
        featured: 'Destacado en LinkedIn',
        chatgpt: 'Integración con ChatGPT',
        grok: 'Integración con Grok',
      },
      footer: {
        copyright:
          '© {{year}} Brat — Together CLI. Proporcionado tal cual, sin garantía.',
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
