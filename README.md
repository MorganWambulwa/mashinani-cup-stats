# Mashinani League Cup

Welcome to **Mashinani League Cup**, a community-driven fantasy football web app where football fans can create teams, join leagues, and track performance in a fun and interactive way.

Check out the live site here: [https://mashinani-league-cup.vercel.app/](https://mashinani-league-cup.vercel.app/)

---

## Table of Contents
- [What This Project Is About](#what-this-project-is-about)
- [What You Can Do](#what-you-can-do)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [How to Use](#how-to-use)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Plans for the Future](#plans-for-the-future)

---

## What This Project Is About
Mashinani League Cup lets football fans enjoy a fantasy league experience with their friends or the wider community. You can:
- Join or create your own leagues
- Pick your squad and manage your team
- Track live points based on real player performances
- See how you rank on leaderboards

The goal is to make following football more engaging and social.

---

## What You Can Do
- **Sign up and log in** safely to your account  
- **Create or join leagues** and compete with friends  
- **Manage your team** – pick players and make transfers  
- **Track performance** – watch your points grow in real-time  
- **Check leaderboards** – see how you stack up against others  

---

## Tech Stack
- **Frontend:** React + Vite + TypeScript  
- **UI Library:** shadcn/ui  
- **Styling:** Tailwind CSS, PostCSS  
- **Backend / Database:** Supabase for authentication and data  
- **Build & Config:** Vite, TypeScript configs  
- **Linting & Formatting:** ESLint  

---

## Getting Started
1. **Clone the project**

```bash
git clone https://github.com/MorganWambulwa/mashinani-cup-stats.git
cd mashinani-league-cup
Install dependencies

bash
Copy code
npm install
# or
yarn install
Set up environment variables

Create a .env file and add your Supabase URL, keys, and any other necessary secrets. Remember: never commit .env to version control.

Run the app locally

bash
Copy code
npm run dev
# or
yarn dev
Visit http://localhost:5173 to see the app in action.

How to Use
Sign up or log in

Create a league or join an existing one

Pick your team within your budget

Watch points update live

Compare yourself on the leaderboard

It’s simple and interactive—perfect for friendly competitions.

Project Structure
graphql
Copy code
public/                 # Static assets (images, icons, etc.)
components.json         # Component metadata/config
.env                    # Local environment variables (not committed)
.gitignore              # Git ignore rules
README.md               # Project README
bun.lockb               # Bun package lock file
eslint.config.js        # ESLint setup
index.html              # Main HTML file
package-lock.json       # npm lock file
package.json            # Project dependencies and scripts
postcss.config.js       # PostCSS configuration
tailwind.config.ts      # Tailwind CSS configuration
tsconfig.app.json       # TypeScript config for app
tsconfig.json           # Base TypeScript config
tsconfig.node.json      # TypeScript config for Node
vite.config.ts          # Vite configuration
Contributing
If you want to help make this project better:

Fork the repo

Make a new branch for your feature (git checkout -b feature/my-feature)

Make your changes and commit (git commit -m "Add some feature")

Push to your branch (git push origin feature/my-feature)

Open a Pull Request

We welcome contributions, improvements, or even just suggestions!

License
This project is open source under the MIT License. See LICENSE for details.

Plans for the Future
Mobile app version for iOS and Android

More advanced stats for players and teams

Social features like chat and messaging

Push notifications for match updates

Support for multiple languages
