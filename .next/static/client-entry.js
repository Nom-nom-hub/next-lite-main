var __async = (__this, __arguments, generator) => {
  return new Promise((resolve, reject) => {
    var fulfilled = (value) => {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    };
    var rejected = (value) => {
      try {
        step(generator.throw(value));
      } catch (e) {
        reject(e);
      }
    };
    var step = (x) => x.done ? resolve(x.value) : Promise.resolve(x.value).then(fulfilled, rejected);
    step((generator = generator.apply(__this, __arguments)).next());
  });
};

// .next/client-entry.tsx
import React3 from "react";
import { createRoot } from "react-dom/client";

// example/router.tsx
import { createContext, useContext, useState, useEffect } from "react";
import { jsx, jsxs } from "react/jsx-runtime";
var RouterContext = createContext({
  currentPath: "/",
  navigate: () => {
  }
});
function useRouter() {
  return useContext(RouterContext);
}
function RouterProvider({ routes: routes2 }) {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);
  const navigate = (path) => {
    window.history.pushState({}, "", path);
    setCurrentPath(path);
    window.dispatchEvent(new CustomEvent("pushstate"));
  };
  console.log("Current path:", currentPath);
  console.log("Available routes:", Object.keys(routes2));
  const Component = routes2[currentPath];
  if (!Component) {
    console.warn(`No route found for path: ${currentPath}`);
    return /* @__PURE__ */ jsxs("div", { style: { padding: "2rem", textAlign: "center" }, children: [
      /* @__PURE__ */ jsx("h1", { children: "404 - Page Not Found" }),
      /* @__PURE__ */ jsx("p", { children: "The page you're looking for doesn't exist." }),
      /* @__PURE__ */ jsxs("p", { children: [
        "Current path: ",
        currentPath
      ] }),
      /* @__PURE__ */ jsx("button", { onClick: () => navigate("/"), style: { marginTop: "1rem" }, children: "Go Home" })
    ] });
  }
  return /* @__PURE__ */ jsx(RouterContext.Provider, { value: { currentPath, navigate }, children: /* @__PURE__ */ jsx(Component, {}) });
}

// example/pages/index.module.css
var style = document.createElement("style");
style.textContent = ".index-module_container_hgFso {\n  min-height: 100vh;\n  padding: 4rem 1rem;\n  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n\n.index-module_content_MJrBp {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.index-module_title_PlBiC {\n  font-size: 3.5rem;\n  font-weight: bold;\n  margin: 0 0 1rem 0;\n  background: linear-gradient(to right, #7928CA, #FF0080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-align: center;\n}\n\n.index-module_description_w6vZF {\n  font-size: 1.5rem;\n  color: #888;\n  text-align: center;\n  margin-bottom: 3rem;\n}\n\n.index-module_subtitle_pLIcH {\n  font-size: 2rem;\n  color: #fff;\n  margin-bottom: 1rem;\n}\n\n.index-module_list_yIYL9 {\n  font-size: 1.2rem;\n  color: #ccc;\n  line-height: 2;\n  margin-bottom: 3rem;\n}\n\n.index-module_codeBlock_6R-Pg {\n  background: #000;\n  padding: 1.5rem;\n  border-radius: 8px;\n  margin-bottom: 3rem;\n  font-size: 1.1rem;\n  font-family: monospace;\n  white-space: pre-wrap;\n}\n\n.index-module_navigation_V1ksB {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-bottom: 3rem;\n}\n\n.index-module_button_42xpV {\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n  background-color: #7928CA;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.index-module_button_42xpV:hover {\n  background-color: #6a23b5;\n}\n\n.index-module_footer_ytaFh {\n  text-align: center;\n  margin-top: 4rem;\n}\n\n.index-module_link_G-rGG {\n  color: #7928CA;\n  text-decoration: none;\n  font-size: 1.1rem;\n}\n\n.index-module_link_G-rGG:hover {\n  text-decoration: underline;\n}\n\n.index-module_separator_MP3Wo {\n  margin: 0 1rem;\n  color: #666;\n}\n";
document.head.appendChild(style);
var index_module_default = {
  "container": "index-module_container_hgFso",
  "content": "index-module_content_MJrBp",
  "title": "index-module_title_PlBiC",
  "description": "index-module_description_w6vZF",
  "subtitle": "index-module_subtitle_pLIcH",
  "list": "index-module_list_yIYL9",
  "codeBlock": "index-module_codeBlock_6R-Pg",
  "navigation": "index-module_navigation_V1ksB",
  "button": "index-module_button_42xpV",
  "footer": "index-module_footer_ytaFh",
  "link": "index-module_link_G-rGG",
  "separator": "index-module_separator_MP3Wo"
};

