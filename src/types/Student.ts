export interface Student {
    id?: string;
    name: string;
    studentNumber: string;
    address: string;
    email: string;
    phoneNumber: string;
    emergencyContact: string;
    bankName: string;
    accountNumber: string;
    dateOfRegistration: Date;
    registrationDocumentPath?: string;
    invoices?: Invoice[]; // To be populated when fetching student with invoices
}

export interface Invoice {
    id?: string;
    studentId: string;
    date: Date;
    amountTotal: number;
    vat: number;
    description?: string;
    invoicePdfPath?: string;
}
