**1. Task** https://github.com/rolling-scopes-school/tasks/blob/master/react/modules/tasks/final.md
**2. Screenshot**
<img width="1557" height="959" alt="image" src="https://github.com/user-attachments/assets/70ff85ef-bc67-47ea-a286-3b21959ba5e8" />

**3. Deployment:** https://swagger-editor-app-six.vercel.app/
**Code Repo:** https://github.com/TamerMain/swagger-editor-app
**4. Done** ??.??.?? / Deadline 14.07.2026
**5. Score** ??/100

- **Feature 1: App Header (60 points)**
  - [x] Non-authenticated users see Sign In and Sign Up buttons in the header's upper right corner. [15 points]
  - [x] Authenticated users see History and Sign Out buttons in the header's upper right corner. [10 points]
  - [x] Navigation link to About page is available in header and footer. [10 points]
  - [x] If the token is expired/invalid, the user is redirected from private routes to the Main page. [10 points]
  - [x] Pressing the Sign In / Sign Up button redirects to the route with the respective form. [15 points]

- **Feature 2: Sign In / Sign Up (50 points)**
  - [x] Buttons for Sign In / Sign Up / Sign Out are present everywhere they should be. [10 points]
  - [ ] Client-side validation is implemented (email format, password strength: min 8 chars, at least one letter, one digit, one special character, Unicode supported). [20 points]
  - [x] Upon successful login, the user is redirected to the Main page. [10 points]
  - [x] If the user is already logged in and tries to reach Sign In / Sign Up routes, they are redirected to the Main page. [10 points]

- **Feature 3: Swagger Editor (120 points)**
  - [x] Loading/pasting OpenAPI/Swagger schema in JSON and YAML formats is supported. [25 points]
  - [x] Auto-detection of input format (JSON vs YAML) is implemented. [20 points]
  - [x] Format switching with automatic conversion (JSON ↔ YAML) works correctly. [20 points]
  - [x] Schema validation with error indication is implemented. [15 points]
  - [x] Authenticated users can save schemas; the saved schema is automatically restored in the editor upon next login. [10 points]
  - [x] The Viewer automatically populates with endpoints when the schema is valid. [10 points]
  - [x] Responsive split view adjusts based on screen orientation (horizontal/vertical). [20 points]

- **Feature 4: Swagger Viewer (120 points)**
  - [x] Endpoint list is displayed with organization by path/method. [20 points]
  - [x] Endpoint details show method, path, and all parameter types (path, query, header, cookie). [25 points]
  - [x] Request schema and example payloads are displayed. [20 points]
  - [x] Response schema, examples, and all supported status codes are displayed. [25 points]
  - [x] Try-It-Out functionality allows filling parameters, headers, and body; executing requests; and displaying responses. [20 points]
  - [x] Generate cURL button with copy-to-clipboard functionality is implemented. [10 points]

- **Feature 5: History and Analytics (70 points)**
  - [x] History and analytics is server-side generated and shows an informational message with links to the editor/viewer when there are no requests in the database. [15 points]
  - [x] Requests are displayed sorted by timestamp (most recent first). [10 points]
  - [x] The following analytics are recorded from the server side and displayed: request duration, response status code, request timestamp, request method, request size, response size, error details, endpoint/URL. [45 points]

- **Feature 6: About Page (25 points)**
  - [ ] About page is accessible to all users (public route). [5 points]
  - [ ] About page contains information about the RS School course. [5 points]
  - [ ] About page contains team member information (names, roles, GitHub links). [10 points]
  - [ ] About page design is consistent with the application design. [5 points]

- **Feature 7: General Requirements (55 points)**
  - [ ] Multiple (at least 2) languages are supported with an i18n toggler in the header. [30 points]
  - [x] Sticky header with animation when it becomes sticky is implemented. [10 points]
  - [x] Errors are displayed in a user-friendly format. [10 points]
  - [x] Private routes are properly protected (401 if not authenticated). See [RFC 9110](https://www.rfc-editor.org/rfc/rfc9110.html#name-401-unauthorized). [5 points]

- **Feature 8: YouTube Video (50 points)**
  - [ ] A 5–7 minute YouTube video is linked in the pull request demonstrating all implemented features. [50 points]
