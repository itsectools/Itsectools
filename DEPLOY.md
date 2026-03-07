# Publishing Guide for NGFW Threat Tester

## 1. Project Dependencies

The application is built on the **Next.js** framework with **React**. 

### Core Dependencies:
- **next (v16.1.6)**: The React framework for server-side rendering and routing.
- **react (v19.2.3)**: The core UI library.
- **react-dom (v19.2.3)**: Required for rendering React components to the DOM.

### Development Dependencies:
- **typescript**: For static type checking and type safety.
- **eslint**: For code linting and quality checks.
- **@types/node, @types/react**: Type definitions for TypeScript.

---

## 2. Publishing Options

Because this is a security testing tool, **where** you host it matters significantly.

### Option A: Public Cloud (Recommended for External Testing)
If you want to test your corporate firewall from the *outside* (Internet -> Firewall -> Internal Network), deploy this app to a public cloud provider.

#### 1. Deploy to Vercel (Easiest)
Vercel is the creators of Next.js and offers zero-configuration deployment.
1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket).
2. Go to [Vercel.com](https://vercel.com) and sign up.
3. Click "Add New..." -> "Project".
4. Import your repository.
5. Click **Deploy**.
   - Your site will be live at `https://your-project.vercel.app`.
   - Vercel automatically handles SSL (HTTPS), which is critical for testing HTTPS inspection.

#### 2. Deploy to a VPS (DigitalOcean, AWS EC2, Linode)
If you need more control (e.g., custom ports, raw TCP access):
1. Provision a Linux server (Ubuntu 22.04 recommended).
2. Install Node.js (v18+):
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```
3. Clone your repository to the server.
4. Install dependencies and build:
   ```bash
   npm install
   npm run build
   ```
5. Start the production server:
   ```bash
   npm start
   # Runs on port 3000 by default. Set PORT=80 npm start to run on port 80.
   ```
   *Tip: Use a process manager like `pm2` to keep it running.*

### Option B: Internal Deployment (Recommended for Internal Testing)
If you want to test internal segmentation (transverse movement) or DLP from an internal client:

#### 1. Docker Container (Highly Portable)
You can containerize the application to run it anywhere (laptop, server, Kubernetes).

1. Create a `Dockerfile` in the root of your project:
   ```dockerfile
   FROM node:20-alpine AS base

   # Install dependencies only when needed
   FROM base AS deps
   WORKDIR /app
   COPY package.json package-lock.json ./ 
   RUN npm ci

   # Rebuild the source code only when needed
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build

   # Production image, copy all the files and run next
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static

   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

2. Build and run:
   ```bash
   docker build -t ngfw-tester .
   docker run -p 3000:3000 ngfw-tester
   ```

3. Access at `http://localhost:3000` or the container IP.
