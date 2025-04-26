var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));

// .next/client-entry.jsx
import React3 from "react";
import { createRoot } from "react-dom/client";

// pages/about.tsx
import { jsx, jsxs } from "react/jsx-runtime";
function AboutPage() {
  return /* @__PURE__ */ jsxs("div", { className: "container", children: [
    /* @__PURE__ */ jsxs("header", { className: "header", children: [
      /* @__PURE__ */ jsx("h1", { className: "logo", children: "Next-Lite Demo" }),
      /* @__PURE__ */ jsxs("nav", { className: "nav", children: [
        /* @__PURE__ */ jsx("a", { href: "/", children: "Home" }),
        /* @__PURE__ */ jsx("a", { href: "/about", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: "/contact", children: "Contact" })
      ] })
    ] }),
    /* @__PURE__ */ jsx("main", { className: "main", children: /* @__PURE__ */ jsxs("section", { className: "content", children: [
      /* @__PURE__ */ jsx("h1", { className: "title", children: "About Next-Lite" }),
      /* @__PURE__ */ jsxs("div", { className: "textContent", children: [
        /* @__PURE__ */ jsx("p", { children: "Next-Lite is a lightweight, high-performance alternative to Next.js built with esbuild. It features file-based routing, HMR, CSS Modules, and TypeScript support out of the box, all while maintaining a minimal footprint and blazing-fast build times." }),
        /* @__PURE__ */ jsx("h2", { children: "Why Next-Lite?" }),
        /* @__PURE__ */ jsx("p", { children: "While Next.js is a powerful framework, it can sometimes be overkill for simpler projects. Next-Lite aims to provide the core features developers love about Next.js, but with a smaller bundle size and faster development experience." }),
        /* @__PURE__ */ jsx("h2", { children: "Key Differences" }),
        /* @__PURE__ */ jsxs("ul", { className: "list", children: [
          /* @__PURE__ */ jsx("li", { children: "Uses esbuild instead of webpack for significantly faster builds" }),
          /* @__PURE__ */ jsx("li", { children: "Smaller bundle size and fewer dependencies" }),
          /* @__PURE__ */ jsx("li", { children: "Simplified API that focuses on the most commonly used features" }),
          /* @__PURE__ */ jsx("li", { children: "Optimized for development speed and simplicity" })
        ] }),
        /* @__PURE__ */ jsx("h2", { children: "Project Status" }),
        /* @__PURE__ */ jsx("p", { children: "Next-Lite is currently in early development. While it's stable enough for small to medium-sized projects, it may not have all the features needed for large-scale applications. We're actively working on expanding its capabilities while maintaining its lightweight nature." })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx("footer", { className: "footer", children: /* @__PURE__ */ jsx("p", { children: "Built with Next-Lite Framework \xA9 2025" }) })
  ] });
}

// pages/contact.tsx
import { useState } from "react";
import { jsx as jsx2, jsxs as jsxs2 } from "react/jsx-runtime";
function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: ""
  });
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => __spreadProps(__spreadValues({}, prev), {
      [name]: value
    }));
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setSubmitted(true);
  };
  return /* @__PURE__ */ jsxs2("div", { className: "container", children: [
    /* @__PURE__ */ jsxs2("header", { className: "header", children: [
      /* @__PURE__ */ jsx2("h1", { className: "logo", children: "Next-Lite Demo" }),
      /* @__PURE__ */ jsxs2("nav", { className: "nav", children: [
        /* @__PURE__ */ jsx2("a", { href: "/", children: "Home" }),
        /* @__PURE__ */ jsx2("a", { href: "/about", children: "About" }),
        /* @__PURE__ */ jsx2("a", { href: "/contact", children: "Contact" })
      ] })
    ] }),
    /* @__PURE__ */ jsx2("main", { className: "main", children: /* @__PURE__ */ jsxs2("section", { className: "content", children: [
      /* @__PURE__ */ jsx2("h1", { className: "title", children: "Contact Us" }),
      submitted ? /* @__PURE__ */ jsxs2("div", { className: "successMessage", children: [
        /* @__PURE__ */ jsx2("h2", { children: "Thank you for your message!" }),
        /* @__PURE__ */ jsx2("p", { children: "We'll get back to you as soon as possible." }),
        /* @__PURE__ */ jsx2(
          "button",
          {
            className: "button",
            onClick: () => {
              setFormData({ name: "", email: "", message: "" });
              setSubmitted(false);
            },
            children: "Send another message"
          }
        )
      ] }) : /* @__PURE__ */ jsxs2("form", { className: "contactForm", onSubmit: handleSubmit, children: [
        /* @__PURE__ */ jsxs2("div", { className: "formGroup", children: [
          /* @__PURE__ */ jsx2("label", { htmlFor: "name", children: "Name" }),
          /* @__PURE__ */ jsx2(
            "input",
            {
              type: "text",
              id: "name",
              name: "name",
              value: formData.name,
              onChange: handleChange,
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "formGroup", children: [
          /* @__PURE__ */ jsx2("label", { htmlFor: "email", children: "Email" }),
          /* @__PURE__ */ jsx2(
            "input",
            {
              type: "email",
              id: "email",
              name: "email",
              value: formData.email,
              onChange: handleChange,
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsxs2("div", { className: "formGroup", children: [
          /* @__PURE__ */ jsx2("label", { htmlFor: "message", children: "Message" }),
          /* @__PURE__ */ jsx2(
            "textarea",
            {
              id: "message",
              name: "message",
              rows: 5,
              value: formData.message,
              onChange: handleChange,
              required: true
            }
          )
        ] }),
        /* @__PURE__ */ jsx2("button", { type: "submit", className: "button", children: "Send Message" })
      ] })
    ] }) }),
    /* @__PURE__ */ jsx2("footer", { className: "footer", children: /* @__PURE__ */ jsx2("p", { children: "Built with Next-Lite Framework \xA9 2025" }) })
  ] });
}

// pages/index.tsx
import { useState as useState2 } from "react";
import { jsx as jsx3, jsxs as jsxs3 } from "react/jsx-runtime";
function HomePage() {
  const [count, setCount] = useState2(0);
  return /* @__PURE__ */ jsxs3("div", { className: "container", children: [
    /* @__PURE__ */ jsxs3("header", { className: "header", children: [
      /* @__PURE__ */ jsx3("h1", { className: "logo", children: "Next-Lite Demo" }),
      /* @__PURE__ */ jsxs3("nav", { className: "nav", children: [
        /* @__PURE__ */ jsx3("a", { href: "/", children: "Home" }),
        /* @__PURE__ */ jsx3("a", { href: "/about", children: "About" }),
        /* @__PURE__ */ jsx3("a", { href: "/contact", children: "Contact" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs3("main", { className: "main", children: [
      /* @__PURE__ */ jsxs3("section", { className: "hero", children: [
        /* @__PURE__ */ jsxs3("h1", { className: "title", children: [
          "Welcome to ",
          /* @__PURE__ */ jsx3("span", { className: "highlight", children: "Next-Lite" })
        ] }),
        /* @__PURE__ */ jsx3("p", { className: "description", children: "A lightweight, high-performance alternative to Next.js" }),
        /* @__PURE__ */ jsxs3("div", { className: "counter", children: [
          /* @__PURE__ */ jsx3("h2", { children: "Interactive Counter" }),
          /* @__PURE__ */ jsxs3("p", { children: [
            "Count: ",
            count
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "buttonGroup", children: [
            /* @__PURE__ */ jsx3(
              "button",
              {
                className: "button",
                onClick: () => setCount(count - 1),
                children: "Decrease"
              }
            ),
            /* @__PURE__ */ jsx3(
              "button",
              {
                className: "button",
                onClick: () => setCount(count + 1),
                children: "Increase"
              }
            )
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs3("section", { className: "features", children: [
        /* @__PURE__ */ jsx3("h2", { children: "Framework Features" }),
        /* @__PURE__ */ jsxs3("div", { className: "grid", children: [
          /* @__PURE__ */ jsxs3("div", { className: "card", children: [
            /* @__PURE__ */ jsx3("h3", { children: "Fast Builds" }),
            /* @__PURE__ */ jsx3("p", { children: "Blazing-fast build times with esbuild." })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "card", children: [
            /* @__PURE__ */ jsx3("h3", { children: "File-based Routing" }),
            /* @__PURE__ */ jsx3("p", { children: "Simple and intuitive routing based on your file structure." })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "card", children: [
            /* @__PURE__ */ jsx3("h3", { children: "CSS Modules" }),
            /* @__PURE__ */ jsx3("p", { children: "Built-in support for CSS Modules." })
          ] }),
          /* @__PURE__ */ jsxs3("div", { className: "card", children: [
            /* @__PURE__ */ jsx3("h3", { children: "TypeScript" }),
            /* @__PURE__ */ jsx3("p", { children: "First-class TypeScript support out of the box." })
          ] })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsx3("footer", { className: "footer", children: /* @__PURE__ */ jsx3("p", { children: "Built with Next-Lite Framework \xA9 2025" }) })
  ] });
}

// .next/client-entry.jsx
import { jsx as jsx4 } from "react/jsx-runtime";
var rootElement = document.getElementById("root");
if (!rootElement)
  throw new Error("Root element not found");
var root = createRoot(rootElement);
var routes = {
  "/about": AboutPage,
  "/contact": ContactPage,
  "/": HomePage
};
var Router = () => {
  const [path, setPath] = React3.useState(window.location.pathname);
  React3.useEffect(() => {
    const handlePopState = () => {
      setPath(window.location.pathname);
    };
    window.addEventListener("popstate", handlePopState);
    document.addEventListener("click", (e) => {
      if (e.target.tagName === "A" && e.target.getAttribute("href") && e.target.getAttribute("href").startsWith("/")) {
        e.preventDefault();
        const href = e.target.getAttribute("href");
        window.history.pushState({}, "", href);
        setPath(href);
      }
    });
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, []);
  const Component = routes[path] || routes["/"] || (() => /* @__PURE__ */ jsx4("div", { children: "Page not found" }));
  return /* @__PURE__ */ jsx4(Component, {});
};
root.render(
  /* @__PURE__ */ jsx4(React3.StrictMode, { children: /* @__PURE__ */ jsx4(Router, {}) })
);
//# sourceMappingURL=client.js.map
