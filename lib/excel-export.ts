import ExcelJS from "exceljs";

export interface ExcelColumn {
  header: string;
  key: string;
  width?: number;
}

export async function generateExcelWorkbook(
  title: string,
  columns: ExcelColumn[],
  data: any[]
): Promise<Buffer> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "AP Enerfy Solar ERP";
  workbook.created = new Date();

  const worksheet = workbook.addWorksheet(title);

  // Title Row
  worksheet.mergeCells("A1", `${String.fromCharCode(64 + columns.length)}1`);
  const titleCell = worksheet.getCell("A1");
  titleCell.value = `AP Enerfy Solar - ${title}`;
  titleCell.font = { name: "Arial", size: 14, bold: true, color: { argb: "FFFFFFFF" } };
  titleCell.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF0B1F1A" },
  };
  titleCell.alignment = { vertical: "middle", horizontal: "center" };
  worksheet.getRow(1).height = 30;

  // Header Row
  worksheet.getRow(2).values = columns.map((col) => col.header);
  worksheet.getRow(2).height = 24;
  worksheet.getRow(2).font = { name: "Arial", size: 10, bold: true, color: { argb: "FFFFFFFF" } };
  worksheet.getRow(2).fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FF16A34A" },
  };

  columns.forEach((col, idx) => {
    worksheet.getColumn(idx + 1).width = col.width || 18;
    worksheet.getColumn(idx + 1).alignment = { vertical: "middle" };
  });

  // Data Rows
  data.forEach((item) => {
    const rowValues = columns.map((col) => item[col.key] ?? "");
    const row = worksheet.addRow(rowValues);
    row.height = 20;
    row.font = { name: "Arial", size: 9 };
  });

  // Borders
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber > 1) {
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin", color: { argb: "FFE2E8F0" } },
          left: { style: "thin", color: { argb: "FFE2E8F0" } },
          bottom: { style: "thin", color: { argb: "FFE2E8F0" } },
          right: { style: "thin", color: { argb: "FFE2E8F0" } },
        };
      });
    }
  });

  const buffer = await workbook.xlsx.writeBuffer();
  return Buffer.from(buffer);
}