// example/pages/index.tsx
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function HomePage() {
  const { navigate } = useRouter();
  return /* @__PURE__ */ jsx2("div", { className: index_module_default.container, children: /* @__PURE__ */ jsxs2("div", { className: index_module_default.content, children: [
    /* @__PURE__ */ jsx2("h1", { className: index_module_default.title, children: "Welcome to Next-Lite" }),
    /* @__PURE__ */ jsx2("p", { className: index_module_default.description, children: "A lightweight alternative to Next.js for building modern React applications" }),
    /* @__PURE__ */ jsx2("h2", { className: index_module_default.subtitle, children: "Features" }),
    /* @__PURE__ */ jsxs2("ul", { className: index_module_default.list, children: [
      /* @__PURE__ */ jsx2("li", { children: "TypeScript & JSX Support" }),
      /* @__PURE__ */ jsx2("li", { children: "Fast Development Server" }),
      /* @__PURE__ */ jsx2("li", { children: "ES Modules for Modern Development" }),
      /* @__PURE__ */ jsx2("li", { children: "Zero Configuration" }),
      /* @__PURE__ */ jsx2("li", { children: "Hot Module Reloading" }),
      /* @__PURE__ */ jsx2("li", { children: "API Routes" }),
      /* @__PURE__ */ jsx2("li", { children: "CSS Modules" })
    ] }),
    /* @__PURE__ */ jsx2("div", { className: index_module_default.codeBlock, children: /* @__PURE__ */ jsx2("code", { children: "npm create next-lite-app my-app" }) }),
    /* @__PURE__ */ jsxs2("div", { className: index_module_default.navigation, children: [
      /* @__PURE__ */ jsx2("button", { onClick: () => navigate("/features"), className: index_module_default.button, children: "Features" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => navigate("/about"), className: index_module_default.button, children: "About" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => navigate("/docs"), className: index_module_default.button, children: "Documentation" }),
      /* @__PURE__ */ jsx2("button", { onClick: () => navigate("/todos"), className: index_module_default.button, children: "Todo Demo" })
    ] }),
    /* @__PURE__ */ jsxs2("div", { className: index_module_default.footer, children: [
      /* @__PURE__ */ jsx2("a", { href: "https://github.com/yourusername/next-lite", className: index_module_default.link, children: "GitHub" }),
      /* @__PURE__ */ jsx2("span", { className: index_module_default.separator, children: "\u2022" }),
      /* @__PURE__ */ jsx2("a", { href: "https://next-lite.dev", className: index_module_default.link, children: "Documentation" })
    ] })
  ] }) });
}

// example/pages/about.module.css
var style2 = document.createElement("style");
style2.textContent = ".about-module_container_aXjkE {\n  min-height: 100vh;\n  padding: 4rem 1rem;\n  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n\n.about-module_content_AyNEA {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.about-module_title_pdZzP {\n  font-size: 3.5rem;\n  font-weight: bold;\n  margin: 0 0 2rem 0;\n  background: linear-gradient(to right, #7928CA, #FF0080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-align: center;\n}\n\n.about-module_description_oozVZ {\n  font-size: 1.5rem;\n  color: #888;\n  text-align: center;\n  margin-bottom: 3rem;\n  line-height: 1.6;\n}\n\n.about-module_section_c-X-i {\n  margin-bottom: 3rem;\n}\n\n.about-module_subtitle_ovXHV {\n  font-size: 2rem;\n  color: #fff;\n  margin-bottom: 1rem;\n}\n\n.about-module_text_kQvK8 {\n  font-size: 1.2rem;\n  color: #ccc;\n  line-height: 1.6;\n  margin-bottom: 1.5rem;\n}\n\n.about-module_list_VUkjK {\n  font-size: 1.2rem;\n  color: #ccc;\n  line-height: 2;\n  margin-left: 1.5rem;\n}\n\n.about-module_button_EVnkk {\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n  background-color: #7928CA;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n  display: block;\n  margin: 0 auto;\n}\n\n.about-module_button_EVnkk:hover {\n  background-color: #6a23b5;\n}\n";
document.head.appendChild(style2);
var about_module_default = {
  "container": "about-module_container_aXjkE",
  "content": "about-module_content_AyNEA",
  "title": "about-module_title_pdZzP",
  "description": "about-module_description_oozVZ",
  "section": "about-module_section_c-X-i",
  "subtitle": "about-module_subtitle_ovXHV",
  "text": "about-module_text_kQvK8",
  "list": "about-module_list_VUkjK",
  "button": "about-module_button_EVnkk"
};

