// app/api/project/[id]/evaluation/matrix/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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

    // Ambil semua criteria dan alternatives untuk project
    const criterias = await prisma.criteria.findMany({
      where: { projectId }
    });

    const alternatives = await prisma.alternative.findMany({
      where: { projectId }
    });

    // Ambil semua evaluations yang ada
    const evaluations = await prisma.evaluation.findMany({
      where: {
        criteria: {
          projectId
        }
      }
    });

    // Buat matrix evaluasi
    const matrix = alternatives.map(alternative => {
      const row = criterias.map(criteria => {
        const evaluation = evaluations.find(
          item => item.criteriaId === criteria.id && item.alternativeId === alternative.id
        );
        return evaluation?.value ?? 0;
      });
      return {
        alternativeId: alternative.id,
        alternativeName: alternative.name,
        values: row
      };
    });

    return NextResponse.json({
      criterias: criterias.map(criteria => ({
        id: criteria.id,
        name: criteria.name,
        weight: criteria.weight,
        type: criteria.type
      })),
      matrix
    });

  } catch (error) {
    console.error("Error fetching evaluation matrix:", error);
    return NextResponse.json(
      { message: "Error fetching evaluation matrix", error },
      { status: 500 }
    );
  }
}