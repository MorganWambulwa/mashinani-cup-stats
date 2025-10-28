Mashinani League Cup

A community-driven fantasy football web application that allows users to create teams, join leagues, and track performance in the Mashinani League Cup.

Live site: https://mashinani-league-cup.vercel.app/

Table of Contents

Project Overview

Features

Tech Stack

Installation & Setup

Usage

Project Structure

Contributing

License

Future Enhancements

Project Overview

Mashinani League Cup provides a platform for football fans to engage in fantasy leagues by:

Creating or joining leagues

Building and managing teams

Tracking player performance with live points

Viewing league leaderboards and statistics

The platform promotes community engagement and gamified football experience for users.

Features

User Authentication: Secure sign-up and login

League Management: Create, join, and manage leagues

Team Management: Build squads and make transfers

Live Points Tracking: Points calculated based on player performance

Leaderboards: Track top performers per league

Responsive Design: Optimized for desktop and mobile

Tech Stack

Frontend: Vite + React + TypeScript

UI Library: shadcn/ui

Styling: Tailwind CSS, PostCSS

Backend / Database: Supabase (for authentication, database, and policies)

Build / Config: Vite, tsconfig

Linting / Formatting: ESLint

Installation & Setup

Clone the repository:

git clone https://github.com/MorganWambulwa/mashinani-cup-stats.git
cd mashinani-league-cup


Install dependencies:

npm install
# or
yarn install


Configure environment variables:

Create a .env file with your Supabase URL, keys, and other sensitive configuration variables. Do not include .env in version control.

Run the app locally:

npm run dev
# or
yarn dev


Open http://localhost:5173
 in your browser (Vite default).

Usage

Sign Up / Log In: Access your account using email or Supabase authentication

Create a League: Set up a league and invite friends

Join a League: Enter a code to join an existing league

Build Your Team: Select players within your budget and rules

Track Performance: View live points and standings

Check Leaderboards: Compare your performance with other users

Project Structure
public/                 # Static assets like images and icons
components.json         # Component metadata or config
.env                    # Environment variables (not committed)
.gitignore              # Ignored files for git
README.md               # Project README
bun.lockb               # Bun package manager lock file
eslint.config.js        # ESLint configuration
index.html              # Main HTML file
package-lock.json       # npm lock file
package.json            # Project dependencies and scripts
postcss.config.js       # PostCSS configuration
tailwind.config.ts      # Tailwind CSS configuration
tsconfig.app.json       # TypeScript configuration for the app
tsconfig.json           # TypeScript base configuration
tsconfig.node.json      # TypeScript configuration for Node.js
vite.config.ts          # Vite configuration file

Contributing

Fork the repository

Create a new branch (git checkout -b feature/your-feature)

Make your changes

Commit your changes (git commit -m "Add feature")

Push to your branch (git push origin feature/your-feature)

Open a Pull Request

Follow the project’s coding standards and include tests where necessary.

License

MIT License - see LICENSE
 for details.

Future Enhancements

Mobile companion app for iOS and Android

Advanced analytics for player performance

Social features like chat and messaging

Push notifications for match updates

Multi-language support
