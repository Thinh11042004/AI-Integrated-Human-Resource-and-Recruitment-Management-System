const argon2 = require('argon2');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  await prisma.application.deleteMany();
  await prisma.resume.deleteMany();
  await prisma.job.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.hrProfile.deleteMany();
  await prisma.user.deleteMany();

  const admin = await prisma.user.create({
    data: {
      email: 'admin@hrms.local',
      fullName: 'System Admin',
      passwordHash: await argon2.hash('Admin123!'),
      role: 'ADMIN'
    }
  });

  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@hrms.local',
      fullName: 'Huyen HR',
      passwordHash: await argon2.hash('Hr123456'),
      role: 'HR',
      hrProfile: {
        create: {
          position: 'HR Business Partner',
          phone: '+84 888 123 456'
        }
      }
    },
    include: {
      hrProfile: true
    }
  });

  const candidateUser = await prisma.user.create({
    data: {
      email: 'candidate@hrms.local',
      fullName: 'Minh Candidate',
      passwordHash: await argon2.hash('Candidate123'),
      role: 'CANDIDATE',
      candidate: {
        create: {
          headline: 'Frontend Intern',
          skills: ['react', 'typescript', 'html', 'css'],
          yearsExp: 1,
          bio: 'Aspiring frontend engineer passionate about design systems.'
        }
      }
    },
    include: {
      candidate: true
    }
  });

  const job = await prisma.job.create({
    data: {
      title: 'Frontend Intern',
      jdRaw: 'Yêu cầu: React, TypeScript, HTML, CSS, Git.',
      skills: ['react', 'typescript', 'html', 'css', 'git'],
      department: 'Engineering',
      level: 'Intern',
      location: 'Ho Chi Minh City',
      type: 'Full-time',
      salaryMin: 300,
      salaryMax: 500,
      createdById: hrUser.id
    }
  });

  const resume = await prisma.resume.create({
    data: {
      candidateId: candidateUser.candidate.id,
      objectName: 'seed/cv-frontend-intern.pdf',
      fileName: 'cv-frontend-intern.pdf',
      mimeType: 'application/pdf',
      textContent: 'React developer intern experience building dashboards with TypeScript and CSS.',
      parsedJson: {
        summary: 'Front-end intern experience with React and TypeScript',
        skills: ['react', 'typescript', 'html', 'css']
      },
      status: 'PARSED'
    }
  });

  await prisma.candidate.update({
    where: { id: candidateUser.candidate.id },
    data: { defaultResumeId: resume.id }
  });

  await prisma.application.create({
    data: {
      jobId: job.id,
      candidateId: candidateUser.candidate.id,
      resumeId: resume.id,
      status: 'SUBMITTED',
      stage: 'Screening',
      notes: 'Seed application',
      score: 78
    }
  });

  console.log('Seed data created');
  console.log('Admin login -> email: admin@hrms.local password: Admin123! (user id:', admin.id + ')');
  console.log('HR login -> email: hr@hrms.local password: Hr123456 (user id:', hrUser.id + ')');
  console.log('Candidate login -> email: candidate@hrms.local password: Candidate123 (user id:', candidateUser.id + ')');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });