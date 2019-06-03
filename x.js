/**
 * Cloudflare workers implement the service worker spec
 * See: https://developers.cloudflare.com/workers/about/ for an intro
 *
 * Binding an event handler to the fetch event allows your worker to intercept a request for your zone
 */
addEventListener("fetch", event => {
  /**
   * In the event of an uncaught exception, fail open as if the  worker did not exist
   * If you're not sure what you're doing, it's recommended you include this call
   * as the very first thing your worker does in its fetch event listener
   *
   * If you do not include this call, but your worker encounters an uncaught exception
   * while processing your request, your user will see an edge-level error page
   * instead of a response from your site, app or API
   *
   * Read on below for more info on deciding whether to
   * fail open or fail closed in your workers
   */
  event.passThroughOnException()
  //This allows you to return your own Response object from your worker
  event.respondWith(requestWithTLSHeader(event))
})
/**
 * Calls out to our Sentry account to create an exception event
 *
 * Note that for this to work properly with the event.waitUntil() call in the
 * exception block within requestWithTLSHeader, this function must return a promise
 *
 * @returns {Promise}
 */
function promisifiedSentryLog(ex) {
  //Change these constants to your own Sentry values if you want to use this script
  const sentryProjectId = "<Replace-Me-With-Your-Sentry-Project-Id>"
  const sentryAPIKey = "<Replace-Me-With-Your-Sentry-API-Key>"
  const sentrySecretKey = "<Replace-Me-With-Your-Sentry-Secret-Key>"
  //Manually configure our call to Sentry
  let b = {
    project: sentryProjectId,
    logger: "javascript",
    platform: "javascript",
    exception: {
      values: [{ type: "Error", value: ex && ex.message ? ex.message : "Unknown" }]
    }
  }
  let sentryUrl = `https://sentry.io/api/${sentryProjectId}/store/?sentry_version=7&sentry_client=raven-js%2F3.24.2&sentry_key=${sentryAPIKey}&sentry_secret=${sentrySecretKey}`
  /**
   * Fire off a POST request to Sentry's API, which includes our project
   * and credentials information, plus arbitrary logging data
   *
   * In this case, we're passing along the exception message,
   * but you could use this pattern to log anything you want
   *
   * Keep in mind that fetch returns a promise,
   * which is what makes this function compatible with event.waitUntil
   */
  return fetch(sentryUrl, { body: JSON.stringify(b), method: "POST" })
}
/**
 * Creates a new request for the backend that mirrors the incoming request,
 * with the addition of a new header that specifies which TLS version was used
 * in the connection to the edge
 *
 * This is the main function that contains the core logic for this worker
 *
 * It works by checking for the presence of a property 'tlsVersion' that is being forwarded
 * from the edge into the workers platform so that worker scripts can access it
 *
 * The worker starts with a default TLS header. If the tlsVersion property,
 * which represents the version of the TLS protocol the client connected with,
 * is present, the worker sets its local tlsVersion variable to the value of this property
 *
 * It then wraps the incoming request headers in a new headers object,
 * which enables us to append our own custom X-Client-SSL-Protocol header
 *
 * The worker then forwards the original request
 * (overriding the headers with our new headers object) to the origin
 *
 * Now, our application layer can act upon this information
 * to show modals and include deprecation warnings as necessary
 *
 * @returns {Promise}
 */
async function requestWithTLSHeader(event) {
  //It's strongly recommended that you wrap your core worker logic in a try / catch block
  try {
    let tlsVersion = "NONE"
    //Create a new Headers object that includes the original request's headers
    let reqHeaders = new Headers(request.headers)
    if (
      event &&
      event.request &&
      event.request.cf &&
      event.request.cf.tlsVersion &&
      typeof event.request.cf.tlsVersion === "string" &&
      event.request.cf.tlsVersion !== ""
    ) {
      tlsVersion = event.request.cf.tlsVersion
    }
    //Add our new header
    reqHeaders.append("X-Client-SSL-Protocol", tlsVersion)
    //Extend the original request's headers with our own, but otherwise fetch the original request
    return await fetch(event.request, { headers: reqHeaders })
  } catch (ex) {
    /**
     * Signal the runtime that it should wait until the promise resolves
     *
     * This avoids race conditions where the runtime stops execution before
     * our async Sentry task completes
     *
     * If you do not do this, the passthrough subrequest will race
     * your pending asychronous request to Sentry, and you will
     * miss many events / fail to capture them correctly
     */
    event.waitUntil(promisifiedSentryLog(ex))
    /**
     * Intentionally throw the exception in order to trigger the pass-through
     * behavior defined by event.passThroughOnException()
     *
     * This means that our worker will fail open - and not block requests
     * to our backend services due to unexpected exceptions
     */
    throw ex
  }
}
