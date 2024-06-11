'use server';

import prisma from './db';
import { JobType, CreateAndEditJobType, createAndEditJobSchema } from './types';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';
import { auth } from '@clerk/nextjs/server';

const authenticateAndRedirect = (): string => {
  const { userId } = auth();
  if (!userId) redirect('/');
  return userId;
};

export const createJobAction = async (values: CreateAndEditJobType): Promise<JobType | null> => {
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const userId = authenticateAndRedirect();

  try {
    createAndEditJobSchema.parse(values);
    const job: JobType = await prisma.job.create({
      data: { ...values, clerkId: userId },
    });
    return job;
  } catch (error) {
    console.log(error);
    return null;
  }
};