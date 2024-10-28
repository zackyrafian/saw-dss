import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET: Mengambil semua alternative untuk project tertentu
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

    const alternatives = await prisma.alternative.findMany({
      where: { projectId },
      orderBy: { id: 'asc' },
    });

    return NextResponse.json(alternatives);

  } catch (error) {
    console.error("Error fetching alternatives:", error);
    return NextResponse.json(
      { message: "Error fetching alternatives", error },
      { status: 500 }
    );
  }
}

// POST: Membuat alternative baru
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

    const { name, description } = await request.json();

    // Validasi input
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { message: "Name is required and must be a string" },
        { status: 400 }
      );
    }

    // Cek apakah project exists
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project) {
      return NextResponse.json(
        { message: "Project not found" },
        { status: 404 }
      );
    }

    // Create alternative
    const alternative = await prisma.alternative.create({
      data: {
        name,
        description,
        projectId,
      },
    });

    return NextResponse.json(alternative, { status: 201 });

  } catch (error) {
    console.error("Error creating alternative:", error);
    return NextResponse.json(
      { message: "Error creating alternative", error },
      { status: 500 }
    );
  }
}