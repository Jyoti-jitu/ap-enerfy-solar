import React from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Image,
} from "@react-pdf/renderer";
import { InvoiceViewModel } from "@/lib/invoices/types";

const styles = StyleSheet.create({
  page: {
    padding: 24,
    fontSize: 8,
    fontFamily: "Helvetica",
    color: "#172B2A",
    backgroundColor: "#FFFFFF",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#D5E0D5",
    paddingBottom: 10,
    marginBottom: 8,
  },
  headerLeft: {
    width: "55%",
  },
  brandName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#145C32",
    marginBottom: 2,
  },
  tagline: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#559C32",
    textTransform: "uppercase",
    marginBottom: 3,
  },
  legalName: {
    fontSize: 7,
    color: "#4B5563",
  },
  headerRight: {
    width: "45%",
    textAlign: "right",
    fontSize: 7,
    color: "#374151",
    lineHeight: 1.25,
  },
  registeredOfficeTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#145C32",
    marginBottom: 2,
  },
  taxIdsRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 4,
    marginTop: 4,
    paddingTop: 3,
    borderTopWidth: 0.5,
    borderTopColor: "#E5E7EB",
    fontSize: 7,
  },
  taxIdLabel: {
    fontWeight: "bold",
    color: "#145C32",
  },

  /* Title bar */
  titleBar: {
    backgroundColor: "#145C32",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 2,
    marginVertical: 6,
    textAlign: "center",
  },
  titleText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },

  /* Customer & Details */
  detailsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
    gap: 8,
  },
  detailsBox: {
    width: "49%",
    borderWidth: 0.8,
    borderColor: "#D5E0D5",
    borderRadius: 3,
    padding: 6,
    backgroundColor: "#FAFAFA",
  },
  boxHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.6,
    borderBottomColor: "#D5E0D5",
    paddingBottom: 3,
    marginBottom: 4,
  },
  boxTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#145C32",
    textTransform: "uppercase",
  },
  customerName: {
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#172B2A",
    marginBottom: 2,
  },
  metaGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    rowGap: 3,
  },
  metaCol: {
    width: "50%",
  },
  metaLabel: {
    fontSize: 6.5,
    color: "#6B7280",
    textTransform: "uppercase",
  },
  metaValue: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#172B2A",
  },

  /* Table */
  table: {
    width: "100%",
    borderWidth: 0.8,
    borderColor: "#D5E0D5",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#145C32",
    color: "#FFFFFF",
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontWeight: "bold",
    fontSize: 7,
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
    paddingVertical: 3.5,
    paddingHorizontal: 4,
    fontSize: 7,
  },
  thCol1: { width: "5%", textAlign: "center" },
  thCol2: { width: "35%", textAlign: "left" },
  thCol3: { width: "12%", textAlign: "center" },
  thCol4: { width: "7%", textAlign: "center" },
  thCol5: { width: "7%", textAlign: "center" },
  thCol6: { width: "10%", textAlign: "right" },
  thCol7: { width: "10%", textAlign: "right" },
  thCol8: { width: "14%", textAlign: "right" },

  /* System Specs */
  systemBox: {
    borderWidth: 0.8,
    borderColor: "#559C32",
    backgroundColor: "#E8F3E5",
    borderRadius: 3,
    padding: 5,
    marginBottom: 8,
  },
  systemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 0.5,
    borderBottomColor: "#559C32",
    paddingBottom: 2,
    marginBottom: 4,
  },
  systemTitle: {
    fontSize: 7.5,
    fontWeight: "bold",
    color: "#145C32",
    textTransform: "uppercase",
  },
  systemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  systemCol: {
    width: "24%",
  },

  /* Middle Split: Tax & Bank vs Totals */
  middleSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 8,
  },
  leftMiddle: {
    width: "56%",
  },
  rightMiddle: {
    width: "42%",
  },

  /* Tax summary */
  taxTable: {
    borderWidth: 0.6,
    borderColor: "#D5E0D5",
    borderRadius: 2,
    marginBottom: 6,
  },
  taxHeader: {
    flexDirection: "row",
    backgroundColor: "#E8F3E5",
    padding: 3,
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#145C32",
    borderBottomWidth: 0.5,
    borderBottomColor: "#D5E0D5",
  },
  taxRow: {
    flexDirection: "row",
    padding: 2.5,
    fontSize: 6.5,
    borderBottomWidth: 0.5,
    borderBottomColor: "#E5E7EB",
  },

  /* Bank & QR */
  bankAndQr: {
    flexDirection: "row",
    gap: 6,
    borderWidth: 0.6,
    borderColor: "#D5E0D5",
    borderRadius: 3,
    padding: 5,
    backgroundColor: "#FAFAFA",
  },
  bankInfo: {
    flex: 1,
    fontSize: 6.5,
    lineHeight: 1.25,
  },
  bankTitle: {
    fontSize: 7,
    fontWeight: "bold",
    color: "#145C32",
    marginBottom: 2,
  },
  qrContainer: {
    width: 65,
    alignItems: "center",
    justifyContent: "center",
    borderLeftWidth: 0.5,
    borderLeftColor: "#E5E7EB",
    paddingLeft: 4,
  },
  qrImage: {
    width: 48,
    height: 48,
  },

  /* Totals */
  totalsBox: {
    borderWidth: 0.8,
    borderColor: "#D5E0D5",
    borderRadius: 3,
    backgroundColor: "#FFFFFF",
    overflow: "hidden",
  },
  totalsHeader: {
    backgroundColor: "#145C32",
    color: "#FFFFFF",
    fontSize: 7.5,
    fontWeight: "bold",
    padding: 3.5,
    textAlign: "center",
    textTransform: "uppercase",
  },
  totalsBody: {
    padding: 5,
    gap: 3,
  },
  totalsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    fontSize: 7,
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#E8F3E5",
    borderWidth: 0.8,
    borderColor: "#559C32",
    borderRadius: 2,
    padding: 4,
    marginTop: 3,
    fontSize: 8.5,
    fontWeight: "bold",
    color: "#145C32",
  },

  /* Amount in words */
  amountWordsBox: {
    borderWidth: 0.6,
    borderColor: "#D5E0D5",
    borderRadius: 2,
    backgroundColor: "#FAFAFA",
    padding: 4,
    marginBottom: 6,
    fontSize: 7,
  },
  amountWordsLabel: {
    fontWeight: "bold",
    color: "#145C32",
  },

  /* Terms & Signature */
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
    gap: 8,
  },
  termsBox: {
    width: "65%",
    borderWidth: 0.6,
    borderColor: "#D5E0D5",
    borderRadius: 2,
    padding: 5,
    fontSize: 6,
    lineHeight: 1.25,
    color: "#4B5563",
  },
  termsTitle: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#145C32",
    marginBottom: 2,
  },
  sigBox: {
    width: "33%",
    borderWidth: 0.6,
    borderColor: "#D5E0D5",
    borderRadius: 2,
    padding: 5,
    textAlign: "right",
    justifyContent: "space-between",
  },
  sigFor: {
    fontSize: 6,
    color: "#6B7280",
  },
  sigComp: {
    fontSize: 6.5,
    fontWeight: "bold",
    color: "#145C32",
  },
  sigLine: {
    borderBottomWidth: 0.5,
    borderBottomColor: "#172B2A",
    marginVertical: 4,
    width: "80%",
    alignSelf: "flex-end",
  },
  sigTitle: {
    fontSize: 6.5,
    fontWeight: "bold",
    textAlign: "center",
  },

  /* Footer */
  footer: {
    marginTop: "auto",
    paddingTop: 4,
    borderTopWidth: 0.8,
    borderTopColor: "#D5E0D5",
    textAlign: "center",
    fontSize: 6,
    color: "#6B7280",
  },
  footerBrand: {
    fontWeight: "bold",
    color: "#145C32",
    marginBottom: 1,
  },
});

