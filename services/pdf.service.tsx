import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  renderToBuffer,
} from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 9,
    fontFamily: "Helvetica",
    color: "#1e293b",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 2,
    borderBottomColor: "#16a34a",
    paddingBottom: 15,
    marginBottom: 15,
  },
  brandTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#0b1f1a",
  },
  brandSubtitle: {
    fontSize: 8,
    color: "#16a34a",
    marginBottom: 4,
    fontWeight: "bold",
  },
  companyDetails: {
    fontSize: 8,
    color: "#64748b",
    lineHeight: 1.3,
  },
  invoiceTitleBlock: {
    textAlign: "right",
  },
  invoiceTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#16a34a",
  },
  invoiceMeta: {
    fontSize: 8,
    marginTop: 2,
    color: "#475569",
  },
  billSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 10,
    backgroundColor: "#f8fafc",
    borderRadius: 4,
  },
  billCol: {
    width: "48%",
  },
  sectionHeading: {
    fontSize: 9,
    fontWeight: "bold",
    color: "#0b1f1a",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  billText: {
    fontSize: 8,
    color: "#334155",
    lineHeight: 1.3,
  },
  table: {
    width: "100%",
    marginBottom: 15,
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#0b1f1a",
    color: "#ffffff",
    padding: 6,
    fontWeight: "bold",
    fontSize: 8,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
    padding: 6,
    fontSize: 8,
  },
  col1: { width: "8%" },
  col2: { width: "42%" },
  col3: { width: "15%", textAlign: "center" },
  col4: { width: "10%", textAlign: "right" },
  col5: { width: "12%", textAlign: "right" },
  col6: { width: "13%", textAlign: "right" },

  totalsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  bankDetails: {
    width: "55%",
    padding: 8,
    backgroundColor: "#f1f5f9",
    borderRadius: 4,
  },
  totalsTable: {
    width: "40%",
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 3,
    fontSize: 8,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 5,
    borderTopWidth: 1.5,
    borderTopColor: "#16a34a",
    fontSize: 10,
    fontWeight: "bold",
    color: "#0b1f1a",
  },
  footer: {
    position: "absolute",
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: "center",
    fontSize: 7,
    color: "#94a3b8",
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
    paddingTop: 8,
  },
});

