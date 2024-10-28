// app/api/projects/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { name } = await request.json();

    if (!name) {
      return NextResponse.json({ message: "Name is required" }, { status: 400 });
    }

    const newProject = await prisma.project.create({
      data: {
        name,
      },
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("Error creating project: ", error);
    return NextResponse.json(
      { message: "Error creating project", error },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
    try {
      // Get query parameters
      const { searchParams } = new URL(request.url);
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      const search = searchParams.get('search') || '';
  
      // Calculate skip for pagination
      const skip = (page - 1) * limit;
  
      // Get total count for pagination
      const totalCount = await prisma.project.count({
        where: {
          name: {
            contains: search,
            mode: 'insensitive', // Case insensitive search
          },
        },
      });
  
      // Get projects
      const projects = await prisma.project.findMany({
        where: {
          name: {
            contains: search,
            mode: 'insensitive',
          },
        },
        skip,
        take: limit,
      });
  
      return NextResponse.json({
        projects,
        metadata: {
          total: totalCount,
          page,
          limit,
          totalPages: Math.ceil(totalCount / limit),
        },
      });
    } catch (error) {
      console.error("Error fetching projects: ", error);
      return NextResponse.json(
        { message: "Error fetching projects", error },
        { status: 500 }
      );
    }
  }