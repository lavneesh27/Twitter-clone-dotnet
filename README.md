# Twitter Clone — Full Stack

A responsive social media web application inspired by Twitter/X, built with **Angular 17** on the frontend and **ASP.NET Core** on the backend. Features real-time messaging via **SignalR** and a clean, modular architecture.

## Live Demo

**[https://project-anidb.vercel.app/](https://project-anidb.vercel.app/)**

## Features

- **Dynamic Feed** — Paginated post feed with real-time updates
- **Real-time Messaging** — Instant post sharing and messaging powered by SignalR (WebSockets)
- **Authentication** — Secure user login and registration via JWT
- **Responsive UI** — Mobile-first design using Bootstrap 5
- **Notifications** — Toast notifications for user interactions
- **Modular Architecture** — Reusable Angular services and components throughout

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| Angular 17 | Component framework |
| TypeScript | Language |
| Bootstrap 5 | UI / responsive layout |
| @microsoft/signalr | Real-time WebSocket client |
| ngx-toastr | Toast notifications |
| RxJS | Reactive state & async streams |

### Backend
| Technology | Purpose |
|---|---|
| ASP.NET Core | Web API framework |
| SignalR Hubs | Real-time communication |
| Entity Framework Core | ORM + migrations |
| MS SQL Server | Relational database |
| REST APIs | Client–server contract |

## Project Structure

```
Twitter-clone-dotnet/
├── backend/
│   └── Twitter-backend/
│       ├── Controllers/     # REST API endpoints
│       ├── Hubs/            # SignalR real-time hubs
│       ├── Models/          # Domain models
│       ├── Data/            # DbContext & repositories
│       └── Migrations/      # EF Core migrations
└── frontend/
    └── src/
        ├── app/             # Angular modules & components
        └── environments/    # Environment configs
```

## Getting Started

### Prerequisites
- Node.js 18+ & npm
- .NET 8 SDK
- SQL Server (local or Azure)

### Backend

```bash
cd backend/Twitter-backend
# Update connection string in appsettings.json
dotnet ef database update
dotnet run
```

### Frontend

```bash
cd frontend
npm install
ng serve
```

The app will be available at `http://localhost:4200`.

## Author

**Lavneesh Rajput**
- GitHub: [github.com/lavneesh27](https://github.com/lavneesh27)
- LinkedIn: [linkedin.com/in/lavneesh-rajput](https://linkedin.com/in/lavneesh-rajput)
- Email: lavirajput376@gmail.com

