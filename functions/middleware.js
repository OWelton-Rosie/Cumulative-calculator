export async function onRequest(context) {
  // If someone visits the .pages.dev domain, redirect
  if (context.request.url.includes(".pages.dev")) {
    let url = new URL(context.request.url);
    return Response.redirect(
      "https://cumulative.oweltonrosie.com" + url.pathname + url.search,
      301
    );
  }

  // Otherwise, serve normally
  return context.next();
}
