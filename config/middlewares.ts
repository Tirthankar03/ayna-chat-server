export default [
  'strapi::logger',
  'strapi::errors',
  'strapi::security',
  {
    name: 'strapi::cors',
    config: {
      origin: ['https://ayna-chat-tn.vercel.app', 'http://localhost:3000'],
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'],
      headers: ['Content-Type', 'Authorization', 'Origin', 'Accept'],
      credentials: true,
    },
  },  
  'strapi::poweredBy',
  'strapi::query',
  'strapi::body',
  {
    name: 'strapi::session',
    config: {
      secure: 'true',
      sameSite: 'none',
      httpOnly: true,
    },
  },
  'strapi::favicon',
  'strapi::public',
];