// example/pages/about.tsx
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function AboutPage() {
  const { navigate } = useRouter();
  return /* @__PURE__ */ jsx3("div", { className: about_module_default.container, children: /* @__PURE__ */ jsxs3("div", { className: about_module_default.content, children: [
    /* @__PURE__ */ jsx3("h1", { className: about_module_default.title, children: "About Next-Lite" }),
    /* @__PURE__ */ jsx3("p", { className: about_module_default.description, children: "Next-Lite is a lightweight alternative to Next.js, perfect for developers who want a simpler, more transparent framework without sacrificing the core features that make Next.js great." }),
    /* @__PURE__ */ jsxs3("div", { className: about_module_default.section, children: [
      /* @__PURE__ */ jsx3("h2", { className: about_module_default.subtitle, children: "Our Philosophy" }),
      /* @__PURE__ */ jsx3("p", { className: about_module_default.text, children: "We believe that modern web development shouldn't be complex. Next-Lite provides a minimal, yet powerful foundation for building React applications with features like:" }),
      /* @__PURE__ */ jsxs3("ul", { className: about_module_default.list, children: [
        /* @__PURE__ */ jsx3("li", { children: "Zero-config TypeScript support" }),
        /* @__PURE__ */ jsx3("li", { children: "Fast development with HMR" }),
        /* @__PURE__ */ jsx3("li", { children: "Simple file-based routing" }),
        /* @__PURE__ */ jsx3("li", { children: "Lightweight bundle size" })
      ] })
    ] }),
    /* @__PURE__ */ jsx3(
      "button",
      {
        onClick: () => navigate("/"),
        className: about_module_default.button,
        children: "Back to Home"
      }
    )
  ] }) });
}

// example/pages/docs.module.css
var style3 = document.createElement("style");
style3.textContent = ".docs-module_container_5vi6O {\n  min-height: 100vh;\n  padding: 4rem 1rem;\n  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n\n.docs-module_content_D1LCD {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.docs-module_title_crHUM {\n  font-size: 3.5rem;\n  font-weight: bold;\n  margin: 0 0 2rem 0;\n  background: linear-gradient(to right, #7928CA, #FF0080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-align: center;\n}\n\n.docs-module_description_CHZoV {\n  font-size: 1.5rem;\n  color: #888;\n  text-align: center;\n  margin-bottom: 3rem;\n}\n\n.docs-module_section_wgccM {\n  margin-bottom: 3rem;\n}\n\n.docs-module_subtitle_NnqyU {\n  font-size: 2rem;\n  color: #fff;\n  margin-bottom: 1rem;\n  padding-bottom: 0.5rem;\n  border-bottom: 2px solid #7928CA;\n}\n\n.docs-module_text_w-GrU {\n  font-size: 1.2rem;\n  color: #ccc;\n  line-height: 1.6;\n  margin-bottom: 1.5rem;\n}\n\n.docs-module_codeBlock_UJV-R {\n  background: #000;\n  padding: 1.5rem;\n  border-radius: 8px;\n  margin: 1.5rem 0;\n  font-family: monospace;\n  font-size: 1.1rem;\n  color: #fff;\n}\n\n.docs-module_list_ekXX7 {\n  font-size: 1.2rem;\n  color: #ccc;\n  line-height: 2;\n  margin-left: 1.5rem;\n  margin-bottom: 1.5rem;\n}\n\n.docs-module_button_DtP4L {\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n  background-color: #7928CA;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n  display: block;\n  margin: 0 auto;\n}\n\n.docs-module_button_DtP4L:hover {\n  background-color: #6a23b5;\n}\n\n.docs-module_navigation_K-uSJ {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 3rem;\n}\n";
document.head.appendChild(style3);
var docs_module_default = {
  "container": "docs-module_container_5vi6O",
  "content": "docs-module_content_D1LCD",
  "title": "docs-module_title_crHUM",
  "description": "docs-module_description_CHZoV",
  "section": "docs-module_section_wgccM",
  "subtitle": "docs-module_subtitle_NnqyU",
  "text": "docs-module_text_w-GrU",
  "codeBlock": "docs-module_codeBlock_UJV-R",
  "list": "docs-module_list_ekXX7",
  "button": "docs-module_button_DtP4L",
  "navigation": "docs-module_navigation_K-uSJ"
};

