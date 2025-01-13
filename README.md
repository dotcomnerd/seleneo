# [freedesign.fyi](https://freedesign.fyi)
![freedesign.fyi](/public/studio-demo.webp)

### [Seleneo](https://freedesign.fyi/about) helps you easily create all types of visuals for free.

> [!NOTE]
> This application was developed for the [ColorStack Hackathon](https://colorstack.notion.site/winter-break-hackathon-24).

## Getting Started

### Prerequisites

- The [Bun](https://bun.sh) runtime
- npm (v10.0.0 or higher recommended)
- Docker or PostgreSQL
- Cloudflare Images API key
- GitHub OAuth credentials
- Google Fonts API key
- Unsplash API key

### Installation 🐳

Get started by cloning this repository and installing Seleneo's dependencies:

```bash
git clone https://github.com/dotcomnerd/seleneo.git
cd seleneo
bun install
```

Next, create a `.env.local` file in the root of the project and add the following environment variables:

```bash
AUTH_SECRET="your_auth_secret"
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY="your_unsplash_access_key"
NEXT_PUBLIC_GOOGLE_FONTS_API_KEY="your_google_fonts_api_key"
AUTH_GITHUB_ID="your_github_id"
AUTH_GITHUB_SECRET="your_github_secret"
DATABASE_URL="your_database_url"
CLOUDFLARE_ACCOUNT_ID="your_cloudflare_account_id"
CLOUDFLARE_BEARER_TOKEN="your_cloudflare_bearer_token"
```

### Before running the server 🏗

Make sure your docker daemon is running then run the following command to start the database:

```bash
docker-compose up -d
```

Next, push the database schema to the database:

```bash
bun db:push
```

You're all set! 🎉

### Run the server 🏃🏾‍♂️💨

You can start the development server with:

```bash
bun dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Going to Prod 👷🏿🏛️

To build the app for production:

```bash
bun build
```

Then, start the production server:

```bash
bun start
```

# The Project

## Features 🚀

| 🏗️📱🎨🖼️🌫️📸🔐🧮📏🤩       | 🗣️💬🙂‍↔️🙅🏿‍♂️🫨🙊🔊🗣️💬🙂‍↔️🙅🏿‍♂️🫨🙊🔊🗣️💬🙂‍↔️🙅🏿‍♂️🫨🙊🔊🗣️💬          |
|------------------------|----------------------------------------------------------|
| Advanced Color Tools   | Create stunning color palettes and gradients with ease.  |
| Image Manipulation     | Edit and enhance images directly within the app.         |
| Account Management     | Create an account to save your designs and settings.     |
| Responsive Layouts     | Design layouts that look great on any device.            |
| Background Patterns    | Choose from a variety of patterns for your background.   |
| Typography Control     | Fine-tune your typography with advanced controls.        |
| 3D Elements            | Add depth to your designs with 3D elements and effects.  |
| Device Frames          | Showcase your product in a realistic device frame.       |
| Browse Other Designs   | Submit & view visuals created by other users of Selenero.|
| Share Your Designs     | Export your visuals in multiple formats or share online. |
| Cloud Storage          | Save your designs to the cloud for easy access.          |

## How It Works

1. **Upload Your Screenshot**: Drag and drop your product screenshot into the editor. Crop and resize the image to fit your design. Or, start from scratch with a blank canvas.
2. **Style Your Background**: Choose from the unsplash curated collection of gradients, patterns, and solid backgrounds. Customize colors to match your brand.
3. **Add Effects & Frames**: Enhance your screenshot with shadows, multi-dimensional transformations, and device frames. It's perfect for showcasing your product.
4. **Export & Share**: Export your designs in multiple formats or share directly to social media. Get your visuals ready for the world to see.
5. **Save Your Designs**: Create an account to save your designs and settings. Access your visuals from anywhere and share them with your team and or community.
6. **Browse Other Designs**: View and submit visuals created by other users of Seleneo. Get inspired by the community and share your creations.

## Extra Scripts

In the directory, you can run the following scripts to help you with development:

### `bun lint`

Runs the Next.js linter to check for code quality issues.

### `bun format`

Formats the code using Prettier.

### `bun db:push`

Pushes the database schema to the database.

### `bun db:studio`

Opens the Prisma Studio to view and manage the database.

> [!NOTE]
> If you plan on contributing to Seleneo, please make sure to run these scripts before opening a pull request.

## Credits

Seleneo was built by [nyumat](https://github.com/nyumat) 🫨 with contributions from [flanderzz](https://github.com/Flanderzz).

Other:
- [shadcn](https://ui.shadcn.com/) for the design system
- [FontAwesome](https://fontawesome.com) / [Lucide](https://lucide.dev) for the icons
- [Magic UI](https://magicui.design/) for making design eng ez
- [CoolShap.es](https://coolshap.es) for the logos/icons
- [Unsplash](https://unsplash.com) for the images API
- [Cloudflare](https://cloudflare.com) for the images API
- [Google Fonts](https://fonts.google.com) for the fonts
- [Prisma](https://prisma.io) for the database
- [Next.js](https://nextjs.org) for the frontend
- [TailwindCSS](https://tailwindcss.com) for the styling
- [Bun](https://bun.sh) for the runtime
- [Vercel](https://vercel.com) for the hosting
- [Umami](https://umami.is) for the analytics
- [Neon](https://neon.tech/) for the serverless postgres
- [Jimp](https://github.com/oliver-moran/jimp) for the image processing
- [ColorThief](https://lokeshdhakar.com/projects/color-thief) for the color extraction
- [React Colorful](https://omgovich.github.io/react-colorful) for the color picker
- [React Dropzone](https://react-dropzone.js.org) for the file upload
- [Sonner](https://sonner.dev) for the toast notifications
- and so many more...
