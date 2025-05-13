# FormSG Processor

A Next.js application for processing and managing FormSG form submissions. This application allows you to:

- Connect to FormSG forms via webhooks
- Securely store and decrypt form submissions
- View, edit, and delete submissions
- Export submission data in various formats

## Features

- **Form Management**: Add, edit, and delete FormSG forms
- **Submission Processing**: Receive and decrypt submissions via webhooks
- **Data Viewing**: Browse and search through submissions
- **Data Editing**: Modify submission data as needed
- **Data Export**: Export submissions in JSON, CSV, or XLSX formats
- **Data Transformation**: Apply transformations like phone number formatting, date standardization, etc.

## Prerequisites

- Node.js 18+ and npm/yarn
- PostgreSQL database
- FormSG form(s) with webhook capability

## Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/formsg-processor.git
cd formsg-processor
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Set up environment variables

Copy the example environment file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local` with your configuration:

```
# App Configuration
NEXT_PUBLIC_APP_URL=https://your-domain.com

# Database Configuration
DATABASE_URL="postgresql://user:password@localhost:5432/formsg_processor"

# Session Configuration
SESSION_SECRET=your-session-secret-here
```

### 4. Set up the database

```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev
```

### 5. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## Production Deployment

### 1. Build the application

```bash
npm run build
# or
yarn build
```

### 2. Start the production server

```bash
npm start
# or
yarn start
```

### 3. Configuring FormSG Webhooks

1. Log in to your FormSG account
2. Navigate to the form you want to connect
3. Go to Settings > Webhooks
4. Add a new webhook with the URL: `https://your-domain.com/api/webhooks/formsg`
5. Save the webhook secret key
6. In your FormSG Processor application, add the form with its ID and secret key

## Security Considerations

- Store form secret keys securely
- Use HTTPS for all communications
- Set up proper authentication for accessing the application
- Regularly rotate secrets and credentials
- Consider encrypting sensitive data at rest in the database

## Database Schema

The application uses the following database schema:

- **User**: Stores user information for authentication
- **Form**: Stores FormSG form configurations
- **Submission**: Stores form submissions with both raw and processed data

## License

[MIT](LICENSE)

## Support

For support, please open an issue in the GitHub repository or contact us at support@example.com.
