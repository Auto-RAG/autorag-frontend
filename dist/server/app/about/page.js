(()=>{var e={};e.id=220,e.ids=[220],e.modules={10846:e=>{"use strict";e.exports=require("next/dist/compiled/next-server/app-page.runtime.prod.js")},19121:e=>{"use strict";e.exports=require("next/dist/server/app-render/action-async-storage.external.js")},29294:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-async-storage.external.js")},63033:e=>{"use strict";e.exports=require("next/dist/server/app-render/work-unit-async-storage.external.js")},33873:e=>{"use strict";e.exports=require("path")},35151:(e,t,r)=>{"use strict";r.r(t),r.d(t,{GlobalError:()=>i.a,__next_app__:()=>u,pages:()=>c,routeModule:()=>m,tree:()=>d});var s=r(70260),o=r(28203),n=r(25155),i=r.n(n),a=r(67292),l={};for(let e in a)0>["default","tree","pages","GlobalError","__next_app__","routeModule"].indexOf(e)&&(l[e]=()=>a[e]);r.d(t,l);let d=["",{children:["about",{children:["__PAGE__",{},{page:[()=>Promise.resolve().then(r.bind(r,7678)),"/Users/martin/Development/org_autorag/autorag-frontend/app/about/page.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,19785)),"/Users/martin/Development/org_autorag/autorag-frontend/app/about/layout.tsx"]}]},{layout:[()=>Promise.resolve().then(r.bind(r,33933)),"/Users/martin/Development/org_autorag/autorag-frontend/app/layout.tsx"],error:[()=>Promise.resolve().then(r.bind(r,72627)),"/Users/martin/Development/org_autorag/autorag-frontend/app/error.tsx"],"not-found":[()=>Promise.resolve().then(r.t.bind(r,19937,23)),"next/dist/client/components/not-found-error"]}],c=["/Users/martin/Development/org_autorag/autorag-frontend/app/about/page.tsx"],u={require:r,loadChunk:()=>Promise.resolve()},m=new s.AppPageRouteModule({definition:{kind:o.RouteKind.APP_PAGE,page:"/about/page",pathname:"/about",bundlePath:"",filename:"",appPaths:[]},userland:{loaderTree:d}})},67697:(e,t,r)=>{Promise.resolve().then(r.bind(r,72627))},57969:(e,t,r)=>{Promise.resolve().then(r.bind(r,94551))},56122:(e,t,r)=>{Promise.resolve().then(r.bind(r,56355)),Promise.resolve().then(r.bind(r,62416))},96290:(e,t,r)=>{Promise.resolve().then(r.bind(r,14855)),Promise.resolve().then(r.bind(r,27140))},74035:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,13219,23)),Promise.resolve().then(r.t.bind(r,34863,23)),Promise.resolve().then(r.t.bind(r,25155,23)),Promise.resolve().then(r.t.bind(r,9350,23)),Promise.resolve().then(r.t.bind(r,96313,23)),Promise.resolve().then(r.t.bind(r,48530,23)),Promise.resolve().then(r.t.bind(r,88921,23))},68459:(e,t,r)=>{Promise.resolve().then(r.t.bind(r,66959,23)),Promise.resolve().then(r.t.bind(r,33875,23)),Promise.resolve().then(r.t.bind(r,88903,23)),Promise.resolve().then(r.t.bind(r,84178,23)),Promise.resolve().then(r.t.bind(r,86013,23)),Promise.resolve().then(r.t.bind(r,87190,23)),Promise.resolve().then(r.t.bind(r,61365,23))},96487:()=>{},78335:()=>{},94551:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var s=r(45512);function o({error:e,reset:t}){return(0,s.jsxs)("div",{children:[(0,s.jsx)("h2",{children:"Something went wrong!"}),(0,s.jsx)("button",{onClick:()=>t(),children:"Try again"})]})}r(58009)},14855:(e,t,r)=>{"use strict";r.d(t,{Providers:()=>a});var s=r(45512);r(58009);var o=r(63144),n=r(79334),i=r(42478);function a({children:e,themeProps:t}){let r=(0,n.useRouter)();return(0,s.jsx)(o.b,{navigate:r.push,children:(0,s.jsx)(i.N,{...t,children:e})})}},27140:(e,t,r)=>{"use strict";r.d(t,{CustomNavigation:()=>l});var s=r(45512),o=r(79334),n=r(87137),i=r(94520),a=r(87021);function l(){let e=(0,o.useRouter)();return(0,s.jsx)("nav",{className:"border-b bg-white",children:(0,s.jsx)("div",{className:"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8",children:(0,s.jsxs)("div",{className:"flex justify-between h-16",children:[(0,s.jsx)("div",{className:"flex",children:(0,s.jsx)("div",{className:"flex-shrink-0 flex items-center",children:(0,s.jsx)(a.$,{className:"text-xl font-bold",variant:"ghost",onClick:()=>e.push("/"),children:"AutoRAG Console"})})}),(0,s.jsxs)("div",{className:"flex items-center space-x-4",children:[(0,s.jsxs)(a.$,{size:"sm",variant:"ghost",onClick:()=>e.push("/"),children:[(0,s.jsx)(n.A,{className:"h-5 w-5 mr-2"}),"Home"]}),(0,s.jsxs)(a.$,{size:"sm",variant:"ghost",onClick:()=>e.push("/projects"),children:[(0,s.jsx)(n.A,{className:"h-5 w-5 mr-2"}),"Projects"]}),(0,s.jsxs)(a.$,{size:"sm",variant:"ghost",onClick:()=>e.push("/settings"),children:[(0,s.jsx)(i.A,{className:"h-5 w-5 mr-2"}),"Settings"]})]})]})})})}},87021:(e,t,r)=>{"use strict";r.d(t,{$:()=>d});var s=r(45512),o=r(58009),n=r(12705),i=r(32101),a=r(59462);let l=(0,i.F)("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",{variants:{variant:{default:"bg-primary text-primary-foreground shadow hover:bg-primary/90",destructive:"bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",outline:"border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",secondary:"bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",ghost:"hover:bg-accent hover:text-accent-foreground",link:"text-primary underline-offset-4 hover:underline"},size:{default:"h-9 px-4 py-2",sm:"h-8 rounded-md px-3 text-xs",lg:"h-10 rounded-md px-8",icon:"h-9 w-9"}},defaultVariants:{variant:"default",size:"default"}}),d=o.forwardRef(({className:e,variant:t,size:r,asChild:o=!1,...i},d)=>{let c=o?n.DX:"button";return(0,s.jsx)(c,{ref:d,className:(0,a.cn)(l({variant:t,size:r,className:e})),...i})});d.displayName="Button"},59462:(e,t,r)=>{"use strict";r.d(t,{cn:()=>n});var s=r(82281),o=r(94805);function n(...e){return(0,o.QP)((0,s.$)(e))}},19785:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>o});var s=r(62740);function o({children:e}){return(0,s.jsx)("section",{className:"flex flex-col items-center justify-center gap-4 py-8 md:py-10",children:(0,s.jsx)("div",{className:"inline-block max-w-lg text-center justify-center",children:e})})}},7678:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>n});var s=r(62740),o=r(39531);function n(){return(0,s.jsx)("div",{children:(0,s.jsx)("h1",{className:(0,o.D)(),children:"About"})})}},72627:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call the default export of \"/Users/martin/Development/org_autorag/autorag-frontend/app/error.tsx\" from the server, but it's on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/martin/Development/org_autorag/autorag-frontend/app/error.tsx","default")},33933:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>m,metadata:()=>c,viewport:()=>u});var s=r(62740);r(23141);var o=r(13673),n=r(56355);let i={name:"Next.js + NextUI",description:"Make beautiful websites regardless of your design experience."};var a=r(92280),l=r.n(a),d=r(62416);let c={title:{default:i.name,template:`%s - ${i.name}`},description:i.description,icons:{icon:"/favicon.ico"}},u={themeColor:[{media:"(prefers-color-scheme: light)",color:"white"},{media:"(prefers-color-scheme: dark)",color:"black"}]};function m({children:e}){return(0,s.jsxs)("html",{suppressHydrationWarning:!0,lang:"en",children:[(0,s.jsx)("head",{}),(0,s.jsx)("body",{className:(0,o.A)("min-h-screen bg-background font-sans antialiased",l().variable),children:(0,s.jsx)(n.Providers,{themeProps:{attribute:"class",defaultTheme:"light"},children:(0,s.jsxs)("div",{className:"relative flex flex-col h-screen",children:[(0,s.jsxs)("div",{className:"min-h-screen bg-gray-50",children:[(0,s.jsx)(d.CustomNavigation,{}),(0,s.jsx)("main",{className:"max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8",children:e})]}),(0,s.jsx)("footer",{className:"fixed bottom-0 w-full flex items-center justify-center py-3 bg-background border-t",children:"AutoRAG Inc."})]})})})]})}},56355:(e,t,r)=>{"use strict";r.d(t,{Providers:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call Providers() from the server but Providers is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/martin/Development/org_autorag/autorag-frontend/app/providers.tsx","Providers")},62416:(e,t,r)=>{"use strict";r.d(t,{CustomNavigation:()=>s});let s=(0,r(46760).registerClientReference)(function(){throw Error("Attempted to call CustomNavigation() from the server but CustomNavigation is on the client. It's not possible to invoke a client function from the server, it can only be rendered as a Component or passed to props of a Client Component.")},"/Users/martin/Development/org_autorag/autorag-frontend/components/custom-navigation.tsx","CustomNavigation")},39531:(e,t,r)=>{"use strict";r.d(t,{D:()=>o});var s=r(41956);let o=(0,s.tv)({base:"tracking-tight inline font-semibold",variants:{color:{violet:"from-[#FF1CF7] to-[#b249f8]",yellow:"from-[#FF705B] to-[#FFB457]",blue:"from-[#5EA2EF] to-[#0072F5]",cyan:"from-[#00b7fa] to-[#01cfea]",green:"from-[#6FEE8D] to-[#17c964]",pink:"from-[#FF72E1] to-[#F54C7A]",foreground:"dark:from-[#FFFFFF] dark:to-[#4B4B4B]"},size:{sm:"text-3xl lg:text-4xl",md:"text-[2.3rem] lg:text-5xl leading-9",lg:"text-4xl lg:text-6xl"},fullWidth:{true:"w-full block"}},defaultVariants:{size:"md"},compoundVariants:[{color:["violet","yellow","blue","cyan","green","pink","foreground"],class:"bg-clip-text text-transparent bg-gradient-to-b"}]});(0,s.tv)({base:"w-full md:w-1/2 my-2 text-lg lg:text-xl text-default-600 block max-w-full",variants:{fullWidth:{true:"!w-full"}},defaultVariants:{fullWidth:!0}})},23141:()=>{}};var t=require("../../webpack-runtime.js");t.C(e);var r=e=>t(t.s=e),s=t.X(0,[621,956],()=>r(35151));module.exports=s})();