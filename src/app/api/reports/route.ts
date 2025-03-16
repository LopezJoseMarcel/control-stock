import { NextRequest, NextResponse } from "next/server";
import Sale from "@/models/Sale";
import StockActuali from "@/models/StockActuali";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    // Obtener parámetros de filtrado
    const { searchParams } = new URL(req.url);
    const year = searchParams.get("year");
    const month = searchParams.get("month");
    const day = searchParams.get("day");

    // Construcción de filtro de fecha
    const dateFilter: { $gte?: Date; $lt?: Date } = {};
    if (year) dateFilter.$gte = new Date(`${year}-01-01`);
    if (month) dateFilter.$gte = new Date(`${year}-${month}-01`);
    if (day) dateFilter.$gte = new Date(`${year}-${month}-${day}`);

    if (year && !month) dateFilter.$lt = new Date(`${Number(year) + 1}-01-01`);
    if (month && !day) dateFilter.$lt = new Date(`${year}-${Number(month) + 1}-01`);
    if (day) dateFilter.$lt = new Date(`${year}-${month}-${Number(day) + 1}`);

    // Obtener datos de la base de datos
    const sales = await Sale.find(year || month || day ? { date: dateFilter } : {});
    const stockAdjustments = await StockActuali.find(year || month || day ? { date: dateFilter } : {});

    // Inicializar totales
    let totalCompradoEfectivo = 0;
    let totalCompradoTransferencia = 0;
    let totalGananciaEfectivo = 0;
    let totalGananciaTransferencia = 0;

    let totalVentasEfectivos = 0;
    let totalVentasTransferencia = 0;

    // Calcular ganancias
    sales.forEach((sale) => {
      const venta = sale.salePrice * sale.quantity ;
      const ganancia = (sale.salePrice - sale.cost) * sale.quantity;
      if (sale.tipo === "efectivo") {
        totalGananciaEfectivo += ganancia;
        totalVentasEfectivos += venta;
      } else {
        totalGananciaTransferencia += ganancia;
        totalVentasTransferencia += venta;
      }
    });

    // Calcular compras (ajustes de stock)
    stockAdjustments.forEach((stock) => {
      const totalCompra = stock.cost * stock.quantity;
      if (stock.tipo === "efectivo") {
        totalCompradoEfectivo += totalCompra;
      } else {
        totalCompradoTransferencia += totalCompra;
      }
    });

    // Retornar respuesta
    return NextResponse.json({
      sales,
      totalComprado: {
        efectivo: totalCompradoEfectivo,
        transferencia: totalCompradoTransferencia,
      },
      totalGanancia: {
        efectivo: totalGananciaEfectivo,
        transferencia: totalGananciaTransferencia,
      },
      totalVentas: {
        efectivo: totalVentasEfectivos,
        transferencia: totalVentasTransferencia,
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Error obteniendo datos" }, { status: 500 });
  }
}