interface InvoicePdfProps {
  model: InvoiceViewModel;
}

export function InvoicePdfDocument({ model }: InvoicePdfProps) {
  const isInterState = model.calculations.isInterState;

  return (
    <Document title={`Invoice-${model.invoiceNumber}`} author="AP Enerfy Solar">
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.brandName}>{model.company.name}</Text>
            <Text style={styles.tagline}>{model.company.tagline}</Text>
            <Text style={styles.legalName}>{model.company.legalName}</Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.registeredOfficeTitle}>Registered Office</Text>
            <Text>{model.company.address}</Text>
            <Text>
              {model.company.city}, {model.company.state} - {model.company.pincode}
            </Text>
            <Text>
              Phone: {model.company.phone} | Email: {model.company.email}
            </Text>
            <View style={styles.taxIdsRow}>
              <Text>
                <Text style={styles.taxIdLabel}>GSTIN: </Text>
                {model.company.gstin}
              </Text>
              <Text>
                <Text style={styles.taxIdLabel}>PAN: </Text>
                {model.company.pan}
              </Text>
            </View>
          </View>
        </View>

        {/* Title Bar */}
        <View style={styles.titleBar}>
          <Text style={styles.titleText}>{model.documentTitle}</Text>
        </View>

        {/* Details Section */}
        <View style={styles.detailsSection}>
          {/* Bill To */}
          <View style={styles.detailsBox}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>Bill To (Customer)</Text>
              <Text style={{ fontSize: 6.5, color: "#145C32" }}>ID: {model.customer.id}</Text>
            </View>
            <Text style={styles.customerName}>{model.customer.name}</Text>
            {model.customer.companyName && (
              <Text style={{ fontSize: 7, color: "#4B5563" }}>{model.customer.companyName}</Text>
            )}
            <Text style={{ fontSize: 7, color: "#374151" }}>{model.customer.address}</Text>
            <Text style={{ fontSize: 7, color: "#374151" }}>
              {model.customer.city}, {model.customer.state} {model.customer.pincode ? `- ${model.customer.pincode}` : ""}
            </Text>
            <Text style={{ fontSize: 6.5, marginTop: 3 }}>
              Mobile: {model.customer.phone} {model.customer.email ? `| Email: ${model.customer.email}` : ""}
            </Text>
            <Text style={{ fontSize: 6.5 }}>
              GSTIN: {model.customer.gstin || "Unregistered"} | State: {model.customer.state} ({model.customer.stateCode})
            </Text>
          </View>

          {/* Invoice Meta */}
          <View style={styles.detailsBox}>
            <View style={styles.boxHeader}>
              <Text style={styles.boxTitle}>Invoice Metadata</Text>
              <Text style={{ fontSize: 7.5, fontWeight: "bold", color: "#145C32" }}>
                {model.invoiceNumber}
              </Text>
            </View>
            <View style={styles.metaGrid}>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Invoice Date</Text>
                <Text style={styles.metaValue}>{model.invoiceDate}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Due Date</Text>
                <Text style={styles.metaValue}>{model.dueDate}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Place of Supply</Text>
                <Text style={styles.metaValue}>{model.placeOfSupply}</Text>
              </View>
              <View style={styles.metaCol}>
                <Text style={styles.metaLabel}>Reverse Charge</Text>
                <Text style={styles.metaValue}>{model.reverseCharge}</Text>
              </View>
              {model.projectRef && (
                <View style={styles.metaCol}>
                  <Text style={styles.metaLabel}>Project Ref</Text>
                  <Text style={styles.metaValue}>{model.projectRef}</Text>
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Item Table */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.thCol1}>#</Text>
            <Text style={styles.thCol2}>Description of Goods / Services</Text>
            <Text style={styles.thCol3}>HSN/SAC</Text>
            <Text style={styles.thCol4}>Qty</Text>
            <Text style={styles.thCol5}>Unit</Text>
            <Text style={styles.thCol6}>Rate (₹)</Text>
            <Text style={styles.thCol7}>Taxable (₹)</Text>
            <Text style={styles.thCol8}>Total (₹)</Text>
          </View>
          {model.items.map((item, idx) => (
            <View
              key={idx}
              style={[
                styles.tableRow,
                { backgroundColor: idx % 2 === 0 ? "#FFFFFF" : "#F9FAFB" },
              ]}
            >
              <Text style={styles.thCol1}>{item.slNo}</Text>
              <Text style={styles.thCol2}>{item.description}</Text>
              <Text style={styles.thCol3}>{item.hsnCode}</Text>
              <Text style={styles.thCol4}>{item.quantity}</Text>
              <Text style={styles.thCol5}>{item.unit}</Text>
              <Text style={styles.thCol6}>
                {item.unitPrice.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={styles.thCol7}>
                {item.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
              <Text style={[styles.thCol8, { fontWeight: "bold", color: "#145C32" }]}>
                {item.totalAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
              </Text>
            </View>
          ))}
        </View>

        {/* Solar System Details */}
        {model.systemDetails && (
          <View style={styles.systemBox}>
            <View style={styles.systemHeader}>
              <Text style={styles.systemTitle}>Solar System Specifications</Text>
              <Text style={{ fontSize: 7, fontWeight: "bold", color: "#145C32" }}>
                {model.systemDetails.systemType} Plant
              </Text>
            </View>
            <View style={styles.systemRow}>
              <View style={styles.systemCol}>
                <Text style={styles.metaLabel}>Capacity</Text>
                <Text style={{ fontSize: 8, fontWeight: "bold", color: "#145C32" }}>
                  {model.systemDetails.capacity}
                </Text>
              </View>
              <View style={styles.systemCol}>
                <Text style={styles.metaLabel}>PV Modules</Text>
                <Text style={{ fontSize: 7 }}>{model.systemDetails.panelCount || "Mono PERC"}</Text>
              </View>
              <View style={styles.systemCol}>
                <Text style={styles.metaLabel}>Inverter</Text>
                <Text style={{ fontSize: 7 }}>{model.systemDetails.inverterCapacity}</Text>
              </View>
              <View style={styles.systemCol}>
                <Text style={styles.metaLabel}>Est. Generation</Text>
                <Text style={{ fontSize: 7, color: "#559C32" }}>
                  {model.systemDetails.estimatedGeneration}
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* Middle Section: Tax & Bank vs Totals */}
        <View style={styles.middleSection}>
          <View style={styles.leftMiddle}>
            {/* Tax Breakdown */}
            <View style={styles.taxTable}>
              <View style={styles.taxHeader}>
                <Text style={{ width: "25%" }}>HSN/SAC</Text>
                <Text style={{ width: "25%", textAlign: "right" }}>Taxable (₹)</Text>
                <Text style={{ width: "25%", textAlign: "right" }}>
                  {isInterState ? "IGST (₹)" : "CGST+SGST (₹)"}
                </Text>
                <Text style={{ width: "25%", textAlign: "right" }}>Total Tax (₹)</Text>
              </View>
              {model.calculations.hsnSummary.map((hsn, idx) => (
                <View key={idx} style={styles.taxRow}>
                  <Text style={{ width: "25%" }}>{hsn.hsnCode}</Text>
                  <Text style={{ width: "25%", textAlign: "right" }}>
                    {hsn.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={{ width: "25%", textAlign: "right" }}>
                    {isInterState
                      ? hsn.igstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })
                      : (hsn.cgstAmount + hsn.sgstAmount).toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </Text>
                  <Text style={{ width: "25%", textAlign: "right", fontWeight: "bold" }}>
                    {hsn.totalTax.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              ))}
            </View>

            {/* Bank & QR */}
            <View style={styles.bankAndQr}>
              <View style={styles.bankInfo}>
                <Text style={styles.bankTitle}>Bank Details for Payment</Text>
                <Text>Bank: {model.bankDetails?.bankName}</Text>
                <Text>A/C Name: {model.bankDetails?.accountName}</Text>
                <Text style={{ fontWeight: "bold" }}>A/C No: {model.bankDetails?.accountNumber}</Text>
                <Text>IFSC: {model.bankDetails?.ifscCode}</Text>
                <Text>UPI ID: {model.bankDetails?.upiId}</Text>
              </View>
              {model.paymentQrCodeUrl && (
                <View style={styles.qrContainer}>
                  <Text style={{ fontSize: 6, fontWeight: "bold", color: "#145C32", marginBottom: 1 }}>
                    Scan & Pay
                  </Text>
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <Image src={model.paymentQrCodeUrl} style={styles.qrImage} />
                  <Text style={{ fontSize: 5.5, color: "#6B7280", marginTop: 1 }}>
                    UPI Payment
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* Totals */}
          <View style={styles.rightMiddle}>
            <View style={styles.totalsBox}>
              <Text style={styles.totalsHeader}>Financial Summary</Text>
              <View style={styles.totalsBody}>
                <View style={styles.totalsRow}>
                  <Text>Gross Total:</Text>
                  <Text>₹{model.calculations.grossAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text>Taxable Value:</Text>
                  <Text>₹{model.calculations.taxableAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                </View>
                {!isInterState ? (
                  <>
                    <View style={styles.totalsRow}>
                      <Text>CGST:</Text>
                      <Text>₹{model.calculations.cgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                    </View>
                    <View style={styles.totalsRow}>
                      <Text>SGST:</Text>
                      <Text>₹{model.calculations.sgstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                    </View>
                  </>
                ) : (
                  <View style={styles.totalsRow}>
                    <Text>IGST:</Text>
                    <Text>₹{model.calculations.igstAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                  </View>
                )}
                {model.calculations.roundOff !== 0 && (
                  <View style={styles.totalsRow}>
                    <Text>Round-off:</Text>
                    <Text>{model.calculations.roundOff > 0 ? `+${model.calculations.roundOff.toFixed(2)}` : model.calculations.roundOff.toFixed(2)}</Text>
                  </View>
                )}
                <View style={styles.grandTotalRow}>
                  <Text>Grand Total:</Text>
                  <Text>₹{model.calculations.grandTotal.toLocaleString("en-IN", { minimumFractionDigits: 2 })}</Text>
                </View>
                <View style={[styles.totalsRow, { marginTop: 2 }]}>
                  <Text>Amount Paid:</Text>
                  <Text style={{ color: "#16A34A", fontWeight: "bold" }}>
                    ₹{model.calculations.paidAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
                <View style={styles.totalsRow}>
                  <Text style={{ fontWeight: "bold" }}>Balance Due:</Text>
                  <Text style={{ fontWeight: "bold", color: model.calculations.balanceAmount > 0 ? "#B91C1C" : "#145C32" }}>
                    ₹{model.calculations.balanceAmount.toLocaleString("en-IN", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Amount in words */}
        <View style={styles.amountWordsBox}>
          <Text>
            <Text style={styles.amountWordsLabel}>Amount in Words: </Text>
            {model.calculations.amountInWords}
          </Text>
        </View>

        {/* Terms & Signature */}
        <View style={styles.bottomSection}>
          <View style={styles.termsBox}>
            <Text style={styles.termsTitle}>Terms & Conditions</Text>
            {model.termsAndConditions.map((t, idx) => (
              <Text key={idx}>{t}</Text>
            ))}
          </View>
          <View style={styles.sigBox}>
            <View>
              <Text style={styles.sigFor}>For and on behalf of</Text>
              <Text style={styles.sigComp}>{model.authorizedSignatory.companyName}</Text>
            </View>
            <View>
              <View style={styles.sigLine} />
              <Text style={styles.sigTitle}>{model.authorizedSignatory.designation}</Text>
            </View>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerBrand}>AP Enerfy Solar Pvt Ltd - Clean Energy. Smart Business.</Text>
          <Text>Computer-generated GST Tax Invoice compliant with GST Act, 2017.</Text>
        </View>
      </Page>
    </Document>
  );
}
