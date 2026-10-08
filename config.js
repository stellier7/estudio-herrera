// ============================================================
// ESTUDIO HERRERA — todo el contenido del cliente vive aquí.
// No inventar servicios, precios, equipo, testimonios ni premios.
// Fotos: reemplaza los placeholders de gallery y heroImage.
// ============================================================

const CONFIG = {
  lang: "es",

  brandName: "Estudio Herrera",
  legalName: "Estudio Herrera S. de R. L.",
  tagline: "Es tiempo de brillar",
  specialty: "Salón de belleza",
  heroEyebrow: "Salón de belleza en Comayagua",
  heroHeadlineLines: ["Estudio", "Herrera"],
  heroSub: "Es tiempo de brillar",

  whatsappNumber: "50432799695",
  whatsappDefaultMessage: "Hola, quisiera agendar una cita en Estudio Herrera",
  phoneDisplay: "+504 3279-9695",
  phoneE164: "+50432799695",

  address: {
    full: "Golf Club, Edificio Bellini, 2do. Nivel, Comayagua 12101, Honduras",
    street: "Golf Club, Edificio Bellini, 2do. Nivel",
    locality: "Comayagua",
    postalCode: "12101",
    country: "HN",
  },

  // Horario publicado en Google Places. Aún no confirmado con el salón.
  hours: [
    {
      day: "Lun — Vie",
      time: "8:00 AM – 5:00 PM",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    { day: "Sábado", time: "Cerrado" },
    {
      day: "Domingo",
      time: "9:00 AM – 4:00 PM",
      days: ["Sunday"],
      opens: "09:00",
      closes: "16:00",
    },
  ],

  instagramHandle: "@eestudio_hherrera",
  instagramUrl: "https://www.instagram.com/eestudio_hherrera",

  mapsUrl: "https://maps.app.goo.gl/PR8RLDJ6jXosQWdd6",
  mapsEmbedUrl: "https://maps.google.com/maps?q=14.4712361,-87.6158268&z=16&hl=es&output=embed",
  geo: { latitude: 14.4712361, longitude: -87.6158268 },

  colors: {
    cream: "#000000",
    cream2: "#0A0A0A",
    ink: "#FFFFFF",
    inkSoft: "#C8B8BE",
    inkFaint: "#8A737C",
    accent: "#E8B4C4",
    accentInv: "#1A1014",
    accentHover: "rgba(232,180,196,0.14)",
    gray: "#1A1216",
    grayLight: "#140E11",
    line: "rgba(232,180,196,0.22)",
    lineStrong: "rgba(232,180,196,0.45)",
  },

  // Menú copiado de las piezas del salón. Ninguna trae precio.
  services: [
    {
      label: "Bodas",
      name: "Paquetes para Bodas",
      wide: true,
      groups: [
        {
          name: "Paquete Plata",
          items: [
            "Peinado",
            "Hidratación preparación de la piel",
            "Hidratación parches hidrogel para ojos",
            "Diseño y modelado de cejas",
            "Maquillaje de larga duración Línea Profesional",
            "Pestañas postizas",
          ],
        },
        {
          name: "Paquete Oro",
          items: [
            "Lavado, secado y peinado",
            "Hidratación y preparación de la piel",
            "Hidratación parches hidrogel para ojos",
            "Hidratación y exfoliacion de labios",
            "Diseño y modelado de cejas",
            "Maquillaje de larga duración Profesional",
            "Pestañas postizas",
            "Prueba de peinado y maquillaje (Opcional)",
          ],
        },
      ],
    },
    {
      label: "Spa manos pies",
      name: "Spa manos pies",
      items: [
        "Retirado Cuticula",
        "Retirado de esmaltado",
        "Esmaltado normal",
        "Esmaltado semipermanente",
        "Aplicación calcio",
        "Aplicación de Acrílico",
        "Aplicación Acryl Gel",
        "Diseño en uñas",
        "Aplicación colágeno",
        "Limado callosidades",
        "Exfoliación",
        "Masaje relajante",
        "Aplicación Gel Ohhh",
        "Aplicación Parafina",
        "Aplicación Baño de Leche",
        "Detox spa",
        "Spa normal",
        "Spa Clínico Podológico",
      ],
    },
    {
      label: "Cabello",
      name: "Cabello",
      items: [
        "Lavado de cabello",
        "Secado de cabello",
        "Planchado de cabello",
        "Corte de cabello",
        "Aplicación de tintes",
        "Aplicación de tratamientos",
        "Keratina",
        "Nanoplastia",
        "Ondas",
        "Trenzas",
        "Peinado sencillo",
        "Peinado elaborado",
      ],
    },
    {
      label: "Depilación con cera",
      name: "Depilación con cera",
      wide: true,
      groups: [
        {
          name: "Facial",
          items: ["Rostro completo", "Cejas", "Bigote", "Barbilla"],
        },
        {
          name: "Corporal",
          items: [
            "Axilas",
            "Abdomen",
            "Espalda",
            "Área de bikini",
            "Bikini brasileño",
            "Medias piernas",
            "Piernas completas",
            "Brazos",
            "Dedos pies y manos",
          ],
        },
      ],
    },
    {
      label: "Pestañas y Cejas",
      name: "Pestañas y Cejas",
      items: [
        "Lifting de pestañas",
        "Extensión de pestañas clásicas, Hibridas, volumen, mega volumen y hawaianas",
        "Pestañas pelo a pelo",
        "Retoque de pestañas pelo a pelo",
        "Retirado de pestañas",
        "Pestañas postizas",
        "Laminado de cejas",
        "Depilación, perfilado y modelado de cejas",
        "Definición y tintado de cejas con Henna",
      ],
    },
    {
      label: "Maquillaje",
      name: "Maquillaje",
      items: [
        "Maquillaje Social",
        "Maquillaje para Novias",
        "Maquillaje para 15 años",
        "Maquillaje de día / noche",
        "Maquillaje para sesión fotográfica",
        "Maquillaje Artístico",
        "Prueba de Maquillaje para Novias",
      ],
    },
  ],

  gallery: [
    { placeholder: "[FOTO]" },
    { placeholder: "[FOTO]" },
    { placeholder: "[FOTO]" },
    { placeholder: "[FOTO]" },
    { placeholder: "[FOTO]" },
    { placeholder: "[FOTO]" },
  ],

  testimonials: [],

  heroImage: "",
  visitImage: "",

  credit: {
    label: "Desarrollado por",
    name: "IAGO Digital",
    url: "https://www.iagodigital.com/",
  },

  ui: {
    pageTitle: "Estudio Herrera | Salón de Belleza en Comayagua",
    metaDescription:
      "Estudio Herrera, salón de belleza en Golf Club, Edificio Bellini, 2do. Nivel, Comayagua. Cabello, maquillaje, pestañas, cejas, spa de manos y pies, depilación con cera y paquetes para bodas. Agenda por WhatsApp.",
    navBook: "Agendar",
    heroCta: "Agendar por WhatsApp",
    heroSecondary: "Ver servicios",
    heroScroll: "Desliza",
    servicesEyebrow: "Conoce nuestros servicios",
    servicesTitle: "Servicios",
    galleryEyebrow: "Galería",
    galleryTitle: "Fotos del salón",
    galleryImageAlt: "Foto de Estudio Herrera",
    visitEyebrow: "Ubicación y horario",
    visitTitle: "Edificio Bellini, Comayagua",
    contactEyebrow: "Contacto",
    contactTitle: "Agenda tu cita",
    mapCta: "Abrir en Google Maps",
    mapTitle: "Mapa de Estudio Herrera",
    footerCta: "Agendar por WhatsApp",
    whatsappLabel: "WhatsApp",
    metaSpecialty: "Especialidad",
    metaHours: "Horario",
    metaContact: "Contacto directo",
    gallerySoon: "[FOTO]",
    lightboxLabel: "Vista previa de galería",
    lightboxClose: "Cerrar",
    lightboxPrev: "Anterior",
    lightboxNext: "Siguiente",
  },
};
