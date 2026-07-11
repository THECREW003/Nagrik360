# Nagrik360
**Nagrik** is an AI-powered public grievance platform that lets citizens report civic issues through text, voice, or images. AI automatically classifies, prioritizes, and routes complaints to the right department, detects duplicates, and provides real-time tracking, helping governments resolve issues faster and improve public services.

## Backend helpers

From `backend/`, use these commands:

- `npm run dev` — start the backend server with nodemon
- `npm run create-admin` — create or confirm the default admin user
- `npm run e2e` — run the end-to-end admin flow test (create officer, citizen, complaint, assign, update status)

The default admin credentials are:

- email: `admin@nagrik360.local`
- password: `adminpass`

## Notes

- Ensure MongoDB is configured via `.env` before running the backend.
- If the default admin exists already, `npm run create-admin` will leave it in place.
