// ============================================================
// ESTUDIO HERRERA — todo el contenido del cliente vive aquí.
// Servicios y precios: solo lo que venga del salón.
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

  hours: [
    {
      day: "Lun — Vie",
      time: "8:00 AM – 5:00 PM",
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "08:00",
      closes: "17:00",
    },
    {
      day: "Sábado",
      time: "9:00 AM – 5:00 PM",
      days: ["Saturday"],
      opens: "09:00",
      closes: "17:00",
    },
    {
      day: "Domingo",
      time: "10:00 AM – 5:00 PM",
      days: ["Sunday"],
      opens: "10:00",
      closes: "17:00",
    },
  ],

  instagramHandle: "@eestudio_hherrera",
  instagramUrl: "https://www.instagram.com/eestudio_hherrera",

  mapsUrl: "https://maps.app.goo.gl/PR8RLDJ6jXosQWdd6",
  mapsEmbedUrl: "https://maps.google.com/maps?q=14.4712361,-87.6158268&z=16&hl=es&output=embed",
  geo: { latitude: 14.4712361, longitude: -87.6158268 },

  logo: "images/logo.jpg",
  logoMark: "images/logo-mark.png",

  colors: {
    cream: "#E5D5C7",
    cream2: "#F6EEE6",
    ink: "#1A1A1A",
    inkSoft: "#5C514A",
    inkFaint: "#8A7B72",
    accent: "#F08AAD",
    accentInv: "#1A1A1A",
    accentHover: "rgba(240,138,173,0.18)",
    gray: "#EFE4DA",
    grayLight: "#F8F2EB",
    line: "rgba(26,26,26,0.12)",
    lineStrong: "rgba(26,26,26,0.28)",
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
    { src: "images/unas-rojas.jpg", alt: "Esmaltado rojo" },
    { src: "images/cabello-liso.jpg", alt: "Cabello liso" },
    { src: "images/unas-nude.jpg", alt: "Uñas nude con brillo" },
    { src: "images/unas-cristal.jpg", alt: "Uñas nude" },
    { src: "images/peinado-ondas.jpg", alt: "Peinado ondulado" },
    { src: "images/unas-arte.jpg", alt: "Diseño de uñas" },
    { src: "images/unas-rosas.jpg", alt: "Esmaltado rosa" },
    { src: "images/recogido.jpg", alt: "Recogido con trenzas" },
    { src: "images/salon-unas.jpg", alt: "Atención de uñas en el salón" },
  ],

  testimonials: [
    {
      quote: "Me hice las uñas y el acabado quedó parejo, brillante y muy delicado. Se nota el cuidado.",
      name: "Valeria M.",
    },
    {
      quote: "Salí con el cabello liso y con mucha luz. El trato fue atento de principio a fin.",
      name: "Daniela R.",
    },
    {
      quote: "El peinado para mi evento quedó hermoso, con un acabado que se veía en las fotos.",
      name: "Camila S.",
    },
  ],

  heroImage: "images/salon-unas.jpg",
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
    servicesNote: "Los precios se consultan por WhatsApp.",
    galleryEyebrow: "Galería",
    galleryTitle: "Nuestro trabajo",
    testimonialsEyebrow: "Reseñas",
    testimonialsTitle: "Experiencias en el salón",
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
