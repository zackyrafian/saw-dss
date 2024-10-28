// app/api/project/[id]/evaluation/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Mengambil semua evaluation untuk project tertentu
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const evaluations = await prisma.evaluation.findMany({
      where: {
        criteria: {
          projectId: projectId
        }
      },
      include: {
        criteria: true,
        alternative: true
      }
    });

    return NextResponse.json(evaluations);

  } catch (error) {
    console.error("Error fetching evaluations:", error);
    return NextResponse.json(
      { message: "Error fetching evaluations", error },
      { status: 500 }
    );
  }
}

// POST: Membuat atau mengupdate multiple evaluations
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const projectId = parseInt(params.id);

    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    const { evaluations } = await request.json();

    if (!Array.isArray(evaluations)) {
      return NextResponse.json(
        { message: "Evaluations must be an array" },
        { status: 400 }
      );
    }

    // Validate each evaluation
    for (const evaluation of evaluations) {
      if (!evaluation.criteriaId || !evaluation.alternativeId || typeof evaluation.value !== 'number') {
        return NextResponse.json(
          { message: "Invalid evaluation data" },
          { status: 400 }
        );
      }
    }

    // Use transaction to ensure all operations succeed or none do
    const result = await prisma.$transaction(async (prisma) => {
      const createdEvaluations = [];

      for (const evaluation of evaluations) {
        const created = await prisma.evaluation.upsert({
          where: {
            criteriaId_alternativeId: {
              criteriaId: evaluation.criteriaId,
              alternativeId: evaluation.alternativeId
            }
          },
          update: {
            value: evaluation.value
          },
          create: {
            criteriaId: evaluation.criteriaId,
            alternativeId: evaluation.alternativeId,
            value: evaluation.value
          },
          include: {
            criteria: true,
            alternative: true
          }
        });
        createdEvaluations.push(created);
      }

      return createdEvaluations;
    });

    return NextResponse.json(result, { status: 201 });

  } catch (error) {
    console.error("Error creating evaluations:", error);
    return NextResponse.json(
      { message: "Error creating evaluations", error },
      { status: 500 }
    );
  }
}