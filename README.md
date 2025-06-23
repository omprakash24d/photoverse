# PhotoVerse: AI Poem Generator 📸✍️

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Transform your photos and ideas into evocative, AI-generated poems with PhotoVerse! This application provides a seamless experience for users to upload images or provide text descriptions, customize poem parameters, and receive unique poetic creations.

## ✨ Key Features

*   **Image-to-Poem**: Upload an image and let AI generate a descriptive text, which then serves as the basis for a poem.
*   **Text-to-Poem**: Prefer to use words? Manually input a description or theme to inspire your poem.
*   **AI Image Generation**: For text-only poems, the AI generates a beautiful, artistic image to accompany your verse.
*   **Text-to-Speech**: Listen to your generated poems read aloud by an AI voice.
*   **"Surprise Me!" Poem**: Get an instant poem with randomized settings for a spontaneous creative spark.
*   **Rich Customization**:
    *   **Language**: English, Hindi, Hinglish.
    *   **Poetic Style**: Haiku, Free Verse, Romantic, Motivational, Sonnet, Limerick, Ode, Ballad, Elegy, Narrative.
    *   **Tone/Mood**: Joyful, Calm, Melancholic, Nostalgic, Reflective, Humorous, Inspired, Mysterious, Hopeful, Wistful, Playful, Dramatic.
    *   **Poem Length**: Short, Medium, Long.
    *   **Custom Instructions**: Guide the AI with specific requests.
    *   **Poetic Devices**: Suggest specific poetic devices to include (e.g., metaphor, simile).
*   **Webcam Capture**: Use your webcam to take a photo directly within the app.
*   **AI-Powered Description**: Get an AI-generated description for your uploaded images, which you can then edit.
*   **Iterative Generation**: Regenerate poems or descriptions if the first result isn't perfect.
*   **Editable Poem Output**: Edit the generated poem directly in the app.
*   **Copy & Download**: Easily copy the poem text, download it as a `.txt` file, or download the final image and poem as a single PNG.
*   **Responsive Design**: Works beautifully on desktop and mobile devices.
*   **Light/Dark Mode**: Theme support for user preference.
*   **Informative Sections**: FAQs, "How it Works," and "Pro-Tips" sections to guide users.
*   **Legal Pages**: Includes Privacy Policy, Terms of Service, and Contact Us pages.

## 🛠️ Tech Stack

*   **Framework**: Next.js (App Router)
*   **Language**: TypeScript
*   **AI Integration**: Genkit (Google AI - Gemini models)
*   **UI Components**: ShadCN UI
*   **Styling**: Tailwind CSS
*   **Font Management**: `next/font` and Google Fonts
*   **Form Handling**: React Hook Form (implicitly via ShadCN components)
*   **Toasting/Notifications**: Custom `useToast` hook

## 🚀 Getting Started

This project is designed to run within the Firebase Studio environment.

1.  **Dependencies**: `package.json` lists all necessary dependencies. They are typically installed automatically in the Studio environment.
2.  **Environment Variables**: For the application's AI features to function correctly, you need to set up your environment variables. Create a file named `.env` in the root of your project and add the following content. You will need to replace the placeholder value with your actual API key.

    ```env
    # Google AI API Key for Genkit
    # Get this from Google AI Studio: https://aistudio.google.com/app/apikey
    GOOGLE_API_KEY=YOUR_GOOGLE_AI_API_KEY
    ```
3.  **Run Development Server**:
    ```bash
    npm run dev
    ```
    This will start the Next.js development server, usually on `http://localhost:9002`.

4.  **Run Genkit Development Server** (for testing/developing AI flows locally):
    In a separate terminal:
    ```bash
    npm run genkit:dev
    # or for watching changes
    npm run genkit:watch
    ```

## 🔧 Available Scripts

*   `npm run dev`: Starts the Next.js development server with Turbopack.
*   `npm run genkit:dev`: Starts the Genkit development server.
*   `npm run genkit:watch`: Starts the Genkit development server with file watching.
*   `npm run build`: Builds the Next.js application for production.
*   `npm run start`: Starts the Next.js production server.
*   `npm run lint`: Lints the codebase using Next.js's default ESLint configuration.
*   `npm run typecheck`: Runs TypeScript type checking.

## 📝 How to Use PhotoVerse

1.  **Start**:
    *   **Upload an Image**: Drag & drop, click to select a file, or use your webcam.
    *   **Write Description Manually**: Skip image upload and directly write your theme/description.
    *   **Surprise Me with a Poem!**: Get an instant poem with random settings.
2.  **Describe (if image uploaded)**:
    *   The AI will generate a description of your image.
    *   You can review, edit, or accept this description.
    *   You can also regenerate the AI description or skip to poem customization.
3.  **Customize Poem**:
    *   **Image Description/Poem Subject**: If you started with "Write Description Manually" or skipped from the describe step, you can write/edit your description here.
    *   **Poem Options**:
        *   Select Language, Style, Tone, and Poem Length.
        *   Optionally, provide Custom Instructions and Poetic Devices.
        *   Use the "Reset Options" button to revert to defaults.
        *   Use the "Surprise Me! (Options)" button to randomize poem settings.
    *   Click "Generate Poem".
4.  **Display Poem**:
    *   View your generated poem alongside your image (if provided).
    *   Edit the poem directly in the text area.
    *   **Regenerate Poem**: Get a new version with the same settings.
    *   **Copy Poem**: Copy the text to your clipboard.
    *   **Download .txt**: Download the poem as a text file.
    *   **Download Image**: Download the final result as a single PNG file.
    *   **Start New**: Reset the application to the beginning.
    *   **Back Button**: Navigate to previous steps to adjust settings or descriptions.

## 🤖 Core AI Flows

Located in `src/ai/flows/`:

*   **`describe-image.ts`**:
    *   Takes an image (as a data URI).
    *   Returns a detailed and evocative textual description of the image.
*   **`generate-poem.ts`**:
    *   Takes an image description and various parameters.
    *   Returns a generated poem based on these inputs.
*   **`generate-image.ts`**:
    *   Takes a text description.
    *   Returns a generated image as a data URI.
*   **`text-to-speech.ts`**:
    *   Takes text.
    *   Returns a WAV audio file as a data URI.

The global Genkit configuration is in `src/ai/genkit.ts`.

## 🎨 Theming

*   The application supports light and dark themes, managed by `next-themes`.
*   Theme colors are defined as HSL CSS variables in `src/app/globals.css`.
*   Font families (Lora for body, Raleway for headlines) are also defined in `tailwind.config.ts` and `src/app/layout.tsx`.

## ⚖️ Legal

*   **Privacy Policy**: `/privacy-policy`
*   **Terms of Service**: `/terms-of-service`
*   **Contact Us**: `/contact-us`

Links to these pages are available in the website footer.

## 👨‍💻 Developer

Developed by Om Prakash.

*   **LinkedIn**: [Connect with Om Prakash](https://www.linkedin.com/in/omrakash24d/)
*   **GitHub**: [OmPrakashAhir](https://github.com/omprakash24d)
*   **Twitter**: [@OmPraka96205339](https://twitter.com/omprakash25d)

---

Thank you for using PhotoVerse! We hope it sparks your creativity.
