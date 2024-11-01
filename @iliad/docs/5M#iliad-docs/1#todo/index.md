## Nice-To-Haves

- Atlas AI
  - Ability to share chats with other editors.
    - This would require a webhook to fire or something, if we wanted live collaboration
- Need to write the whole thing the ground up with some Classes I can use on the frontend and backend.
- Robust text-input that allows internal articles to be referenced. Could use Discord's UX where you type `contentType: value` and then can select from a list of auto-completes?
- Need to make sub-models (pre-loaded instruction lists for specific tasks)
- Hook into APIs

- General Architecture
  - If this is a project wo1rth developing, I will need to figure out two things before continuing:
    - 1. Can I embed Mantine into this project? The strapi-design-system is horrendous, and has no docs.
    - 2. The dev server must be sped up somehow. It's slow to the point that front-end development is impossible. Can I at least embed wrapper-agnostic react-apps somehow? Can I make my own '@strapi-plugin-helper' that works over http or something?
- Electron App
  - Make endpoint to fetch any client-specific information on electron build.

## Pre-Alpha Checklist
