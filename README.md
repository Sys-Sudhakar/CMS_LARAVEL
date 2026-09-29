# Centralized Content Management System (CMS)

A centralized, secure, and scalable Content Management System (CMS) developed using **Laravel, React, TypeScript, Inertia.js, Tailwind CSS, and MySQL**.

The CMS provides a centralized administration interface for managing website content, pages, sections, media, navigation menus, users, roles, permissions, and contact forms.

---

## 1. Project Overview

The Centralized CMS is designed to simplify and standardize website content management through a single administrative platform.

Instead of modifying website source code or database records directly, authorized users can manage website content through the CMS administration panel.

The system is designed with a modular and extensible architecture that can support multiple websites and future REST API integrations.

### Main Goals

- Centralize website content management.
- Provide a secure administrative interface.
- Implement role-based access control.
- Manage website pages and content sections.
- Manage images and media assets.
- Manage website navigation menus.
- Manage configurable contact forms.
- Provide controlled access based on user roles and permissions.
- Provide a scalable foundation for multiple website integrations.
- Minimize direct source-code changes for routine content updates.

---

# 2. Key Features

## 2.1 Authentication

The CMS provides authenticated access to the administrative area.

### Authentication Features

- User login
- Session management
- Password authentication
- Two-factor authentication
- Passkey support
- Protected administration routes
- Team-based user management

---

## 2.2 Role-Based Access Control

The CMS uses role and permission-based authorization to control access to administrative functionality.

Users can be assigned different roles based on their responsibilities.

### Example Roles

- Super Admin
- Admin
- Editor
- Contributor
- Content Management User

### Example Permissions

- Dashboard access
- Page management
- Section management
- Media management
- Menu management
- User management
- Role management
- Permission management
- Contact management

This ensures that users only have access to the modules and actions required for their assigned responsibilities.

---

# 3. CMS Dashboard

The CMS dashboard provides the main administrative entry point after authentication.

From the dashboard, authorized users can access the available CMS modules based on their assigned permissions.

The dashboard architecture can also be extended in the future to include:

- Content statistics
- Published page counts
- Draft counts
- User activity
- Contact submissions
- System notifications
- Website status information

---

# 4. Page Management

The CMS provides a centralized interface for managing website pages.

### Page Management Features

- Create pages
- Edit pages
- Delete pages
- Publish pages
- Unpublish pages
- Configure page titles
- Configure page slugs
- Configure page status
- Manage page sections
- Configure page ordering
- Preview website content

Pages are separated from the frontend presentation layer, allowing content to be modified without directly changing application source code.

---

# 5. Section Management

Each page can contain multiple configurable content sections.

### Supported Section Types

- Hero
- Content
- Cards
- Grid
- About
- Statistics
- Vision & Mission
- Certifications
- Global Presence
- Call To Action
- Contact Form

Each section can contain its own configuration and content.

Sections can also be ordered using a configurable `sort_order`.

This provides flexibility to create different page layouts without creating separate hard-coded frontend components for every page.

---

# 6. Media Management

The CMS provides centralized media management for website assets.

Media can be uploaded and associated with different CMS sections.

### Media Use Cases

- Website images
- Section images
- Logos
- Banners
- Content images
- Media assets
- Video URLs

The media architecture allows website content to reference managed assets rather than hard-coding file paths throughout the application.

---

# 7. Navigation Menu Management

The CMS provides menu management functionality for controlling website navigation.

### Menu Features

- Create menu items
- Edit menu items
- Delete menu items
- Assign CMS pages
- Add custom URLs
- Create parent/child menu relationships
- Configure menu ordering
- Enable/disable menu items
- Configure link targets

This allows website navigation to be updated from the CMS without modifying frontend source code.

---

# 8. Contact Form Management

The CMS supports configurable contact form sections.

Administrators can configure the fields displayed on the website contact form.

### Supported Fields

- Full Name
- Email
- Company
- Phone
- Service Category
- Message

### Additional Configuration

- Form title
- Submit button text
- Office address
- Phone number
- Email address
- Business hours
- WhatsApp contact
- Field visibility

The contact form architecture is designed to support server-side validation and anti-bot protection.

---

# 9. Security

Security is implemented through multiple application layers.

### Security Features

- Authentication
- Authorization
- Role-based permissions
- Protected administrative routes
- CSRF protection
- Server-side validation
- Secure sessions
- Database validation
- Controlled media handling
- Permission-based route protection

Administrative functionality is protected through authentication and permission middleware.

---

# 10. Technology Stack

| Layer | Technology |
|---|---|
| Backend | Laravel 13 |
| Backend Language | PHP |
| Frontend | React |
| Frontend Language | TypeScript / TSX |
| Application Bridge | Inertia.js |
| Styling | Tailwind CSS |
| Build Tool | Vite |
| Database | MySQL |
| Local Server | XAMPP |
| Database Management | phpMyAdmin |
| Authentication | Laravel Fortify |
| Authorization | Role & Permission System |
| API Architecture | REST API Ready |
| Version Control | Git |
| Repository | GitHub / GitLab |

---

# 11. System Architecture

The application follows a modern full-stack architecture.

```text
                         ┌─────────────────────┐
                         │      End User       │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │   Public Website    │
                         │   React / Inertia   │
                         └──────────┬──────────┘
                                    │
                                    ▼
                         ┌─────────────────────┐
                         │    Laravel App      │
                         │   Backend / Routes  │
                         └──────────┬──────────┘
                                    │
                 ┌──────────────────┼──────────────────┐
                 │                  │                  │
                 ▼                  ▼                  ▼
        ┌────────────────┐ ┌────────────────┐ ┌────────────────┐
        │ Authentication │ │ Authorization  │ │ CMS Modules    │
        │     / Auth     │ │ Roles / Perms  │ │ Pages / Media  │
        └────────────────┘ └────────────────┘ │ Menus / Forms  │
                                              └───────┬────────┘
                                                      │
                                                      ▼
                                             ┌────────────────┐
                                             │     MySQL      │
                                             │    Database    │
                                             └────────────────┘
