export async function onRequest(context) {
    const { request, next, env } = context;
    const url = new URL(request.url);

    // 1. Define Protected Route
    if (url.pathname.startsWith("/premium")) {

        // 2. Check for "Agent Auth" Cookie (Simplified for Phase 1)
        const cookie = request.headers.get("Cookie");
        const isAuthorized = cookie && cookie.includes("agent_access=granted");

        if (!isAuthorized) {
            // 3. Redirect to Unlock Page
            // Use 302 for temporary redirect (Found)
            return Response.redirect(`${url.origin}/unlock/`, 302);
        }
    }

    // 4. Fallback: Allow request to proceed
    return next();
}
