eventQueryService.js:28 尝试获取事件数据: /api/event
content.js:1 Content script loaded
contentScript.js:40 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'query')
    at qt (contentScript.js:40:58038)
    at contentScript.js:40:58915
    at new Promise (<anonymous>)
    at Object.get (contentScript.js:40:58865)
    at contentScript.js:40:59628
    at el (contentScript.js:40:24177)
    at ut (contentScript.js:40:42061)
    at contentScript.js:40:40416
    at E (contentScript.js:25:1562)
    at MessagePort.bt (contentScript.js:25:1930)
qt @ contentScript.js:40
(anonymous) @ contentScript.js:40
get @ contentScript.js:40
(anonymous) @ contentScript.js:40
el @ contentScript.js:40
ut @ contentScript.js:40
(anonymous) @ contentScript.js:40
E @ contentScript.js:25
bt @ contentScript.js:25Understand this error
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
EventList.jsx:9 Warning: Each child in a list should have a unique "key" prop.

Check the render method of `EventList`. See https://reactjs.org/link/warning-keys for more information.
    at EventCard (http://localhost:5173/src/utils/EventCard.jsx:20:22)
    at EventList (http://localhost:5173/src/utils/EventList.jsx:20:22)
    at div
    at HomePage (http://localhost:5173/src/pages/HomePage.jsx?t=1747050306846:26:47)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4493:26)
    at main
    at div
    at MainLayout
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4557:5)
    at AppRoutes
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4500:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:5246:5)
    at App
overrideMethod @ hook.js:608
printWarning @ react_jsx-dev-runtime.js?v=c50d74f2:62
error @ react_jsx-dev-runtime.js?v=c50d74f2:46
validateExplicitKey @ react_jsx-dev-runtime.js?v=c50d74f2:722
validateChildKeys @ react_jsx-dev-runtime.js?v=c50d74f2:735
jsxWithValidation @ react_jsx-dev-runtime.js?v=c50d74f2:853
EventList @ EventList.jsx:9
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
mountIndeterminateComponent @ chunk-XPR23Y44.js?v=c50d74f2:14924
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15912
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19751
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performConcurrentWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18676
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this error
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
getFeaturedEvents @ eventQueryService.js:59
(anonymous) @ HomePage.jsx:14
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
getFeaturedEvents @ eventQueryService.js:59
(anonymous) @ HomePage.jsx:14
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
invokePassiveEffectMountInDEV @ chunk-XPR23Y44.js?v=c50d74f2:18322
invokeEffectsInDev @ chunk-XPR23Y44.js?v=c50d74f2:19699
commitDoubleInvokeEffectsInDEV @ chunk-XPR23Y44.js?v=c50d74f2:19684
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19501
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
localhost/:1 [DOM] Input elements should have autocomplete attributes (suggested: "current-password"): (More info: https://goo.gl/9p2vKq) <input type=​"password" id=​"password" required value>​
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
LoginForm.jsx:7 LoginForm rendering: {isModal: true, hasOnForgotPassword: true}
user-service.js:21 Login API response: {data: Array(1), message: 'ok'}
auth-client.js:31 Fetch finished loading: POST "http://localhost:5173/api/login".
authRequest @ auth-client.js:31
login @ user-service.js:16
handleLogin @ Header.jsx:79
handleSubmit @ LoginForm.jsx:15
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
invokeGuardedCallbackAndCatchFirstError @ chunk-XPR23Y44.js?v=c50d74f2:3734
executeDispatch @ chunk-XPR23Y44.js?v=c50d74f2:7012
processDispatchQueueItemsInOrder @ chunk-XPR23Y44.js?v=c50d74f2:7032
processDispatchQueue @ chunk-XPR23Y44.js?v=c50d74f2:7041
dispatchEventsForPlugins @ chunk-XPR23Y44.js?v=c50d74f2:7049
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:7172
batchedUpdates$1 @ chunk-XPR23Y44.js?v=c50d74f2:18911
batchedUpdates @ chunk-XPR23Y44.js?v=c50d74f2:3577
dispatchEventForPluginEventSystem @ chunk-XPR23Y44.js?v=c50d74f2:7171
dispatchEventWithEnableCapturePhaseSelectiveHydrationWithoutDiscreteEventReplay @ chunk-XPR23Y44.js?v=c50d74f2:5476
dispatchEvent @ chunk-XPR23Y44.js?v=c50d74f2:5470
dispatchDiscreteEvent @ chunk-XPR23Y44.js?v=c50d74f2:5447
user-service.js:29 Extracted user data from array: {updated_at: '2025-05-12 11:22:26.821624', created_at: '2025-05-12 11:22:26.821624', name: 'testAdminn', password: '5fae31539e070a690c1b63720c25eb5b86084b5098a942c86c89c1d67157ed6b', role: 'ADMIN', …}
user-service.js:50 用户角色: ADMIN
Header.jsx:85 Login successful: {updated_at: '2025-05-12 11:22:26.821624', created_at: '2025-05-12 11:22:26.821624', name: 'testAdminn', password: '5fae31539e070a690c1b63720c25eb5b86084b5098a942c86c89c1d67157ed6b', role: 'ADMIN', …}
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18872
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18872
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18872
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
recoverFromConcurrentError @ chunk-XPR23Y44.js?v=c50d74f2:18734
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18877
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
hook.js:608 The above error occurred in the <EventManagement> component:

    at EventManagement (http://localhost:5173/src/pages/admin/EventManagement.jsx?t=1747050306846:24:31)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4493:26)
    at div
    at main
    at div
    at AdminLayout (http://localhost:5173/src/components/layout/AdminLayout.jsx?t=1747050306846:25:20)
    at AdminRoute (http://localhost:5173/src/routes/index.jsx?t=1747050306846:40:23)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4557:5)
    at AppRoutes
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4500:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:5246:5)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ hook.js:608
logCapturedError @ chunk-XPR23Y44.js?v=c50d74f2:14030
update.callback @ chunk-XPR23Y44.js?v=c50d74f2:14050
callCallback @ chunk-XPR23Y44.js?v=c50d74f2:11246
commitUpdateQueue @ chunk-XPR23Y44.js?v=c50d74f2:11263
commitLayoutEffectOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:17091
commitLayoutMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:17978
commitLayoutEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:17967
commitLayoutEffects @ chunk-XPR23Y44.js?v=c50d74f2:17918
commitRootImpl @ chunk-XPR23Y44.js?v=c50d74f2:19351
commitRoot @ chunk-XPR23Y44.js?v=c50d74f2:19275
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18893
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
chunk-XPR23Y44.js?v=c50d74f2:9127 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19751:22)
    at performUnitOfWork (chunk-XPR23Y44.js?v=c50d74f2:19196:20)
    at workLoopSync (chunk-XPR23Y44.js?v=c50d74f2:19135:13)
    at renderRootSync (chunk-XPR23Y44.js?v=c50d74f2:19114:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19751
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
recoverFromConcurrentError @ chunk-XPR23Y44.js?v=c50d74f2:18734
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18877
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
client:495 [vite] connecting...
client:618 [vite] connected.
Navigated to http://localhost:5173/admin/events/create
App.jsx:8 VITE_APP_API_URL:12 
App.jsx:8 VITE_APP_API_URL:12 
hook.js:608 ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=c50d74f2:5246:5)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=c50d74f2:4392
logDeprecation @ react-router-dom.js?v=c50d74f2:4395
logV6DeprecationWarnings @ react-router-dom.js?v=c50d74f2:4398
(anonymous) @ react-router-dom.js?v=c50d74f2:5270
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this warning
hook.js:608 ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=c50d74f2:5246:5)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=c50d74f2:4392
logDeprecation @ react-router-dom.js?v=c50d74f2:4395
logV6DeprecationWarnings @ react-router-dom.js?v=c50d74f2:4401
(anonymous) @ react-router-dom.js?v=c50d74f2:5270
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this warning
content.js:1 Content script loaded
contentScript.js:40 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'query')
    at qt (contentScript.js:40:58038)
    at contentScript.js:40:58915
    at new Promise (<anonymous>)
    at Object.get (contentScript.js:40:58865)
    at contentScript.js:40:59628
    at el (contentScript.js:40:24177)
    at ut (contentScript.js:40:42061)
    at contentScript.js:40:40416
    at E (contentScript.js:25:1562)
    at MessagePort.bt (contentScript.js:25:1930)
qt @ contentScript.js:40
(anonymous) @ contentScript.js:40
get @ contentScript.js:40
(anonymous) @ contentScript.js:40
el @ contentScript.js:40
ut @ contentScript.js:40
(anonymous) @ contentScript.js:40
E @ contentScript.js:25
bt @ contentScript.js:25Understand this error
apiConfig.js:30 [API] 请求URL: /api/event
eventQueryService.js:28 尝试获取事件数据: /api/event
apiConfig.js:30 [API] 请求URL: /api/event
eventQueryService.js:28 尝试获取事件数据: /api/event
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
(anonymous) @ AdminDashboard.jsx:103
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
commitRootImpl @ chunk-XPR23Y44.js?v=c50d74f2:19414
commitRoot @ chunk-XPR23Y44.js?v=c50d74f2:19275
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18893
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performConcurrentWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18676
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this error
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performConcurrentWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18676
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this error
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
(anonymous) @ AdminDashboard.jsx:103
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
invokePassiveEffectMountInDEV @ chunk-XPR23Y44.js?v=c50d74f2:18322
invokeEffectsInDev @ chunk-XPR23Y44.js?v=c50d74f2:19699
commitDoubleInvokeEffectsInDEV @ chunk-XPR23Y44.js?v=c50d74f2:19684
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19501
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
commitRootImpl @ chunk-XPR23Y44.js?v=c50d74f2:19414
commitRoot @ chunk-XPR23Y44.js?v=c50d74f2:19275
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18893
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18872
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
recoverFromConcurrentError @ chunk-XPR23Y44.js?v=c50d74f2:18734
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18877
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
hook.js:608 The above error occurred in the <EventManagement> component:

    at EventManagement (http://localhost:5173/src/pages/admin/EventManagement.jsx?t=1747050306846:24:31)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4493:26)
    at div
    at main
    at div
    at AdminLayout (http://localhost:5173/src/components/layout/AdminLayout.jsx?t=1747050306846:25:20)
    at AdminRoute (http://localhost:5173/src/routes/index.jsx?t=1747050306846:40:23)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4557:5)
    at AppRoutes
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4500:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:5246:5)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ hook.js:608
logCapturedError @ chunk-XPR23Y44.js?v=c50d74f2:14030
update.callback @ chunk-XPR23Y44.js?v=c50d74f2:14050
callCallback @ chunk-XPR23Y44.js?v=c50d74f2:11246
commitUpdateQueue @ chunk-XPR23Y44.js?v=c50d74f2:11263
commitLayoutEffectOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:17091
commitLayoutMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:17978
commitLayoutEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:17967
commitLayoutEffects @ chunk-XPR23Y44.js?v=c50d74f2:17918
commitRootImpl @ chunk-XPR23Y44.js?v=c50d74f2:19351
commitRoot @ chunk-XPR23Y44.js?v=c50d74f2:19275
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18893
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
chunk-XPR23Y44.js?v=c50d74f2:9127 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19751:22)
    at performUnitOfWork (chunk-XPR23Y44.js?v=c50d74f2:19196:20)
    at workLoopSync (chunk-XPR23Y44.js?v=c50d74f2:19135:13)
    at renderRootSync (chunk-XPR23Y44.js?v=c50d74f2:19114:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19751
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
recoverFromConcurrentError @ chunk-XPR23Y44.js?v=c50d74f2:18734
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18877
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
client:495 [vite] connecting...
Navigated to http://localhost:5173/admin
client:618 [vite] connected.
App.jsx:8 VITE_APP_API_URL:12 
App.jsx:8 VITE_APP_API_URL:12 
apiConfig.js:30 [API] 请求URL: /api/event
eventQueryService.js:28 尝试获取事件数据: /api/event
hook.js:608 ⚠️ React Router Future Flag Warning: React Router will begin wrapping state updates in `React.startTransition` in v7. You can use the `v7_startTransition` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_starttransition. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=c50d74f2:5246:5)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=c50d74f2:4392
logDeprecation @ react-router-dom.js?v=c50d74f2:4395
logV6DeprecationWarnings @ react-router-dom.js?v=c50d74f2:4398
(anonymous) @ react-router-dom.js?v=c50d74f2:5270
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this warning
hook.js:608 ⚠️ React Router Future Flag Warning: Relative route resolution within Splat routes is changing in v7. You can use the `v7_relativeSplatPath` future flag to opt-in early. For more information, see https://reactrouter.com/v6/upgrading/future#v7_relativesplatpath. Error Component Stack
    at BrowserRouter (react-router-dom.js?v=c50d74f2:5246:5)
    at App (<anonymous>)
overrideMethod @ hook.js:608
warnOnce @ react-router-dom.js?v=c50d74f2:4392
logDeprecation @ react-router-dom.js?v=c50d74f2:4395
logV6DeprecationWarnings @ react-router-dom.js?v=c50d74f2:4401
(anonymous) @ react-router-dom.js?v=c50d74f2:5270
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this warning
apiConfig.js:30 [API] 请求URL: /api/event
eventQueryService.js:28 尝试获取事件数据: /api/event
content.js:1 Content script loaded
contentScript.js:40 Uncaught (in promise) TypeError: Cannot read properties of undefined (reading 'query')
    at qt (contentScript.js:40:58038)
    at contentScript.js:40:58915
    at new Promise (<anonymous>)
    at Object.get (contentScript.js:40:58865)
    at contentScript.js:40:59628
    at el (contentScript.js:40:24177)
    at ut (contentScript.js:40:42061)
    at contentScript.js:40:40416
    at E (contentScript.js:25:1562)
    at MessagePort.bt (contentScript.js:25:1930)
qt @ contentScript.js:40
(anonymous) @ contentScript.js:40
get @ contentScript.js:40
(anonymous) @ contentScript.js:40
el @ contentScript.js:40
ut @ contentScript.js:40
(anonymous) @ contentScript.js:40
E @ contentScript.js:25
bt @ contentScript.js:25Understand this error
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performConcurrentWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18676
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this error
chunk-XPR23Y44.js?v=c50d74f2:1230 Error: <polyline> attribute points: Expected number, "0% 100% 3.4482758…".
setValueForProperty @ chunk-XPR23Y44.js?v=c50d74f2:1230
setInitialDOMProperties @ chunk-XPR23Y44.js?v=c50d74f2:7460
setInitialProperties @ chunk-XPR23Y44.js?v=c50d74f2:7593
finalizeInitialChildren @ chunk-XPR23Y44.js?v=c50d74f2:8343
completeWork @ chunk-XPR23Y44.js?v=c50d74f2:16291
completeUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19222
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19204
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performConcurrentWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18676
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382Understand this error
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
(anonymous) @ AdminDashboard.jsx:103
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
commitPassiveMountOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:18154
commitPassiveMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:18127
commitPassiveMountEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:18117
commitPassiveMountEffects @ chunk-XPR23Y44.js?v=c50d74f2:18107
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19488
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382
apiConfig.js:67 获取事件 成功响应: {data: Array(3), message: 'ok'}
eventQueryService.js:30 Fetch finished loading: GET "http://localhost:5173/api/event".
getAllEvents @ eventQueryService.js:30
(anonymous) @ AdminDashboard.jsx:103
commitHookEffectListMount @ chunk-XPR23Y44.js?v=c50d74f2:16913
invokePassiveEffectMountInDEV @ chunk-XPR23Y44.js?v=c50d74f2:18322
invokeEffectsInDev @ chunk-XPR23Y44.js?v=c50d74f2:19699
commitDoubleInvokeEffectsInDEV @ chunk-XPR23Y44.js?v=c50d74f2:19684
flushPassiveEffectsImpl @ chunk-XPR23Y44.js?v=c50d74f2:19501
flushPassiveEffects @ chunk-XPR23Y44.js?v=c50d74f2:19445
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:19326
workLoop @ chunk-XPR23Y44.js?v=c50d74f2:195
flushWork @ chunk-XPR23Y44.js?v=c50d74f2:174
performWorkUntilDeadline @ chunk-XPR23Y44.js?v=c50d74f2:382
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18872
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
EventManagement.jsx:82 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at HTMLUnknownElement.callCallback2 (chunk-XPR23Y44.js?v=c50d74f2:3672:22)
    at Object.invokeGuardedCallbackDev (chunk-XPR23Y44.js?v=c50d74f2:3697:24)
    at invokeGuardedCallback (chunk-XPR23Y44.js?v=c50d74f2:3731:39)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19763:15)
(anonymous) @ EventManagement.jsx:82
EventManagement @ EventManagement.jsx:80
renderWithHooks @ chunk-XPR23Y44.js?v=c50d74f2:11546
updateFunctionComponent @ chunk-XPR23Y44.js?v=c50d74f2:14580
beginWork @ chunk-XPR23Y44.js?v=c50d74f2:15922
callCallback2 @ chunk-XPR23Y44.js?v=c50d74f2:3672
invokeGuardedCallbackDev @ chunk-XPR23Y44.js?v=c50d74f2:3697
invokeGuardedCallback @ chunk-XPR23Y44.js?v=c50d74f2:3731
beginWork$1 @ chunk-XPR23Y44.js?v=c50d74f2:19763
performUnitOfWork @ chunk-XPR23Y44.js?v=c50d74f2:19196
workLoopSync @ chunk-XPR23Y44.js?v=c50d74f2:19135
renderRootSync @ chunk-XPR23Y44.js?v=c50d74f2:19114
recoverFromConcurrentError @ chunk-XPR23Y44.js?v=c50d74f2:18734
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18877
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
hook.js:608 The above error occurred in the <EventManagement> component:

    at EventManagement (http://localhost:5173/src/pages/admin/EventManagement.jsx?t=1747050306846:24:31)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Outlet (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4493:26)
    at div
    at main
    at div
    at AdminLayout (http://localhost:5173/src/components/layout/AdminLayout.jsx?t=1747050306846:25:20)
    at AdminRoute (http://localhost:5173/src/routes/index.jsx?t=1747050306846:40:23)
    at RenderedRoute (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4087:5)
    at Routes (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4557:5)
    at AppRoutes
    at Router (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:4500:15)
    at BrowserRouter (http://localhost:5173/node_modules/.vite/deps/react-router-dom.js?v=c50d74f2:5246:5)
    at App

Consider adding an error boundary to your tree to customize error handling behavior.
Visit https://reactjs.org/link/error-boundaries to learn more about error boundaries.
overrideMethod @ hook.js:608
logCapturedError @ chunk-XPR23Y44.js?v=c50d74f2:14030
update.callback @ chunk-XPR23Y44.js?v=c50d74f2:14050
callCallback @ chunk-XPR23Y44.js?v=c50d74f2:11246
commitUpdateQueue @ chunk-XPR23Y44.js?v=c50d74f2:11263
commitLayoutEffectOnFiber @ chunk-XPR23Y44.js?v=c50d74f2:17091
commitLayoutMountEffects_complete @ chunk-XPR23Y44.js?v=c50d74f2:17978
commitLayoutEffects_begin @ chunk-XPR23Y44.js?v=c50d74f2:17967
commitLayoutEffects @ chunk-XPR23Y44.js?v=c50d74f2:17918
commitRootImpl @ chunk-XPR23Y44.js?v=c50d74f2:19351
commitRoot @ chunk-XPR23Y44.js?v=c50d74f2:19275
performSyncWorkOnRoot @ chunk-XPR23Y44.js?v=c50d74f2:18893
flushSyncCallbacks @ chunk-XPR23Y44.js?v=c50d74f2:9117
(anonymous) @ chunk-XPR23Y44.js?v=c50d74f2:18625Understand this error
chunk-XPR23Y44.js?v=c50d74f2:9127 Uncaught TypeError: Cannot read properties of undefined (reading 'substring')
    at EventManagement.jsx:82:35
    at Array.map (<anonymous>)
    at EventManagement (EventManagement.jsx:80:32)
    at renderWithHooks (chunk-XPR23Y44.js?v=c50d74f2:11546:26)
    at updateFunctionComponent (chunk-XPR23Y44.js?v=c50d74f2:14580:28)
    at beginWork (chunk-XPR23Y44.js?v=c50d74f2:15922:22)
    at beginWork$1 (chunk-XPR23Y44.js?v=c50d74f2:19751:22)
    at performUnitOfWork (chunk-XPR23Y44.js?v=c50d74f2:19196:20)
    at workLoopSync (chunk-XPR23Y44.js?v=c50d74f2:19135:13)
    at renderRootSync (chunk-XPR23Y44.js?v=c50d74f2:19114:15)