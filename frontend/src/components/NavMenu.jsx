import React from "react";

const navItems = [
  { href: "layout-library", label: "Layout Library" },
  { href: "template-library", label: "Template Library" },
  { href: "global-attributes", label: "Data Settings" },
  { href: "resource-bundles", label: "Label Settings" },
  { href: "image-library", label: "Image Library" },
  { href: "css-library", label: "CSS Library" }
];

const NavMenu = ({ activeItem }) => {
  return (
    <nav className="nav-menu">
      <style>
        {`
        .nav-menu {
          background: #f5f5f5;
          padding-left: 30px;
          display: flex;
          gap: 30px;
          border-bottom: 1px solid #ccc;
        }
        .nav-menu a {
          text-decoration: none;
          color: #0077cc;
          font-weight: 500;
          padding: 15px 0;
          display: inline-block;
          border-bottom: 3px solid transparent;
          transition: all 0.2s ease;
        }
        .nav-menu a:hover {
          color: #005299;
        }
        .nav-menu a.active {
          color: black;
          font-weight: 700;
          border-bottom-color: #ffd500;
        }
        `}
      </style>
      {navItems.map((navItem, index) => (
        <a
          key={navItem.href}
          href={navItem.href}
          className={activeItem === index ? "active" : ""}
        >
          {navItem.label}
        </a>
      ))}
    </nav>
  );
};

export default NavMenu;