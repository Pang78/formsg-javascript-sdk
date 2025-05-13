import { PrismaClient } from '@prisma/client';
import { hash } from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Create a demo user
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: {
      email: 'demo@example.com',
      name: 'Demo User',
      password: await hash('password123', 10),
    },
  });

  console.log('Created demo user:', demoUser.id);

  // Create demo forms
  const customerFeedbackForm = await prisma.form.upsert({
    where: { formId: '5e4b8e3d1f61f00036c9937d' },
    update: {},
    create: {
      name: 'Customer Feedback',
      formId: '5e4b8e3d1f61f00036c9937d',
      secretKey: 'demo-secret-key-1', // In production, use real encrypted keys
      webhookUrl: 'https://example.com/api/webhooks/formsg',
      userId: demoUser.id,
    },
  });

  const jobApplicationForm = await prisma.form.upsert({
    where: { formId: '6f5c9f4e2g72g00047d0048e' },
    update: {},
    create: {
      name: 'Job Application',
      formId: '6f5c9f4e2g72g00047d0048e',
      secretKey: 'demo-secret-key-2', // In production, use real encrypted keys
      webhookUrl: 'https://example.com/api/webhooks/formsg',
      userId: demoUser.id,
    },
  });

  console.log('Created demo forms:', customerFeedbackForm.id, jobApplicationForm.id);

  // Create demo submissions
  const submission1 = await prisma.submission.upsert({
    where: { submissionId: '5e53ec96b10ee1010e00380b' },
    update: {},
    create: {
      submissionId: '5e53ec96b10ee1010e00380b',
      submittedAt: new Date('2023-05-10T09:15:32Z'),
      data: {
        name: 'John Smith',
        email: 'john@example.com',
        feedback: 'Great service! I really appreciated how quickly my issue was resolved. The staff was very professional.',
        rating: '5',
      },
      formId: customerFeedbackForm.id,
    },
  });

  const submission2 = await prisma.submission.upsert({
    where: { submissionId: '6f64fd07c21ff121ef31491c' },
    update: {},
    create: {
      submissionId: '6f64fd07c21ff121ef31491c',
      submittedAt: new Date('2023-05-11T14:22:45Z'),
      data: {
        name: 'Jane Doe',
        email: 'jane@example.com',
        feedback: 'Could improve response time. I had to wait longer than expected for a reply.',
        rating: '3',
      },
      formId: customerFeedbackForm.id,
    },
  });

  const submission3 = await prisma.submission.upsert({
    where: { submissionId: '7g75ge18d32gg232fg42502d' },
    update: {},
    create: {
      submissionId: '7g75ge18d32gg232fg42502d',
      submittedAt: new Date('2023-05-12T10:05:18Z'),
      data: {
        name: 'Sam Wilson',
        email: 'sam@example.com',
        position: 'Software Engineer',
        experience: '5 years',
        resume: 'url-to-attachment',
        coverLetter: 'I am very interested in this position as it aligns with my career goals and expertise.',
      },
      formId: jobApplicationForm.id,
    },
  });

  console.log('Created demo submissions:', submission1.id, submission2.id, submission3.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 