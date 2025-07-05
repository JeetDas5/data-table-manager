# 🧮 Dynamic Data Table

A fully-featured, customizable data table built with **NextJs**, **Redux**, and **Material UI**, featuring:

- CSV Import/Export
- Inline Editing with Validation
- Column Show/Hide and Reordering (Drag & Drop)
- Search, Sort, and Pagination
- Light/Dark Theme Toggle (MUI Theming)
- Redux Persist for local state persistence

---

## Deployment

[Live Demo](https://data-table-manager-snowy.vercel.app)

## ✨ Features

- 🔍 **Global Search** with real-time filtering
- ↕️ **Sorting** by any column (ascending/descending)
- 📄 **CSV Import & Export** (using PapaParse & FileSaver)
- ✏️ **Inline Cell Editing** with validation (e.g., email, age)
- ➕/🗑️ **Add/Delete Rows** with confirmation dialogs
- 🎛️ **Manage Columns**: show/hide or add custom fields
- 🌙 **Light/Dark Mode Toggle** via MUI theme context
- 🧠 **Column Reordering** with drag-and-drop (using @hello-pangea/dnd)
- 💾 **State Persistence** using Redux Persist

---

## 🛠️ Tech Stack

| Tech              | Usage                     |
| ----------------- | ------------------------- |
| NextJs            | Framework                 |
| Redux Toolkit     | State management          |
| Redux Persist     | Local storage persistence |
| MUI (v7)          | UI Components & Theming   |
| Tailwind (v4)     | Utility-first styling     |
| PapaParse         | CSV parsing               |
| FileSaver.js      | CSV export                |
| @hello-pangea/dnd | Drag-and-drop support     |

---

## 📦 Installation

```bash
git clone https://github.com/JeetDas5/data-table-manager
cd data-table-manager
npm install
npm run dev
```

---

## 📁 Folder Structure

```
.
├── app/
│   └── layout.tsx           # Layout Wrapper
│   └── page.tsx             # Main page with DataTable
│   └── globals.css          # Global styles

├── components/
│   ├── DataTable.tsx        # Main table logic and UI
│   └── Navbar.tsx           # AppBar with Theme Toggle
├── hooks/
│   └── ThemeToggle.tsx      # MUI theme context provider
├── store/
│   ├── index.ts             # Redux store config
│   └── providers.tsx        # Redux providers for app
├── redux/
│   └── tableSlice.ts        # Table reducer
└── README.md
```
