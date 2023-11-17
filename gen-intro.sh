#!/bin/bash

set -euo pipefail

> intro-for-gpt.txt


echo "
You are a seasoned TypeScript/JavaScript developer with a strong expertise in constructing
extensive React applications within the Next.js framework.
Your state management tool of choice is Zustand, which you prefer for its minimalistic approach
and its ease of integration into the React ecosystem. You are adept at using Zustand to handle
the complex stateful logic that chat applications require, such as message history,
user status, notifications, and real-time updates." >> intro-for-gpt.txt

echo "


I'm working on my Chat application that is connected with OpenAI and
allow user make converations with AI" >> intro-for-gpt.txt

echo "


1. ./app - This directory typically includes all main application files.

2. ./app/api - This is your application's backend API directory. It includes modules for chat-stream (managing real-time communication), config (managing application configurations), and openai (managing interactions with the OpenAI API).

3. ./app/components - This holds all of the React components that make up your user interface.

4. ./app/config - Contains configuration for both the server and the build process.

5. ./app/locales - Includes localization files for multiple languages. This is critical for internationalization (i18n) in your app.

6. ./app/store - Where state management of your application is conducted.

7. ./app/styles - This directory holds all your global styles and style-related files.

8. ./public - This holds all the public files that can be accessed directly via URL.

9. ./middleware.ts - Express middleware to handle requests.

10. ./next.config.js - This is where settings for your Next.js application are configured.

11. ./scripts - This directory would be hosting scripts used for various purposes - infrastructure tasks, data scrubbing tasks, etc

12. vercel.json - Vercel configuration file for serverless functions, environmental variables and routing rules.

" >> intro-for-gpt.txt


echo "
Project structure
Project structure
Project structure
Project structure
" >> intro-for-gpt.txt

echo '```' >> intro-for-gpt.txt
find . -iname "*ts*" >> intro-for-gpt.txt
echo '```' >> intro-for-gpt.txt

echo >> intro-for-gpt.txt
echo >> intro-for-gpt.txt
echo >> intro-for-gpt.txt
echo >> intro-for-gpt.txt
echo >> intro-for-gpt.txt

echo "Function declarations  and usage of useEffect and useState locations" >> intro-for-gpt.txt
echo "Function declarations  and usage of useEffect and useState locations" >> intro-for-gpt.txt
echo "Function declarations  and usage of useEffect and useState locations" >> intro-for-gpt.txt
echo '```' >> intro-for-gpt.txt
find . -type f \( -name "*.ts" -o -name "*.t
sx" \) -exec grep -HnE 'function|useEffect|useState' {} + | grep -vE '//.*function|//.*useEffect|//.*useState' >> intro-for-gpt.txt
echo '```' >> intro-for-gpt.txt
