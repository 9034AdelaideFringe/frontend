# Debugging Module Import/Export Issues in React Services

This lesson summarizes the debugging process and solutions for `ReferenceError` issues encountered during the refactoring of service modules, specifically focusing on import and export syntax in JavaScript modules.

## 1. Initial Problem: `Uncaught SyntaxError: ... does not provide an export named 'getTicketAnalytics'`

**Issue:** The application failed to start with a `SyntaxError` indicating that the `getTicketAnalytics` function was not exported by the `ticketService.js` module.

**Root Cause:** During refactoring, the `getTicketAnalytics` function, which previously relied on mock data, was removed from the main `ticketService.js` file. The component trying to import it was still expecting this export.

**Solution:**
1.  Implement the `getTicketAnalytics` function using the actual API endpoint (`GET /api/ticket`) in a new file, e.g., [`src/services/ticketService/operations/analytics.js`](src/services/ticketService/operations/analytics.js).
2.  Ensure this new function is exported from [`src/services/ticketService/operations/analytics.js`](src/services/ticketService/operations/analytics.js).
3.  Re-export `getTicketAnalytics` from the main [`src/services/ticketService/index.js`](src/services/ticketService/index.js) file.
4.  Ensure the compatibility wrapper [`src/services/ticketService.js`](src/services/ticketService.js) correctly re-exports everything from [`src/services/ticketService/index.js`](src/services/ticketService/index.js) (e.g., using `export * from './ticketService/index';`).
5.  Update the component using `getTicketAnalytics` (e.g., [`src/pages/admin/AdminDashboard.jsx`](src/pages/admin/AdminDashboard.jsx)) to import it from the correct service path.

## 2. First `ReferenceError: getUserTickets is not defined`

**Issue:** After resolving the `SyntaxError`, a `ReferenceError: getUserTickets is not defined` occurred in the console, pointing to [`src/services/ticketService/index.js`](src/services/ticketService/index.js) (initially reported as `index.js`) at line 19, where `getUserTickets` was used within the `export default { ... }` object.

**Initial Hypothesis:** The `getUserTickets` function was not correctly defined or exported from its source file (`./operations/query.js`), or there was an issue in its dependencies (`authService`, `utils`).

**Debugging Steps:**
1.  Added `console.log` statements at the beginning of various service files (`shared/apiConfig.js`, `authService/*`, `ticketService/*`) to trace the module evaluation order.
2.  Analyzed the console output, which showed that [`src/services/ticketService/operations/query.js`](src/services/ticketService/operations/query.js) (the source of `getUserTickets`) was successfully evaluated and logged that `getUserTickets` was defined.

**Root Cause:** The `ReferenceError` occurred in [`src/services/ticketService/index.js`](src/services/ticketService/index.js) because, while `getUserTickets` was correctly exported from `query.js` and correctly imported *for named export* in [`src/services/ticketService/index.js`](src/services/ticketService/index.js) using `export { getUserTickets, getTicketById } from './operations/query';`, this specific syntax **does not** bring `getUserTickets` into the *local scope* of [`src/services/ticketService/index.js`](src/services/ticketService/index.js). Therefore, when the `export default { getUserTickets, ... }` object was being constructed, the `getUserTickets` variable was not defined in that local scope.

**Solution:** Separate the import and the named export for `getUserTickets` (and `getTicketById`) in [`src/services/ticketService/index.js`](src/services/ticketService/index.js).

**Incorrect (Causes ReferenceError in default export):**

````javascript
// filepath: src/services/ticketService/index.js
export { getUserTickets, getTicketById } from './operations/query'; // Imports and immediately exports, doesn't add to local scope

export default {
  getUserTickets, // ReferenceError here
  getTicketById,  // ReferenceError here
  // ...
};
````

**Correct (Imports to local scope, then exports):**

````javascript
// filepath: src/services/ticketService/index.js
import { getUserTickets, getTicketById } from './operations/query'; // Imports to local scope
export { getUserTickets, getTicketById }; // Named export from local scope

export default {
  getUserTickets, // Now defined in local scope
  getTicketById,  // Now defined in local scope
  // ...
};
````

## 3. Second `ReferenceError: refundTicket is not defined`

**Issue:** After fixing the `getUserTickets` error, a similar `ReferenceError: refundTicket is not defined` occurred, also in [`src/services/ticketService/index.js`](src/services/ticketService/index.js), pointing to the line where `refundTicket` was used in the `export default { ... }` object.

**Root Cause:** This was the exact same issue as the `getUserTickets` error. The `refundTicket` function was imported and immediately named exported using `export { refundTicket } from './operations/management';`, which did not bring `refundTicket` into the local scope for the `export default` statement.

**Solution:** Apply the same solution as for `getUserTickets` and `getTicketById`: separate the import and the named export for `refundTicket` (and similarly for `downloadTicket` and `getTicketAnalytics`).

**Incorrect (Causes ReferenceError in default export):**

````javascript
// filepath: src/services/ticketService/index.js
export { refundTicket } from './operations/management'; // Imports and immediately exports, doesn't add to local scope

export default {
  // ...
  refundTicket, // ReferenceError here
  // ...
};
````

**Correct (Imports to local scope, then exports):**

````javascript
// filepath: src/services/ticketService/index.js
import { refundTicket } from './operations/management'; // Imports to local scope
export { refundTicket }; // Named export from local scope

export default {
  // ...
  refundTicket, // Now defined in local scope
  // ...
};
````

## Key Takeaways

*   **Understand Module Import/Export Syntax:** Be mindful of the different ways to import and export in JavaScript modules.
    *   `import { name } from 'module';`: Imports `name` from `'module'` into the current module's local scope.
    *   `export { name };`: Exports `name` from the current module's local scope as a named export.
    *   `export { name } from 'module';`: Imports `name` from `'module'` and immediately re-exports it as a named export from the current module. Crucially, this does **NOT** add `name` to the current module's local scope.
    *   `export * from 'module';`: Re-exports all named exports from `'module'` as named exports from the current module. Does not add them to the local scope.
    *   `export default { ... };`: Exports an object as the default export. All properties of this object must be variables or functions defined in the current module's local scope.
*   **Local Scope is Key for `export default`:** If you want to include a variable or function in a default export object (`export default { ... }`), it must be available in the local scope of that file. Using `export { name } from 'module'` will not make `name` available for the default export.
*   **Use `console.log` for Debugging Module Loading:** Adding `console.log` statements at the very top of files and after import statements can help trace the order of module evaluation and confirm whether imports were successful before errors occur.
*   **Check the First Error:** When multiple errors appear in the console, the first one is usually the root cause. Subsequent errors are often consequences of the initial failure (e.g., a module failing to load causes `ReferenceError` in files that try to import from it).
*   **Separate Concerns:** Keep routing configuration files focused on routing. Data fetching and other side effects should primarily reside within the components that need the data, typically triggered by React hooks like `useEffect`.

By understanding these concepts and using systematic debugging techniques like adding logs, you can effectively identify and resolve module-related errors in your application.