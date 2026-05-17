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

export async function GET() {
  try {
    const products = await prisma.globalProduct.findMany({
      orderBy: { category: 'asc' },
    });

    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error('Error fetching global products:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'bulk') {
      const { products } = body;
      const createdProducts = [];

      for (const p of products) {
        const unitType = mapUnitType(p.unit_type || p.unitType);
        
        const existing = await prisma.globalProduct.findFirst({
          where: { nameEs: p.name_es },
        });

        if (existing) {
          await prisma.globalProduct.update({
            where: { id: existing.id },
            data: {
              category: p.category,
              nameFr: p.name_fr || null,
              nameAr: p.name_ar || null,
              price: p.price_mad || p.price,
              unitType: unitType as any,
              barcode: p.barcode || null,
              imageUrl: p.image_url || null,
            },
          });
          createdProducts.push({ ...p, status: 'updated' });
        } else {
          const product = await prisma.globalProduct.create({
            data: {
              category: p.category,
              nameEs: p.name_es,
              nameFr: p.name_fr || null,
              nameAr: p.name_ar || null,
              price: p.price_mad || p.price,
              unitType: unitType as any,
              barcode: p.barcode || null,
              imageUrl: p.image_url || null,
              isActive: true,
            },
          });
          createdProducts.push({ ...p, status: 'created', id: product.id });
        }
      }

      return NextResponse.json({ 
        success: true, 
        message: `${createdProducts.length} productos globales procesados`,
        data: createdProducts 
      });
    }

    if (action === 'distribute') {
      const { tenantIds } = body;
      const globalProducts = await prisma.globalProduct.findMany({ where: { isActive: true } });
      
      const results = [];
      
      for (const tenantId of tenantIds) {
        for (const gp of globalProducts) {
          let categoryId = null;
          
          let category = await prisma.category.findFirst({
            where: { tenantId, name: gp.category },
          });

          if (!category) {
            category = await prisma.category.create({
              data: { tenantId, name: gp.category },
            });
          }
          categoryId = category.id;

          const existingProduct = await prisma.product.findFirst({
            where: {
              tenantId,
              name: gp.nameEs,
            },
          });

          if (!existingProduct) {
            await prisma.product.create({
              data: {
                tenantId,
                categoryId,
                name: gp.nameEs,
                price: gp.price,
                unitType: gp.unitType,
                barcode: gp.barcode,
                photo: gp.imageUrl,
                isActive: true,
              },
            });
          }
        }
        results.push({ tenantId, productsAdded: globalProducts.length });
      }

      return NextResponse.json({ 
        success: true, 
        message: 'Productos distribuidos a tiendas',
        data: results 
      });
    }

    const { category, nameEs, nameFr, nameAr, price, unitType, barcode, imageUrl } = body;

    const product = await prisma.globalProduct.create({
      data: {
        category,
        nameEs,
        nameFr: nameFr || null,
        nameAr: nameAr || null,
        price: parseFloat(price),
        unitType: unitType as any,
        barcode: barcode || null,
        imageUrl: imageUrl || null,
        isActive: true,
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error creating global product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, nameEs, nameFr, nameAr, category, price, unitType, barcode, imageUrl, isActive } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    const product = await prisma.globalProduct.update({
      where: { id },
      data: {
        ...(nameEs && { nameEs }),
        ...(nameFr !== undefined && { nameFr }),
        ...(nameAr !== undefined && { nameAr }),
        ...(category && { category }),
        ...(price && { price: parseFloat(price) }),
        ...(unitType && { unitType: unitType as any }),
        ...(barcode !== undefined && { barcode }),
        ...(imageUrl !== undefined && { imageUrl }),
        ...(isActive !== undefined && { isActive }),
      },
    });

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error('Error updating global product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'ID requerido' }, { status: 400 });
    }

    await prisma.globalProduct.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Producto global eliminado' });
  } catch (error) {
    console.error('Error deleting global product:', error);
    return NextResponse.json({ success: false, error: 'Error interno' }, { status: 500 });
  }
}