export async function generateInvoicePdf(invoice: any): Promise<Buffer> {
  const taxable = Number(invoice.taxableAmount || 0);
  const totalTax = Number(invoice.totalTax || 0);
  const totalAmount = Number(invoice.totalAmount || 0);
  const paidAmount = Number(invoice.paidAmount || 0);
  const balance = Number(invoice.balanceAmount || 0);

  const doc = (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.brandTitle}>AP Enerfy Solar Pvt Ltd</Text>
            <Text style={styles.brandSubtitle}>SOLAR ENERGY SOLUTIONS</Text>
            <Text style={styles.companyDetails}>
              Plot No. 104, Infocity Avenue, Patia, Bhubaneswar, Odisha 751024
            </Text>
            <Text style={styles.companyDetails}>
              GSTIN: 21AAACA1234A1Z5 | PAN: AAACA1234A | State: Odisha (Code: 21)
            </Text>
            <Text style={styles.companyDetails}>
              Email: billing@apenerfy.com | Phone: +91 674 2548900
            </Text>
          </View>
          <View style={styles.invoiceTitleBlock}>
            <Text style={styles.invoiceTitle}>{invoice.invoiceType || "TAX INVOICE"}</Text>
            <Text style={styles.invoiceMeta}>Invoice No: {invoice.invoiceNumber}</Text>
            <Text style={styles.invoiceMeta}>
              Date: {new Date(invoice.invoiceDate).toLocaleDateString("en-IN")}
            </Text>
            <Text style={styles.invoiceMeta}>
              Due Date: {new Date(invoice.dueDate).toLocaleDateString("en-IN")}
            </Text>
            <Text style={styles.invoiceMeta}>
              Financial Year: {invoice.financialYear || "2024-2025"}
            </Text>
          </View>
        </View>

        {/* Bill To */}
        <View style={styles.billSection}>
          <View style={styles.billCol}>
            <Text style={styles.sectionHeading}>Billed To (Customer Details)</Text>
            <Text style={styles.billText}>{invoice.customer?.name || "Customer"}</Text>
            <Text style={styles.billText}>{invoice.customer?.address || "Address"}</Text>
            <Text style={styles.billText}>
              City: {invoice.customer?.city || "Bhubaneswar"}, Odisha
            </Text>
            <Text style={styles.billText}>Phone: {invoice.customer?.mobile || "-"}</Text>
            {invoice.customer?.gstin && (
              <Text style={styles.billText}>GSTIN: {invoice.customer.gstin}</Text>
            )}
          </View>
          <View style={styles.billCol}>
            <Text style={styles.sectionHeading}>Solar System & Site Details</Text>
            <Text style={styles.billText}>
              System Type: {invoice.systemType || "On-Grid Solar"}
            </Text>
            <Text style={styles.billText}>
              Capacity: {invoice.capacity || "3"} kW Rooftop Solar
            </Text>
            <Text style={styles.billText}>
              Discom: {invoice.customer?.discomName || "TPCODL"}
            </Text>
            <Text style={styles.billText}>
              Consumer No: {invoice.customer?.consumerNumber || "-"}
            </Text>
            <Text style={styles.billText}>Payment Status: {invoice.status}</Text>
          </View>
        </View>

        {/* Items Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.col1}>#</Text>
            <Text style={styles.col2}>Description of Solar Equipment / Service</Text>
            <Text style={styles.col3}>HSN/SAC</Text>
            <Text style={styles.col4}>Qty</Text>
            <Text style={styles.col5}>Rate (₹)</Text>
            <Text style={styles.col6}>Amount (₹)</Text>
          </View>

          {invoice.items && invoice.items.length > 0 ? (
            invoice.items.map((it: any, index: number) => (
              <View style={styles.tableRow} key={index}>
                <Text style={styles.col1}>{index + 1}</Text>
                <Text style={styles.col2}>{it.description}</Text>
                <Text style={styles.col3}>{it.hsnCode || "85414300"}</Text>
                <Text style={styles.col4}>{it.quantity}</Text>
                <Text style={styles.col5}>
                  {Number(it.unitPrice).toLocaleString("en-IN")}
                </Text>
                <Text style={styles.col6}>
                  {Number(it.totalAmount).toLocaleString("en-IN")}
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.tableRow}>
              <Text style={styles.col1}>1</Text>
              <Text style={styles.col2}>
                Supply, Installation & Commissioning of {invoice.capacity} kW{" "}
                {invoice.systemType} Solar PV System
              </Text>
              <Text style={styles.col3}>85414300</Text>
              <Text style={styles.col4}>1 Set</Text>
              <Text style={styles.col5}>{taxable.toLocaleString("en-IN")}</Text>
              <Text style={styles.col6}>{taxable.toLocaleString("en-IN")}</Text>
            </View>
          )}
        </View>

        {/* Totals & Bank Details */}
        <View style={styles.totalsSection}>
          <View style={styles.bankDetails}>
            <Text style={[styles.sectionHeading, { fontSize: 8 }]}>
              Bank Details for RTGS / NEFT / IMPS
            </Text>
            <Text style={styles.billText}>Bank: HDFC Bank Ltd</Text>
            <Text style={styles.billText}>Account Name: AP Enerfy Solar Pvt Ltd</Text>
            <Text style={styles.billText}>Account No: 50200088921849</Text>
            <Text style={styles.billText}>IFSC Code: HDFC0001245</Text>
            <Text style={styles.billText}>UPI VPA: apenerfysolar@hdfcbank</Text>
          </View>

          <View style={styles.totalsTable}>
            <View style={styles.totalRow}>
              <Text>Taxable Subtotal:</Text>
              <Text>₹ {taxable.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>CGST (2.5%):</Text>
              <Text>₹ {Number(invoice.cgstAmount || totalTax / 2).toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>SGST (2.5%):</Text>
              <Text>₹ {Number(invoice.sgstAmount || totalTax / 2).toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.grandTotalRow}>
              <Text>Total Invoice Value:</Text>
              <Text>₹ {totalAmount.toLocaleString("en-IN")}</Text>
            </View>
            <View style={styles.totalRow}>
              <Text>Paid Amount:</Text>
              <Text>₹ {paidAmount.toLocaleString("en-IN")}</Text>
            </View>
            <View style={[styles.totalRow, { fontWeight: "bold" }]}>
              <Text>Balance Due:</Text>
              <Text>₹ {balance.toLocaleString("en-IN")}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>
            This is a computer-generated GST invoice for AP Enerfy Solar Pvt Ltd. Warranty is valid per OEM conditions.
          </Text>
          <Text>
            Thank you for choosing AP Enerfy Solar for a clean and green energy future!
          </Text>
        </View>
      </Page>
    </Document>
  );

  return await renderToBuffer(doc);
}
