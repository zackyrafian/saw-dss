// app/api/project/[id]/criteria/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Parse project ID from params
    const projectId = parseInt(params.id);

    // Validate project ID
    if (isNaN(projectId)) {
      return NextResponse.json(
        { message: "Invalid project ID" },
        { status: 400 }
      );
    }

    // Get request body
    const { name, weight, type } = await request.json();

    // Validate request body
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    if (!weight || typeof weight !== 'number') {
      return NextResponse.json(
        { message: "Weight is required and must be a number between 0 and 1" },
        { status: 400 }
      );
    }

    if (!type || !['COST', 'BENEFIT'].includes(type)) {
      return NextResponse.json(
        { message: "Type is required and must be either COST or BENEFIT" },
        { status: 400 }
      );
    }

    // Check if project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Create new criteria
    const criteria = await prisma.criteria.create({
      data: {
        name,
        weight,
        type,
        projectId,
      },
    });

    return NextResponse.json(criteria, { status: 201 });

  } catch (error) {
    console.error("Error creating criteria:", error);
    return NextResponse.json(
      { message: "Error creating criteria", error },
      { status: 500 }
    );
  }
}

// GET all criteria for a project
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

    const criteria = await prisma.criteria.findMany({
      where: { projectId },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(criteria);

  } catch (error) {
    console.error("Error fetching criteria:", error);
    return NextResponse.json(
      { message: "Error fetching criteria", error },
      { status: 500 }
    );
  }
}