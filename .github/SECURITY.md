# Security Policy

This is a **client-side only** application. Image compression and processing are performed entirely within your browser using local resources.

* **No Data Collection:** Your images are never uploaded to a server.
* **Privacy by Design:** Because there is no "backend", we cannot see, store, or share your data. There are also no ads, no cookies/trackers and no logging that are used in the website.

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report them via one of the following methods:

1. **Email:** blair@collector.org
2. **GitHub Private Reporting:** Use the "Report a vulnerability" button under the Security tab of this repository.

You can expect a reply within **a week**. I will provide a detailed response and a timeline for a fix if needed.

---

### 1. User Responsibility

Since processing happens locally, you as the user is responsible for the browser in which the website runs. I recommend using an up to date, modern browser (Chrome, Firefox, Brave, or Safari).

### 2. Malicious Files

While it is rare for an image file to "infect" a static web app, we use typed interfaces (TypeScript) and standard web api's to handle blobs.

### 3. Third Party Dependencies

I regularly audit the `npm` packages using `npm audit` and checking **Dependabot** security updates and make sure no vulnerabilities can be misused.

### 4. Content Security Policy (CSP)

This site uses headers that prevent unauthorized scripts from running, so even if a dependency is vulnerable, your data remains in the local context.

---

> [!NOTE]
> If you are using this tool for highly sensitive/classified documents, I recommend running the application in an "Incognito/Private" window or an isolated browser profile so no browser extensions can capture your screen or data.