// example/pages/docs.tsx
import { jsx as jsx4, jsxs as jsxs4 } from "react/jsx-runtime";
function DocsPage() {
  const { navigate } = useRouter();
  return /* @__PURE__ */ jsx4("div", { className: docs_module_default.container, children: /* @__PURE__ */ jsxs4("div", { className: docs_module_default.content, children: [
    /* @__PURE__ */ jsx4("h1", { className: docs_module_default.title, children: "Documentation" }),
    /* @__PURE__ */ jsx4("p", { className: docs_module_default.description, children: "Learn how to build modern web applications with Next-Lite" }),
    /* @__PURE__ */ jsxs4("div", { className: docs_module_default.section, children: [
      /* @__PURE__ */ jsx4("h2", { className: docs_module_default.subtitle, children: "Getting Started" }),
      /* @__PURE__ */ jsx4("p", { className: docs_module_default.text, children: "Create a new Next-Lite project with a single command:" }),
      /* @__PURE__ */ jsx4("div", { className: docs_module_default.codeBlock, children: /* @__PURE__ */ jsx4("code", { children: "npx create-next-lite-app my-app" }) })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: docs_module_default.section, children: [
      /* @__PURE__ */ jsx4("h2", { className: docs_module_default.subtitle, children: "Features" }),
      /* @__PURE__ */ jsxs4("ul", { className: docs_module_default.list, children: [
        /* @__PURE__ */ jsx4("li", { children: "TypeScript & JSX Support" }),
        /* @__PURE__ */ jsx4("li", { children: "Fast Development Server with HMR" }),
        /* @__PURE__ */ jsx4("li", { children: "CSS Modules Support" }),
        /* @__PURE__ */ jsx4("li", { children: "Simple Client-side Routing" }),
        /* @__PURE__ */ jsx4("li", { children: "Zero Configuration" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs4("div", { className: docs_module_default.section, children: [
      /* @__PURE__ */ jsx4("h2", { className: docs_module_default.subtitle, children: "Project Structure" }),
      /* @__PURE__ */ jsx4("div", { className: docs_module_default.codeBlock, children: /* @__PURE__ */ jsx4("pre", { children: `my-app/
\u251C\u2500\u2500 example/
\u2502   \u251C\u2500\u2500 pages/
\u2502   \u2502   \u251C\u2500\u2500 index.tsx
\u2502   \u2502   \u251C\u2500\u2500 about.tsx
\u2502   \u2502   \u2514\u2500\u2500 docs.tsx
\u2502   \u251C\u2500\u2500 client.tsx
\u2502   \u2514\u2500\u2500 router.tsx
\u251C\u2500\u2500 scripts/
\u2502   \u2514\u2500\u2500 dev.js
\u2514\u2500\u2500 package.json` }) })
    ] }),
    /* @__PURE__ */ jsx4("div", { className: docs_module_default.navigation, children: /* @__PURE__ */ jsx4("button", { onClick: () => navigate("/"), className: docs_module_default.button, children: "Back to Home" }) })
  ] }) });
}

// example/pages/todos.tsx
import { useState as useState2, useEffect as useEffect2 } from "react";

// example/pages/todos.module.css
var style4 = document.createElement("style");
style4.textContent = ".todos-module_container_hRh0O {\n  min-height: 100vh;\n  padding: 4rem 1rem;\n  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n\n.todos-module_content_iJ5qv {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.todos-module_title_JA0pZ {\n  font-size: 3.5rem;\n  font-weight: bold;\n  margin: 0 0 2rem 0;\n  background: linear-gradient(to right, #7928CA, #FF0080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-align: center;\n}\n\n.todos-module_description_D-dls {\n  font-size: 1.5rem;\n  color: #888;\n  text-align: center;\n  margin-bottom: 3rem;\n}\n\n.todos-module_todoForm_QToMt {\n  display: flex;\n  gap: 1rem;\n  margin-bottom: 2rem;\n}\n\n.todos-module_input_sCH22 {\n  flex: 1;\n  padding: 0.8rem;\n  font-size: 1rem;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  border-radius: 5px;\n  color: white;\n}\n\n.todos-module_input_sCH22::placeholder {\n  color: rgba(255, 255, 255, 0.5);\n}\n\n.todos-module_button_rjPvm {\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n  background-color: #7928CA;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.todos-module_button_rjPvm:hover {\n  background-color: #6a23b5;\n}\n\n.todos-module_todoList_BSZtf {\n  list-style: none;\n  padding: 0;\n  margin: 0;\n}\n\n.todos-module_todoItem_E7xPJ {\n  display: flex;\n  align-items: center;\n  gap: 1rem;\n  padding: 1rem;\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 5px;\n  margin-bottom: 1rem;\n}\n\n.todos-module_checkbox_Jw0LL {\n  width: 20px;\n  height: 20px;\n  cursor: pointer;\n}\n\n.todos-module_todoText_j-RzL {\n  flex: 1;\n  font-size: 1.1rem;\n  color: #fff;\n}\n\n.todos-module_completed_nyQkC {\n  text-decoration: line-through;\n  color: #888;\n}\n\n.todos-module_deleteButton_5fv-E {\n  padding: 0.5rem 1rem;\n  font-size: 0.9rem;\n  background-color: #dc2626;\n  color: white;\n  border: none;\n  border-radius: 4px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.todos-module_deleteButton_5fv-E:hover {\n  background-color: #b91c1c;\n}\n\n.todos-module_navigation_c8Wf5 {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 3rem;\n}\n";
document.head.appendChild(style4);
var todos_module_default = {
  "container": "todos-module_container_hRh0O",
  "content": "todos-module_content_iJ5qv",
  "title": "todos-module_title_JA0pZ",
  "description": "todos-module_description_D-dls",
  "todoForm": "todos-module_todoForm_QToMt",
  "input": "todos-module_input_sCH22",
  "button": "todos-module_button_rjPvm",
  "todoList": "todos-module_todoList_BSZtf",
  "todoItem": "todos-module_todoItem_E7xPJ",
  "checkbox": "todos-module_checkbox_Jw0LL",
  "todoText": "todos-module_todoText_j-RzL",
  "completed": "todos-module_completed_nyQkC",
  "deleteButton": "todos-module_deleteButton_5fv-E",
  "navigation": "todos-module_navigation_c8Wf5"
};

// example/pages/todos.tsx
import { jsx as jsx5, jsxs as jsxs5 } from "react/jsx-runtime";
function TodosPage() {
  const { navigate } = useRouter();
  const [todos, setTodos] = useState2([]);
  const [newTodo, setNewTodo] = useState2("");
  const [loading, setLoading] = useState2(true);
  useEffect2(() => {
    fetchTodos();
  }, []);
  function fetchTodos() {
    return __async(this, null, function* () {
      try {
        const response = yield fetch("/api/todos");
        const data = yield response.json();
        setTodos(data);
      } catch (error) {
        console.error("Error fetching todos:", error);
      } finally {
        setLoading(false);
      }
    });
  }
  function addTodo(e) {
    return __async(this, null, function* () {
      e.preventDefault();
      if (!newTodo.trim())
        return;
      try {
        const response = yield fetch("/api/todos", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: newTodo })
        });
        const todo = yield response.json();
        setTodos((prev) => [...prev, todo]);
        setNewTodo("");
      } catch (error) {
        console.error("Error adding todo:", error);
      }
    });
  }
  function toggleTodo(todo) {
    return __async(this, null, function* () {
      try {
        const response = yield fetch("/api/todos", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: todo.id, completed: !todo.completed })
        });
        const updatedTodo = yield response.json();
        setTodos((prev) => prev.map((t) => t.id === todo.id ? updatedTodo : t));
      } catch (error) {
        console.error("Error toggling todo:", error);
      }
    });
  }
  function deleteTodo(id) {
    return __async(this, null, function* () {
      try {
        yield fetch(`/api/todos?id=${id}`, { method: "DELETE" });
        setTodos((prev) => prev.filter((t) => t.id !== id));
      } catch (error) {
        console.error("Error deleting todo:", error);
      }
    });
  }
  return /* @__PURE__ */ jsx5("div", { className: todos_module_default.container, children: /* @__PURE__ */ jsxs5("div", { className: todos_module_default.content, children: [
    /* @__PURE__ */ jsx5("h1", { className: todos_module_default.title, children: "Todo List" }),
    /* @__PURE__ */ jsx5("p", { className: todos_module_default.description, children: "A simple todo list using Next-Lite's API routes" }),
    /* @__PURE__ */ jsxs5("form", { onSubmit: addTodo, className: todos_module_default.todoForm, children: [
      /* @__PURE__ */ jsx5(
        "input",
        {
          type: "text",
          value: newTodo,
          onChange: (e) => setNewTodo(e.target.value),
          placeholder: "What needs to be done?",
          className: todos_module_default.input
        }
      ),
      /* @__PURE__ */ jsx5("button", { type: "submit", className: todos_module_default.button, children: "Add Todo" })
    ] }),
    loading ? /* @__PURE__ */ jsx5("p", { className: todos_module_default.description, children: "Loading todos..." }) : /* @__PURE__ */ jsx5("ul", { className: todos_module_default.todoList, children: todos.map((todo) => /* @__PURE__ */ jsxs5("li", { className: todos_module_default.todoItem, children: [
      /* @__PURE__ */ jsx5(
        "input",
        {
          type: "checkbox",
          checked: todo.completed,
          onChange: () => toggleTodo(todo),
          className: todos_module_default.checkbox
        }
      ),
      /* @__PURE__ */ jsx5("span", { className: `${todos_module_default.todoText} ${todo.completed ? todos_module_default.completed : ""}`, children: todo.text }),
      /* @__PURE__ */ jsx5(
        "button",
        {
          onClick: () => deleteTodo(todo.id),
          className: todos_module_default.deleteButton,
          children: "Delete"
        }
      )
    ] }, todo.id)) }),
    /* @__PURE__ */ jsx5("div", { className: todos_module_default.navigation, children: /* @__PURE__ */ jsx5("button", { onClick: () => navigate("/"), className: todos_module_default.button, children: "Back to Home" }) })
  ] }) });
}

// example/pages/features.module.css
var style5 = document.createElement("style");
style5.textContent = ".features-module_container_fWk68 {\n  min-height: 100vh;\n  padding: 4rem 1rem;\n  background: linear-gradient(to bottom right, #1a1a1a, #2d2d2d);\n  color: #ffffff;\n  font-family: -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;\n}\n\n.features-module_content_6LF0d {\n  max-width: 800px;\n  margin: 0 auto;\n}\n\n.features-module_title_ojjby {\n  font-size: 3.5rem;\n  font-weight: bold;\n  margin: 0 0 2rem 0;\n  background: linear-gradient(to right, #7928CA, #FF0080);\n  -webkit-background-clip: text;\n  -webkit-text-fill-color: transparent;\n  text-align: center;\n}\n\n.features-module_featureGrid_s4cA9 {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));\n  gap: 2rem;\n  margin: 3rem 0;\n}\n\n.features-module_featureCard_zIv-O {\n  background: rgba(255, 255, 255, 0.1);\n  border-radius: 10px;\n  padding: 1.5rem;\n  transition: transform 0.2s;\n}\n\n.features-module_featureCard_zIv-O:hover {\n  transform: translateY(-5px);\n}\n\n.features-module_featureTitle_RKqJ5 {\n  font-size: 1.5rem;\n  margin: 0 0 1rem 0;\n  color: #7928CA;\n}\n\n.features-module_featureDescription_t1n1x {\n  color: #ccc;\n  line-height: 1.6;\n}\n\n.features-module_navigation_hCr-- {\n  display: flex;\n  justify-content: center;\n  gap: 1rem;\n  margin-top: 3rem;\n}\n\n.features-module_button_pqoH1 {\n  padding: 0.8rem 1.5rem;\n  font-size: 1rem;\n  background-color: #7928CA;\n  color: white;\n  border: none;\n  border-radius: 5px;\n  cursor: pointer;\n  transition: background-color 0.2s;\n}\n\n.features-module_button_pqoH1:hover {\n  background-color: #6a23b5;\n}\n";
document.head.appendChild(style5);
var features_module_default = {
  "container": "features-module_container_fWk68",
  "content": "features-module_content_6LF0d",
  "title": "features-module_title_ojjby",
  "featureGrid": "features-module_featureGrid_s4cA9",
  "featureCard": "features-module_featureCard_zIv-O",
  "featureTitle": "features-module_featureTitle_RKqJ5",
  "featureDescription": "features-module_featureDescription_t1n1x",
  "navigation": "features-module_navigation_hCr--",
  "button": "features-module_button_pqoH1"
};

// example/pages/features.tsx
import { jsx as jsx6, jsxs as jsxs6 } from "react/jsx-runtime";
var features = [
  {
    title: "File-Based Routing",
    description: "Automatic route creation based on your file structure in the pages directory. Simple and intuitive!"
  },
  {
    title: "Hot Module Replacement",
    description: "See your changes instantly with our fast HMR system, complete with a sleek loading overlay."
  },
  {
    title: "API Routes",
    description: "Build your backend API right alongside your frontend code. Full support for REST APIs with automatic route handling."
  },
  {
    title: "CSS Modules",
    description: "Scoped CSS with zero configuration. Keep your styles modular and conflict-free."
  },
  {
    title: "Production Builds",
    description: "Optimized production builds with code splitting, minification, and efficient caching strategies."
  },
  {
    title: "TypeScript Support",
    description: "First-class TypeScript support out of the box. Enjoy type safety and better developer experience."
  }
];
function FeaturesPage() {
  const { navigate } = useRouter();
  return /* @__PURE__ */ jsx6("div", { className: features_module_default.container, children: /* @__PURE__ */ jsxs6("div", { className: features_module_default.content, children: [
    /* @__PURE__ */ jsx6("h1", { className: features_module_default.title, children: "Features" }),
    /* @__PURE__ */ jsx6("div", { className: features_module_default.featureGrid, children: features.map((feature, index) => /* @__PURE__ */ jsxs6("div", { className: features_module_default.featureCard, children: [
      /* @__PURE__ */ jsx6("h2", { className: features_module_default.featureTitle, children: feature.title }),
      /* @__PURE__ */ jsx6("p", { className: features_module_default.featureDescription, children: feature.description })
    ] }, index)) }),
    /* @__PURE__ */ jsxs6("div", { className: features_module_default.navigation, children: [
      /* @__PURE__ */ jsx6("button", { onClick: () => navigate("/"), className: features_module_default.button, children: "Back to Home" }),
      /* @__PURE__ */ jsx6("button", { onClick: () => navigate("/todos"), className: features_module_default.button, children: "Try Todo Demo" })
    ] })
  ] }) });
}

// .next/client-entry.tsx
import { jsx as jsx7 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement)
  throw new Error("Root element not found");
var root = createRoot(rootElement);
var routes = {
  "/": () => /* @__PURE__ */ jsx7(HomePage, {}),
  "/about": () => /* @__PURE__ */ jsx7(AboutPage, {}),
  "/docs": () => /* @__PURE__ */ jsx7(DocsPage, {}),
  "/todos": () => /* @__PURE__ */ jsx7(TodosPage, {}),
  "/features": () => /* @__PURE__ */ jsx7(FeaturesPage, {})
};
root.render(
  /* @__PURE__ */ jsx7(React3.StrictMode, { children: /* @__PURE__ */ jsx7(RouterProvider, { routes }) })
);
