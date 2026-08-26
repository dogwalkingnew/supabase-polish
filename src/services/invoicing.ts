/**
 * Service Facturation - Génération automatique de factures PDF
 */

import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface InvoiceData {
  id: string;
  invoiceNumber: string;
  date: Date;
  dueDate: Date;
  bookingId: string;
  
  // Informations du promeneur (prestataire)
  walkerName: string;
  walkerEmail: string;
  walkerPhone: string;
  walkerAddress: string;
  
  // Informations du Propriétaire (client)
  ownerName: string;
  ownerEmail: string;
  ownerAddress: string;
  
  // Détails de la mission
  missionDescription: string;
  missionDate: Date;
  duration: number; // en heures
  
  // Montants
  hourlyRate: number;
  subtotal: number;
  taxRate: number; // en pourcentage
  tax: number;
  total: number;
  
  // Statut
  status: 'draft' | 'sent' | 'paid' | 'overdue';
  notes?: string;
}

/**
 * Générer une facture PDF
 */
export async function generateInvoicePDF(invoice: InvoiceData): Promise<Blob> {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 15;
  let yPosition = margin;

  // En-tête
  doc.setFontSize(20);
  doc.text('FACTURE', margin, yPosition);
  
  yPosition += 10;
  doc.setFontSize(10);
  doc.text(`Numéro: ${invoice.invoiceNumber}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Date: ${invoice.date.toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 5;
  doc.text(`Statut: ${invoice.status.toUpperCase()}`, margin, yPosition);

  // Informations du promeneur (À gauche)
  yPosition += 10;
  doc.setFontSize(11);
  doc.text('Accompagnateur Certifié (Prestataire):', margin, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(invoice.walkerName, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerEmail, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerPhone, margin, yPosition);
  yPosition += 4;
  doc.text(invoice.walkerAddress, margin, yPosition);

  // Informations du Propriétaire (À droite)
  const rightColumnX = pageWidth / 2 + margin;
  yPosition = margin + 10;
  doc.setFontSize(11);
  doc.text('Propriétaire (Client):', rightColumnX, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(invoice.ownerName, rightColumnX, yPosition);
  yPosition += 4;
  doc.text(invoice.ownerEmail, rightColumnX, yPosition);
  yPosition += 4;
  doc.text(invoice.ownerAddress, rightColumnX, yPosition);

  // Détails de la mission
  yPosition = margin + 45;
  doc.setFontSize(11);
  doc.text('Détails de la mission:', margin, yPosition);
  yPosition += 5;
  doc.setFontSize(9);
  doc.text(`Description: ${invoice.missionDescription}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Date: ${invoice.missionDate.toLocaleDateString('fr-FR')}`, margin, yPosition);
  yPosition += 4;
  doc.text(`Durée: ${invoice.duration} heure(s)`, margin, yPosition);

  // Tableau des montants
  yPosition += 10;
  const tableData = [
    ['Description', 'Quantité', 'Tarif unitaire', 'Montant'],
    [
      invoice.missionDescription,
      `${invoice.duration}h`,
      `${invoice.hourlyRate.toFixed(2)}€`,
      `${invoice.subtotal.toFixed(2)}€`,
    ],
    ['', '', 'Sous-total:', `${invoice.subtotal.toFixed(2)}€`],
    ['', '', `TVA (${invoice.taxRate}%):`, `${invoice.tax.toFixed(2)}€`],
    ['', '', 'TOTAL:', `${invoice.total.toFixed(2)}€`],
  ];

  autoTable(doc, {
    startY: yPosition,
    head: [tableData[0]],
    body: tableData.slice(1),
    margin: margin,
    styles: {
      fontSize: 9,
      cellPadding: 3,
    },
    headStyles: {
      fillColor: [66, 139, 202],
      textColor: 255,
      fontStyle: 'bold',
    },
    alternateRowStyles: {
      fillColor: [240, 240, 240],
    },
  });

  // Notes
  if (invoice.notes) {
    yPosition = (doc as any).lastAutoTable.finalY + 10;
    doc.setFontSize(9);
    doc.text('Notes:', margin, yPosition);
    yPosition += 4;
    doc.setFontSize(8);
    doc.text(invoice.notes, margin, yPosition, { maxWidth: pageWidth - 2 * margin });
  }

  // Pied de page
  doc.setFontSize(8);
  doc.text(
    `Facture générée le ${new Date().toLocaleDateString('fr-FR')} - DogWalking`,
    margin,
    pageHeight - 10
  );

  return doc.output('blob');
}

/**
 * Télécharger une facture PDF
 */
export async function downloadInvoice(invoice: InvoiceData): Promise<void> {
  const blob = await generateInvoicePDF(invoice);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `facture-${invoice.invoiceNumber}.pdf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
}

/**
 * Construire un objet InvoiceData à partir d'un booking complet
 * (jointures dogs + walker_profile attendues côté appelant)
 */
export function buildInvoiceFromBooking(booking: any): InvoiceData {
  const total = Number(booking.total_price || booking.price || 0);
  const walkerAmount = Number(booking.walker_amount || total * 0.87);
  const platformFee = Number(booking.platform_fee_amount || total * 0.18);
  const durationH = (Number(booking.duration_minutes) || 60) / 60;
  const hourlyRate = durationH > 0 ? total / durationH : total;

  return {
    id: booking.id,
    invoiceNumber: `FAC-${String(booking.id).slice(0, 8).toUpperCase()}`,
    date: new Date(booking.funds_released_at || booking.updated_at || Date.now()),
    dueDate: new Date(),
    bookingId: booking.id,
    walkerName: booking.walker?.full_name || 'Accompagnateur',
    walkerEmail: booking.walker?.email || '',
    walkerPhone: booking.walker?.phone || '',
    walkerAddress: booking.walker?.address || '',
    ownerName: booking.owner?.full_name || 'Client',
    ownerEmail: booking.owner?.email || '',
    ownerAddress: booking.address || '',
    missionDescription: `${booking.service_type || 'Prestation'} — ${booking.dogs?.name || 'Animal'}`,
    missionDate: new Date(booking.scheduled_date),
    duration: durationH,
    hourlyRate,
    subtotal: walkerAmount,
    taxRate: 0,
    tax: 0,
    total,
    status: booking.payment_status === 'released' ? 'paid' : 'sent',
    notes: `Commission plateforme : ${platformFee.toFixed(2)}€ (18% brut) — Reversé à l'accompagnateur : ${walkerAmount.toFixed(2)}€ (87%)`,
  };
}

/**
 * Générer un numéro de facture unique
 */
export function generateInvoiceNumber(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const random = Math.floor(Math.random() * 10000).toString().padStart(5, '0');
  
  return `FAC-${year}${month}${day}-${random}`;
}

/**
 * Calculer les montants de la facture
 */
export function calculateInvoiceAmounts(
  hourlyRate: number,
  duration: number,
  taxRate: number = 20
): { subtotal: number; tax: number; total: number } {
  const subtotal = hourlyRate * duration;
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;

  return { subtotal, tax, total };
}

export default {
  generateInvoicePDF,
  downloadInvoice,
  buildInvoiceFromBooking,
  generateInvoiceNumber,
  calculateInvoiceAmounts,
};
