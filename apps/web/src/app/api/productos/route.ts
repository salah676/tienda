import { NextResponse } from 'next/server';
import prisma from '@debt-manager/db';

function mapUnitType(unitType: string) {
  switch (unitType?.toLowerCase()) {
    case 'unid':
    case 'pieza':
      return 'PIEZA';
    case 'kg':
    case 'kilo':
      return 'KILO';
    case 'g':
    case 'gramo':
    case 'gramos':
      return 'GRAMO';
    case 'l':
    case 'litro':
    case 'litros':
      return 'LITRO';
    default:
      return 'PIEZA';
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tenantId = searchParams.get('tenantId');

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID requerido' }, { status: 400 });
    }

    const products = await prisma.product.findMany({
      where: { tenantId },
      include: { category: true },
      orderBy: { name: 'asc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { tenantId, products, action } = body;

    if (!tenantId) {
      return NextResponse.json({ success: false, error: 'Tenant ID requerido' }, { status: 400 });
    }

    if (action === 'bulk') {
      const createdProducts = [];

      for (const p of products) {
        const unitType = mapUnitType(p.unit_type || p.unitType);
        
        const existingProduct = await prisma.product.findFirst({
          where: {
            tenantId,
            name: p.name_es || p.name,
          },
        });

        if (existingProduct) {
          await prisma.product.update({
            where: { id: existingProduct.id },
            data: {
              price: p.price_mad || p.price,
              unitType: unitType as any,
              barcode: p.barcode || null,
              photo: p.image_url || null,
            },
          });
          createdProducts.push({ ...p, status: 'updated' });
        } else {
          let categoryId = null;
          const categoryName = p.category || 'General';
          
          let category = await prisma.category.findFirst({
            where: { tenantId, name: categoryName },
          });

          if (!category) {
            category = await prisma.category.create({
              data: { tenantId, name: categoryName },
            });
          }
          categoryId = category.id;

          const product = await prisma.product.create({
            data: {
              tenantId,
              categoryId,
              name: p.name_es || p.name,
              price: p.price_mad || p.price,
              unitType: unitType as any,
              barcode: p.barcode || null,
              photo: p.image_url || null,
              isActive: true,
            },
          });
          createdProducts.push({ ...p, status: 'created', id: product.id });
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `${createdProducts.length} productos procesados`,
        data: createdProducts 
      });
    }

    const { name, price, unitType, barcode, photo, categoryId, description } = body;

    const product = await prisma.product.create({
      data: {
        tenantId,
        name,
        price: parseFloat(price),
        unitType: unitType as any,
        barcode: barcode || null,
        photo: photo || null,
        categoryId: categoryId || null,
        description: description || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, price, unitType, barcode, photo, categoryId, description, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de producto requerido' }, { status: 400 });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(price && { price: parseFloat(price) }),
        ...(unitType && { unitType: unitType as any }),
        ...(barcode !== undefined && { barcode }),
        ...(photo !== undefined && { photo }),
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID de producto requerido' }, { status: 400 });
    }

    await prisma.product.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Producto eliminado' });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}