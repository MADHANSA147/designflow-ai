import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with CampusEats data...');

  // 1. Create User & Workspace
  const user = await prisma.user.create({
    data: {
      name: 'Jane Designer',
      email: 'jane@designflow.ai',
      password: 'hashed-password-here', // In a real app, this would be argon2 hashed
    },
  });

  const workspace = await prisma.workspace.create({
    data: {
      name: 'DesignFlow Studio',
      ownerId: user.id,
      members: {
        create: {
          userId: user.id,
          role: 'OWNER',
        },
      },
    },
  });

  // 2. Create Project
  const project = await prisma.project.create({
    data: {
      workspaceId: workspace.id,
      name: 'CampusEats',
      description: 'Food delivery platform designed specifically for college students',
      status: 'IN_PROGRESS',
    },
  });

  // 3. Create Product Brief & Personas
  const brief = await prisma.productBrief.create({
    data: {
      projectId: project.id,
      targetAudience: 'College students living on or near campus',
      coreProblem: 'Students want late-night food delivery from dining halls and local spots without high fees.',
      toneOfVoice: 'Vibrant, energetic, and relatable',
      personas: {
        create: [
          {
            name: 'Alex Freshman',
            role: 'Student',
            demographics: '18-20, living in dorms',
            painPoints: ['Dining hall closes early', 'Expensive delivery fees'],
            goals: ['Get cheap late-night snacks', 'Use campus meal plan points'],
          },
        ],
      },
      features: {
        create: [
          { name: 'Campus Card Integration', description: 'Pay with student ID', priority: 'MUST_HAVE' },
          { name: 'Dorm Delivery Dropoff', description: 'Specific dropoff zones for dorms', priority: 'SHOULD_HAVE' },
        ],
      },
    },
  });

  // 4. Create UX Plan & User Flow
  const uxPlan = await prisma.uxPlan.create({
    data: {
      projectId: project.id,
      status: 'APPROVED',
      userFlows: {
        create: {
          name: 'Order Food Flow',
          description: 'The core flow from opening the app to placing an order.',
        },
      },
    },
  });

  const orderFlowId = (await prisma.userFlow.findFirst({ where: { uxPlanId: uxPlan.id } }))!.id;

  const node1 = await prisma.userFlowNode.create({
    data: { userFlowId: orderFlowId, name: 'Home Screen', nodeType: 'SCREEN' },
  });
  const node2 = await prisma.userFlowNode.create({
    data: { userFlowId: orderFlowId, name: 'Restaurant Menu', nodeType: 'SCREEN' },
  });
  const node3 = await prisma.userFlowNode.create({
    data: { userFlowId: orderFlowId, name: 'Checkout', nodeType: 'SCREEN' },
  });

  await prisma.userFlowEdge.createMany({
    data: [
      { userFlowId: orderFlowId, sourceId: node1.id, targetId: node2.id, label: 'Select Restaurant' },
      { userFlowId: orderFlowId, sourceId: node2.id, targetId: node3.id, label: 'Add to Cart & Checkout' },
    ],
  });

  // 5. Create Design System & Tokens
  const designSystem = await prisma.designSystem.create({
    data: {
      projectId: project.id,
      name: 'CampusEats System',
      colors: {
        create: [
          { name: 'primary', value: '#7c3aed', theme: 'light' },
          { name: 'surface', value: '#131315', theme: 'dark' },
          { name: 'tertiary', value: '#4ae176', theme: 'dark' },
        ],
      },
      typography: {
        create: [
          { name: 'headline-1', fontFamily: 'Inter', fontSize: '24px', fontWeight: '600', lineHeight: '32px' },
          { name: 'body', fontFamily: 'Inter', fontSize: '14px', fontWeight: '400', lineHeight: '20px' },
        ],
      },
      spacing: {
        create: [
          { name: 'sm', value: '0.5rem' },
          { name: 'md', value: '0.75rem' },
          { name: 'lg', value: '1.5rem' },
        ],
      },
    },
  });

  // 6. Create Global Component
  const buttonComponent = await prisma.component.create({
    data: {
      projectId: project.id,
      name: 'PrimaryButton',
      baseStyles: JSON.stringify({ padding: '1rem', borderRadius: '0.75rem', display: 'flex', alignItems: 'center' }),
      variants: {
        create: [
          { name: 'default', props: JSON.stringify({ background: 'linear-gradient(to right, #7c3aed, #0566d9)', color: 'white' }) },
        ],
      },
    },
  });

  // 7. Create Screens
  const homeScreen = await prisma.screen.create({
    data: {
      projectId: project.id,
      name: 'Home Dashboard',
      description: 'Main app dashboard',
      layout: JSON.stringify({ type: 'flex', direction: 'column' }),
      componentTree: JSON.stringify({ id: 'root', type: 'div', children: [{ id: 'header', type: 'header' }, { id: 'btn-1', type: 'PrimaryButton' }] }),
      styles: JSON.stringify({ backgroundColor: '#131315', minHeight: '100vh' }),
      responsiveBehavior: JSON.stringify({ breakpoints: { md: '768px' } }),
      interactions: JSON.stringify({}),
      components: {
        create: [
          {
            componentId: buttonComponent.id,
            nodeId: 'btn-1',
            props: JSON.stringify({ label: 'Order Now' }),
            styles: JSON.stringify({ marginTop: '1rem' }),
          },
        ],
      },
    },
  });

  const menuScreen = await prisma.screen.create({
    data: {
      projectId: project.id,
      name: 'Restaurant Menu',
      layout: JSON.stringify({ type: 'flex', direction: 'column' }),
      componentTree: JSON.stringify({ id: 'root', type: 'div' }),
    },
  });

  // 8. Create Prototype Connections
  const prototype = await prisma.prototype.create({
    data: {
      projectId: project.id,
      connections: {
        create: [
          {
            sourceScreenId: homeScreen.id,
            targetScreenId: menuScreen.id,
            trigger: 'CLICK',
            triggerNodeId: 'btn-1',
            animation: 'SLIDE_IN',
          },
        ],
      },
    },
  });

  // 9. AI Memory & Reviews
  await prisma.designMemory.create({
    data: {
      projectId: project.id,
      brandRules: ['Always use dark mode as primary', 'Vibrant neon accents'],
      colors: ['#7c3aed', '#131315', '#4ae176'],
      typography: ['Inter', 'JetBrains Mono'],
      spacing: ['4px basis'],
      componentRules: ['Buttons must be pill-shaped or heavily rounded'],
      navigationRules: ['Bottom tab bar for main nav'],
      uxPrinciples: ['Minimize clicks to checkout', 'High contrast for readability'],
      userPreferences: ['Loves glassmorphism'],
      aiDecisions: ['Chose dark theme to reduce eye strain for late-night usage.'],
      projectConstraints: ['Must adhere to WCAG AA'],
    },
  });

  const review = await prisma.aiReview.create({
    data: {
      projectId: project.id,
      screenId: homeScreen.id,
      score: 92.5,
      findings: {
        create: [
          { type: 'SUGGESTION', description: 'Increase contrast on the secondary text.' },
        ],
      },
    },
  });

  await prisma.accessibilityReview.create({
    data: {
      projectId: project.id,
      screenId: homeScreen.id,
      wcagLevel: 'AA',
      score: 100,
      findings: {
        create: [
          { type: 'INFO', description: 'All text meets contrast requirements.' },
        ],
      },
    },
  });

  // 10. Version Snapshot
  await prisma.projectVersion.create({
    data: {
      projectId: project.id,
      tag: 'v1.0.0-draft',
      description: 'Initial AI generation pass',
      snapshot: JSON.stringify({
        project,
        brief,
        screens: [homeScreen, menuScreen],
      }),
    },
  });

  console.log('✅ Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
