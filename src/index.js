export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    
    // नई response बनाएँ ताकि headers modify कर सकें
    const newResponse = new Response(response.body, response);
    
    // Security headers जोड़ें
    newResponse.headers.set('X-Content-Type-Options', 'nosniff');
    newResponse.headers.set('X-Frame-Options', 'DENY');
    newResponse.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    newResponse.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()');
    newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
    newResponse.headers.set(
      'Content-Security-Policy',
      "default-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; object-src 'none'; script-src 'self' https://static.cloudflareinsights.com; style-src 'self' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: blob: https:; connect-src 'self' https://api.micromath.in https://cloudflareinsights.com; upgrade-insecure-requests"
    );
    
    // index.html के लिए Cache-Control
    const url = new URL(request.url);
    if (url.pathname === '/' || url.pathname === '/index.html') {
      newResponse.headers.set('Cache-Control', 'no-store');
    }
    
    return newResponse;
  }
};
