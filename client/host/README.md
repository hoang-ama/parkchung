# ParkChung Host Portal

React + TypeScript + Tailwind CSS frontend for Host/Partner registration and management.

## Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Project Structure

```
client/host/
├── src/
│   ├── pages/
│   │   └── HostRegisterPage.tsx    # Host registration form
│   ├── App.tsx                      # Router configuration
│   ├── main.tsx                     # Entry point
│   └── index.css                    # Tailwind styles
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Features

- **Host Registration**: Full form with client-side validation
- **React Router**: Navigation between pages
- **TypeScript**: Strong typing throughout
- **Tailwind CSS**: Utility-first styling
- **API Integration**: Fetch-based API calls with error handling

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register-host` | Register new Host account |

### Register Host Request

```json
{
  "fullName": "John Doe",
  "email": "john@example.com",
  "password": "securepassword",
  "phone": "0903229906"
}
```

## Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_URL=http://localhost:5000/api
```

## Development

The Vite dev server includes a proxy configuration that forwards `/api` requests to `http://localhost:5000`, so make sure your backend server is running.

## Backend Integration

To enable host registration, add the `registerHost` controller to your backend:

1. See `docs/register-host-endpoint.js` for the controller code
2. Add the route to `auth.routes.js`:
   ```js
   router.post('/register-host', registerHost);
   ```
3. Update User model to include 'host' in role enum if not already present
