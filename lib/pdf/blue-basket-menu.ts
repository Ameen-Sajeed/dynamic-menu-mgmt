import PDFDocument from "pdfkit";
import type { Menu } from "@/lib/types";

const navy = "#17165e";
const blue = "#2688d5";
const paleBlue = "#e6f2fb";
const ink = "#252b42";
const page = { width: 595.28, height: 841.89, margin: 36 };
const columns = [
  { label: "ITEM", width: 192, align: "left" as const },
  { label: "PRESS", width: 84, align: "center" as const },
  { label: "WASH &\nPRESS", width: 98, align: "center" as const },
  { label: "DRY\nCLEAN", width: 84, align: "center" as const },
];

type PdfDocument = InstanceType<typeof PDFDocument>;

export async function createBlueBasketMenuPdf(menu: Menu, assets: { logo: Buffer; cover: Buffer }) {
  const document = new PDFDocument({ size: "A4", margin: 0, autoFirstPage: false, info: { Title: `${menu.business_name} price list`, Author: menu.business_name } });
  const chunks: Buffer[] = [];
  document.on("data", (chunk: Buffer) => chunks.push(chunk));
  const complete = new Promise<Buffer>((resolve, reject) => {
    document.on("end", () => resolve(Buffer.concat(chunks)));
    document.on("error", reject);
  });

  addCover(document, assets);
  addPriceList(document, menu, assets.logo);
  document.end();
  return complete;
}

function addCover(document: PdfDocument, assets: { logo: Buffer; cover: Buffer }) {
  document.addPage({ size: "A4", margin: 0 });
  document.image(assets.cover, 0, 0, { width: page.width, height: page.height });
  // Use the original logo file as a sharp overlay, rather than relying only on the photographed artwork.
  document.image(assets.logo, 44, 34, { fit: [270, 88] });
}

function addPriceList(document: PdfDocument, menu: Menu, logo: Buffer) {
  document.addPage({ size: "A4", margin: 0 });
  drawBackground(document, logo);
  let y = 60;
  y = drawHeader(document, menu, y);

  for (const category of menu.categories) {
    const rows = category.products;
    const height = tableHeight(rows.length);
    if (y + height > page.height - 62) {
      document.addPage({ size: "A4", margin: 0 });
      drawBackground(document, logo);
      y = drawHeader(document, menu, 60);
    }
    y = drawCategoryTable(document, category.name, rows, y) + 14;
  }

  document.font("Helvetica-Bold").fontSize(7.5).fillColor(blue)
    .text("Shop No 14, Rose 1 Building, Al Karama, Dubai, UAE  |  +971 4 553 6673  |  +971 54 783 4850", 84, page.height - 30, { width: 476, align: "center" });
}

function drawBackground(document: PdfDocument, logo: Buffer) {
  document.rect(0, 0, page.width, page.height).fill("#f5fbff");
  document.rect(0, 0, 48, page.height).fill(navy);
  document.save().opacity(0.1).circle(590, 24, 112).fill(blue).restore();
  document.image(logo, 9, 686, { fit: [31, 100] });
  document.save().rotate(-90, { origin: [25, 402] }).font("Helvetica-Bold").fontSize(18).fillColor("#ffffff")
    .text("BLUE BASKET LAUNDRY", -356, 14, { width: 720, align: "center", characterSpacing: 1.5 }).restore();
}

function drawHeader(document: PdfDocument, menu: Menu, y: number) {
  document.font("Helvetica-Bold").fontSize(19).fillColor(navy).text(menu.business_name, 74, y, { width: 330 });
  document.font("Helvetica-Bold").fontSize(8).fillColor(blue).text("PREMIUM LAUNDRY & DRY CLEANING", 74, y + 25, { characterSpacing: 1.25 });
  document.font("Helvetica-Bold").fontSize(9).fillColor(navy).text("PRICE LIST", 436, y + 8, { width: 120, align: "right", characterSpacing: 1.5 });
  document.moveTo(74, y + 43).lineTo(556, y + 43).lineWidth(1.5).strokeColor(blue).stroke();
  return y + 59;
}

function drawCategoryTable(document: PdfDocument, category: string, products: Menu["categories"][number]["products"], y: number) {
  const x = 74;
  const width = columns.reduce((total, column) => total + column.width, 0);
  const headerHeight = 30;
  const rowHeight = 17;
  const totalHeight = headerHeight + products.length * rowHeight;
  document.roundedRect(x, y, width, totalHeight, 9).fill("#ffffff");
  document.roundedRect(x, y, width, headerHeight, 9).fill(blue);
  document.rect(x, y + 18, width, 12).fill(blue);

  let currentX = x;
  for (const column of columns) {
    document.font("Helvetica-Bold").fontSize(7.8).fillColor("#ffffff")
      .text(column.label, currentX + 5, y + 8, { width: column.width - 10, align: column.align, lineGap: -1 });
    currentX += column.width;
  }

  document.save().rotate(-90, { origin: [62, y + totalHeight / 2] }).font("Helvetica-Bold").fontSize(10.5).fillColor(navy)
    .text(category, -y - totalHeight / 2 - 30, 53, { width: 60, align: "center", characterSpacing: 1.5 }).restore();

  products.forEach((product, index) => {
    const rowY = y + headerHeight + index * rowHeight;
    if (index % 2 === 0) document.rect(x, rowY, width, rowHeight).fill(paleBlue);
    const values = [product.name, printable(product.press_price), printable(product.wash_press_price), printable(product.dry_clean_price)];
    let cellX = x;
    values.forEach((value, valueIndex) => {
      const column = columns[valueIndex];
      document.font(valueIndex === 0 ? "Helvetica" : "Helvetica-Bold").fontSize(8.3).fillColor(ink)
        .text(value, cellX + 6, rowY + 4.5, { width: column.width - 12, align: column.align, lineBreak: false, ellipsis: true });
      cellX += column.width;
    });
  });
  document.roundedRect(x, y, width, totalHeight, 9).lineWidth(0.5).strokeColor("#d5e8f7").stroke();
  return y + totalHeight;
}

function printable(value: string | null) {
  return value?.trim() || "-";
}

function tableHeight(rows: number) {
  return 30 + rows * 17;
}
