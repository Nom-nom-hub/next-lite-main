/* Next-Lite - https://github.com/yourusername/next-lite */
import b from"react";import{createRoot as G}from"react-dom/client";import H,{createContext as J,useContext as U,useState as V,useEffect as I}from"react";var S=J({currentPath:"/",navigate:()=>{}});function c(){return U(S)}function L({routes:a,children:u}){let[p,_]=V(window.location.pathname);I(()=>{let g=()=>{_(window.location.pathname)};return window.addEventListener("popstate",g),()=>window.removeEventListener("popstate",g)},[]);let h=g=>{window.history.pushState({},"",g),_(g)},x=a[p]||a["/"];return H.createElement(S.Provider,{value:{currentPath:p,navigate:h}},x(),u)}import o from"react";var z=document.createElement("style");z.textContent=`.index-module_container_hgFso {
  min-height: 100vh;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.index-module_content_MJrBp {
  max-width: 800px;
  margin: 0 auto;
}

.index-module_title_PlBiC {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 0 1rem 0;
  background: linear-gradient(to right, #7928CA, #FF0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.index-module_description_w6vZF {
  font-size: 1.5rem;
  color: #888;
  text-align: center;
  margin-bottom: 3rem;
}

.index-module_subtitle_pLIcH {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
}

.index-module_list_yIYL9 {
  font-size: 1.2rem;
  color: #ccc;
  line-height: 2;
  margin-bottom: 3rem;
}

.index-module_codeBlock_6R-Pg {
  background: #000;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 3rem;
  font-size: 1.1rem;
  font-family: monospace;
  white-space: pre-wrap;
}

.index-module_navigation_V1ksB {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 3rem;
}

.index-module_button_42xpV {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #7928CA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.index-module_button_42xpV:hover {
  background-color: #6a23b5;
}

.index-module_footer_ytaFh {
  text-align: center;
  margin-top: 4rem;
}

.index-module_link_G-rGG {
  color: #7928CA;
  text-decoration: none;
  font-size: 1.1rem;
}

.index-module_link_G-rGG:hover {
  text-decoration: underline;
}

.index-module_separator_MP3Wo {
  margin: 0 1rem;
  color: #666;
}
`;document.head.appendChild(z);var r={container:"index-module_container_hgFso",content:"index-module_content_MJrBp",title:"index-module_title_PlBiC",description:"index-module_description_w6vZF",subtitle:"index-module_subtitle_pLIcH",list:"index-module_list_yIYL9",codeBlock:"index-module_codeBlock_6R-Pg",navigation:"index-module_navigation_V1ksB",button:"index-module_button_42xpV",footer:"index-module_footer_ytaFh",link:"index-module_link_G-rGG",separator:"index-module_separator_MP3Wo"};function k({message:a}){let{navigate:u}=c();return o.createElement("div",{className:r.container},o.createElement("div",{className:r.content},o.createElement("h1",{className:r.title},a),o.createElement("p",{className:r.description},"A lightweight alternative to Next.js for building modern React applications"),o.createElement("h2",{className:r.subtitle},"Features"),o.createElement("ul",{className:r.list},o.createElement("li",null,"TypeScript & JSX Support"),o.createElement("li",null,"Fast Development Server"),o.createElement("li",null,"ES Modules for Modern Development"),o.createElement("li",null,"Zero Configuration"),o.createElement("li",null,"Hot Module Reloading"),o.createElement("li",null,"API Routes"),o.createElement("li",null,"CSS Modules")),o.createElement("div",{className:r.codeBlock},o.createElement("code",null,"npm create next-lite-app my-app")),o.createElement("div",{className:r.navigation},o.createElement("button",{onClick:()=>u("/about"),className:r.button},"About"),o.createElement("button",{onClick:()=>u("/docs"),className:r.button},"Documentation"),o.createElement("button",{onClick:()=>u("/todos"),className:r.button},"Todo Demo")),o.createElement("div",{className:r.footer},o.createElement("a",{href:"https://github.com/yourusername/next-lite",className:r.link},"GitHub"),o.createElement("span",{className:r.separator},"\u2022"),o.createElement("a",{href:"https://next-lite.dev",className:r.link},"Documentation"))))}import l from"react";var E=document.createElement("style");E.textContent=`.about-module_container_aXjkE {
  min-height: 100vh;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.about-module_content_AyNEA {
  max-width: 800px;
  margin: 0 auto;
}

.about-module_title_pdZzP {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
  background: linear-gradient(to right, #7928CA, #FF0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.about-module_description_oozVZ {
  font-size: 1.5rem;
  color: #888;
  text-align: center;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.about-module_section_c-X-i {
  margin-bottom: 3rem;
}

.about-module_subtitle_ovXHV {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
}

.about-module_text_kQvK8 {
  font-size: 1.2rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.about-module_list_VUkjK {
  font-size: 1.2rem;
  color: #ccc;
  line-height: 2;
  margin-left: 1.5rem;
}

.about-module_button_EVnkk {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #7928CA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;
  margin: 0 auto;
}

.about-module_button_EVnkk:hover {
  background-color: #6a23b5;
}
`;document.head.appendChild(E);var m={container:"about-module_container_aXjkE",content:"about-module_content_AyNEA",title:"about-module_title_pdZzP",description:"about-module_description_oozVZ",section:"about-module_section_c-X-i",subtitle:"about-module_subtitle_ovXHV",text:"about-module_text_kQvK8",list:"about-module_list_VUkjK",button:"about-module_button_EVnkk"};function y(){let{navigate:a}=c();return l.createElement("div",{className:m.container},l.createElement("div",{className:m.content},l.createElement("h1",{className:m.title},"About Next-Lite"),l.createElement("p",{className:m.description},"Next-Lite is a lightweight alternative to Next.js, perfect for developers who want a simpler, more transparent framework without sacrificing the core features that make Next.js great."),l.createElement("div",{className:m.section},l.createElement("h2",{className:m.subtitle},"Our Philosophy"),l.createElement("p",{className:m.text},"We believe that modern web development shouldn't be complex. Next-Lite provides a minimal, yet powerful foundation for building React applications with features like:"),l.createElement("ul",{className:m.list},l.createElement("li",null,"Zero-config TypeScript support"),l.createElement("li",null,"Fast development with HMR"),l.createElement("li",null,"Simple file-based routing"),l.createElement("li",null,"Lightweight bundle size"))),l.createElement("button",{onClick:()=>a("/"),className:m.button},"Back to Home")))}import n from"react";var T=document.createElement("style");T.textContent=`.docs-module_container_5vi6O {
  min-height: 100vh;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.docs-module_content_D1LCD {
  max-width: 800px;
  margin: 0 auto;
}

.docs-module_title_crHUM {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
  background: linear-gradient(to right, #7928CA, #FF0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.docs-module_description_CHZoV {
  font-size: 1.5rem;
  color: #888;
  text-align: center;
  margin-bottom: 3rem;
}

.docs-module_section_wgccM {
  margin-bottom: 3rem;
}

.docs-module_subtitle_NnqyU {
  font-size: 2rem;
  color: #fff;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #7928CA;
}

.docs-module_text_w-GrU {
  font-size: 1.2rem;
  color: #ccc;
  line-height: 1.6;
  margin-bottom: 1.5rem;
}

.docs-module_codeBlock_UJV-R {
  background: #000;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  font-family: monospace;
  font-size: 1.1rem;
  color: #fff;
}

.docs-module_list_ekXX7 {
  font-size: 1.2rem;
  color: #ccc;
  line-height: 2;
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.docs-module_button_DtP4L {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #7928CA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
  display: block;
  margin: 0 auto;
}

.docs-module_button_DtP4L:hover {
  background-color: #6a23b5;
}

.docs-module_navigation_K-uSJ {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}
`;document.head.appendChild(T);var t={container:"docs-module_container_5vi6O",content:"docs-module_content_D1LCD",title:"docs-module_title_crHUM",description:"docs-module_description_CHZoV",section:"docs-module_section_wgccM",subtitle:"docs-module_subtitle_NnqyU",text:"docs-module_text_w-GrU",codeBlock:"docs-module_codeBlock_UJV-R",list:"docs-module_list_ekXX7",button:"docs-module_button_DtP4L",navigation:"docs-module_navigation_K-uSJ"};function N(){let{navigate:a}=c();return n.createElement("div",{className:t.container},n.createElement("div",{className:t.content},n.createElement("h1",{className:t.title},"Documentation"),n.createElement("p",{className:t.description},"Learn how to build modern web applications with Next-Lite"),n.createElement("div",{className:t.section},n.createElement("h2",{className:t.subtitle},"Getting Started"),n.createElement("p",{className:t.text},"Create a new Next-Lite project with a single command:"),n.createElement("div",{className:t.codeBlock},n.createElement("code",null,"npx create-next-lite-app my-app"))),n.createElement("div",{className:t.section},n.createElement("h2",{className:t.subtitle},"Features"),n.createElement("ul",{className:t.list},n.createElement("li",null,"TypeScript & JSX Support"),n.createElement("li",null,"Fast Development Server with HMR"),n.createElement("li",null,"CSS Modules Support"),n.createElement("li",null,"Simple Client-side Routing"),n.createElement("li",null,"Zero Configuration"))),n.createElement("div",{className:t.section},n.createElement("h2",{className:t.subtitle},"Project Structure"),n.createElement("div",{className:t.codeBlock},n.createElement("pre",null,`my-app/
\u251C\u2500\u2500 example/
\u2502   \u251C\u2500\u2500 pages/
\u2502   \u2502   \u251C\u2500\u2500 index.tsx
\u2502   \u2502   \u251C\u2500\u2500 about.tsx
\u2502   \u2502   \u2514\u2500\u2500 docs.tsx
\u2502   \u251C\u2500\u2500 client.tsx
\u2502   \u2514\u2500\u2500 router.tsx
\u251C\u2500\u2500 scripts/
\u2502   \u2514\u2500\u2500 dev.js
\u2514\u2500\u2500 package.json`))),n.createElement("div",{className:t.navigation},n.createElement("button",{onClick:()=>a("/"),className:t.button},"Back to Home"))))}import d,{useState as w,useEffect as Z}from"react";var B=document.createElement("style");B.textContent=`.todos-module_container_hRh0O {
  min-height: 100vh;
  padding: 4rem 1rem;
  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);
  color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.todos-module_content_iJ5qv {
  max-width: 800px;
  margin: 0 auto;
}

.todos-module_title_JA0pZ {
  font-size: 3.5rem;
  font-weight: bold;
  margin: 0 0 2rem 0;
  background: linear-gradient(to right, #7928CA, #FF0080);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  text-align: center;
}

.todos-module_description_D-dls {
  font-size: 1.5rem;
  color: #888;
  text-align: center;
  margin-bottom: 3rem;
}

.todos-module_todoForm_QToMt {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.todos-module_input_sCH22 {
  flex: 1;
  padding: 0.8rem;
  font-size: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 5px;
  color: white;
}

.todos-module_input_sCH22::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.todos-module_button_rjPvm {
  padding: 0.8rem 1.5rem;
  font-size: 1rem;
  background-color: #7928CA;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todos-module_button_rjPvm:hover {
  background-color: #6a23b5;
}

.todos-module_todoList_BSZtf {
  list-style: none;
  padding: 0;
  margin: 0;
}

.todos-module_todoItem_E7xPJ {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  margin-bottom: 1rem;
}

.todos-module_checkbox_Jw0LL {
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.todos-module_todoText_j-RzL {
  flex: 1;
  font-size: 1.1rem;
  color: #fff;
}

.todos-module_completed_nyQkC {
  text-decoration: line-through;
  color: #888;
}

.todos-module_deleteButton_5fv-E {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
  background-color: #dc2626;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.todos-module_deleteButton_5fv-E:hover {
  background-color: #b91c1c;
}

.todos-module_navigation_c8Wf5 {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 3rem;
}
`;document.head.appendChild(B);var i={container:"todos-module_container_hRh0O",content:"todos-module_content_iJ5qv",title:"todos-module_title_JA0pZ",description:"todos-module_description_D-dls",todoForm:"todos-module_todoForm_QToMt",input:"todos-module_input_sCH22",button:"todos-module_button_rjPvm",todoList:"todos-module_todoList_BSZtf",todoItem:"todos-module_todoItem_E7xPJ",checkbox:"todos-module_checkbox_Jw0LL",todoText:"todos-module_todoText_j-RzL",completed:"todos-module_completed_nyQkC",deleteButton:"todos-module_deleteButton_5fv-E",navigation:"todos-module_navigation_c8Wf5"};function C(){let{navigate:a}=c(),[u,p]=w([]),[_,h]=w(""),[x,g]=w(!0);Z(()=>{A()},[]);async function A(){try{let s=await(await fetch("/api/todos")).json();p(s)}catch(e){console.error("Error fetching todos:",e)}finally{g(!1)}}async function j(e){if(e.preventDefault(),!!_.trim())try{let f=await(await fetch("/api/todos",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({text:_})})).json();p(v=>[...v,f]),h("")}catch(s){console.error("Error adding todo:",s)}}async function M(e){try{let f=await(await fetch("/api/todos",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:e.id,completed:!e.completed})})).json();p(v=>v.map(P=>P.id===e.id?f:P))}catch(s){console.error("Error toggling todo:",s)}}async function D(e){try{await fetch(`/api/todos?id=${e}`,{method:"DELETE"}),p(s=>s.filter(f=>f.id!==e))}catch(s){console.error("Error deleting todo:",s)}}return d.createElement("div",{className:i.container},d.createElement("div",{className:i.content},d.createElement("h1",{className:i.title},"Todo List"),d.createElement("p",{className:i.description},"A simple todo list using Next-Lite's API routes"),d.createElement("form",{onSubmit:j,className:i.todoForm},d.createElement("input",{type:"text",value:_,onChange:e=>h(e.target.value),placeholder:"What needs to be done?",className:i.input}),d.createElement("button",{type:"submit",className:i.button},"Add Todo")),x?d.createElement("p",{className:i.description},"Loading todos..."):d.createElement("ul",{className:i.todoList},u.map(e=>d.createElement("li",{key:e.id,className:i.todoItem},d.createElement("input",{type:"checkbox",checked:e.completed,onChange:()=>M(e),className:i.checkbox}),d.createElement("span",{className:`${i.todoText} ${e.completed?i.completed:""}`},e.text),d.createElement("button",{onClick:()=>D(e.id),className:i.deleteButton},"Delete")))),d.createElement("div",{className:i.navigation},d.createElement("button",{onClick:()=>a("/"),className:i.button},"Back to Home"))))}var F=document.getElementById("root");if(!F)throw new Error("Root element not found");var X=G(F),O={"/":()=>b.createElement(k,{message:"Welcome to Next-Lite"}),"/about":()=>b.createElement(y,null),"/docs":()=>b.createElement(N,null),"/todos":()=>b.createElement(C,null)};X.render(b.createElement(b.StrictMode,null,b.createElement(L,{routes:O})));
//# sourceMappingURL=/static/client.js.map
