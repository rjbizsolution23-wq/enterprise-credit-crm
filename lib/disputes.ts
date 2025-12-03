/**
 * Automated Dispute Generation Module
 * FCRA 609/611, Metro 2, CFPB Complaint generation
 * RJ Business Solutions - Rick Jefferson
 */

import { Metro2Generator } from './metro2'

export interface DisputeReason {
  code: string
  description: string
  fcraSection?: string
  legalBasis: string
}

export const DISPUTE_REASONS: DisputeReason[] = [
  {
    code: 'NOT_MINE',
    description: 'This account does not belong to me',
    fcraSection: '609',
    legalBasis: 'FCRA Section 609 requires verification of account ownership',
  },
  {
    code: 'PAID_IN_FULL',
    description: 'Account was paid in full',
    fcraSection: '611',
    legalBasis: 'FCRA Section 611 requires accurate reporting of account status',
  },
  {
    code: 'INCORRECT_BALANCE',
    description: 'Balance is incorrect',
    fcraSection: '611',
    legalBasis: 'FCRA Section 611 requires accurate reporting of account balances',
  },
  {
    code: 'INCORRECT_DATE',
    description: 'Date opened/reported is incorrect',
    fcraSection: '611',
    legalBasis: 'FCRA Section 611 requires accurate reporting of dates',
  },
  {
    code: 'DUPLICATE',
    description: 'Duplicate account reporting',
    fcraSection: '611',
    legalBasis: 'FCRA Section 611 prohibits duplicate reporting',
  },
  {
    code: 'STATUS_ERROR',
    description: 'Account status is incorrect',
    fcraSection: '611',
    legalBasis: 'FCRA Section 611 requires accurate account status reporting',
  },
  {
    code: 'VERIFICATION_REQUIRED',
    description: 'Request for verification of account details',
    fcraSection: '609',
    legalBasis: 'FCRA Section 609 requires furnishers to verify disputed information',
  },
]

export class DisputeGenerator {
  /**
   * Generate FCRA 609 dispute letter
   */
  static generateFCRA609(client: {
    firstName: string
    lastName: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
    ssn?: string
  }, items: Array<{
    creditor: string
    accountNumber?: string
    reason: string
    description: string
  }>, bureau: 'TRANSUNION' | 'EQUIFAX' | 'EXPERIAN'): string {
    const bureauAddress = this.getBureauAddress(bureau)

    return `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${bureauAddress.name}
${bureauAddress.address}
${bureauAddress.city}, ${bureauAddress.state} ${bureauAddress.zip}

RE: Dispute Under FCRA Section 609

Dear ${bureau} Credit Bureau:

I am writing to dispute the following inaccurate information on my credit report under the Fair Credit Reporting Act (FCRA) Section 609.

My Information:
Name: ${client.firstName} ${client.lastName}
Address: ${client.address.street}, ${client.address.city}, ${client.address.state} ${client.zip}
${client.ssn ? `SSN: XXX-XX-${client.ssn.slice(-4)}` : ''}

Disputed Items:

${items.map((item, index) => `
${index + 1}. Creditor: ${item.creditor}
   Account Number: ${item.accountNumber || 'N/A'}
   Reason for Dispute: ${item.reason}
   Details: ${item.description}

   I request that you investigate this item and provide verification of its accuracy as required by FCRA Section 609.
`).join('\n')}

Under FCRA Section 609, you are required to:
1. Verify the accuracy of the disputed information
2. Provide me with the results of your investigation
3. Remove or correct any inaccurate information

I expect a response within 30 days as required by law.

Sincerely,
${client.firstName} ${client.lastName}

Enclosures:
- Copy of credit report
- Proof of identity
- Supporting documentation`
  }

  /**
   * Generate FCRA 611 dispute letter
   */
  static generateFCRA611(client: {
    firstName: string
    lastName: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
    ssn?: string
  }, items: Array<{
    creditor: string
    accountNumber?: string
    reason: string
    description: string
    evidence?: string[]
  }>, creditor: string): string {
    return `Date: ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}

${creditor}
[Creditor Address]

RE: Dispute Under FCRA Section 611 - Request for Investigation

Dear ${creditor}:

I am writing to dispute inaccurate information you are reporting to the credit bureaus under the Fair Credit Reporting Act (FCRA) Section 611.

My Information:
Name: ${client.firstName} ${client.lastName}
Address: ${client.address.street}, ${client.address.city}, ${client.address.state} ${client.zip}
${client.ssn ? `SSN: XXX-XX-${client.ssn.slice(-4)}` : ''}

Disputed Items:

${items.map((item, index) => `
${index + 1}. Account Number: ${item.accountNumber || 'N/A'}
   Reason for Dispute: ${item.reason}
   Details: ${item.description}
   ${item.evidence && item.evidence.length > 0 ? `Supporting Evidence: ${item.evidence.join(', ')}` : ''}
`).join('\n')}

Under FCRA Section 611, you are required to:
1. Conduct a reasonable investigation of the disputed information
2. Review all relevant information provided
3. Report the results to the credit bureaus
4. Correct or delete any inaccurate information

I expect this matter to be resolved within 30 days as required by law.

Sincerely,
${client.firstName} ${client.lastName}

Enclosures:
${items.flatMap(item => item.evidence || []).map(ev => `- ${ev}`).join('\n')}`
  }

  /**
   * Generate Metro 2 compliant dispute file
   */
  static generateMetro2Dispute(client: {
    firstName: string
    lastName: string
    middleName?: string
    ssn: string
    dateOfBirth: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
    phone?: string
  }, tradelines: Array<{
    accountNumber: string
    accountType: string
    dateOpened: string
    creditLimit?: number
    currentBalance?: number
    accountStatus: string
    paymentRating: string
  }>): string {
    const records = tradelines.map(tl => ({
      ecoaCode: '1',
      consumerAccountNumber: tl.accountNumber,
      portfolioType: '1',
      accountType: tl.accountType,
      dateOpened: tl.dateOpened,
      creditLimit: tl.creditLimit?.toString() || '0',
      highestCredit: tl.creditLimit?.toString() || '0',
      scheduledMonthlyPayment: '0',
      actualPaymentAmount: '0',
      accountStatus: tl.accountStatus,
      paymentRating: tl.paymentRating,
      paymentHistoryProfile: '',
      specialComment: 'DF', // Delete Flag
      complianceConditionCode: 'DF',
      currentBalance: tl.currentBalance?.toString() || '0',
      amountPastDue: '0',
      originalChargeOffAmount: '0',
      dateAccountStatus: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      dateFirstDelinquency: '',
      dateClosed: '',
      dateLastPayment: '',
      interestRateIndicator: ' ',
      interestRate: '000',
      fixedPaymentProgram: ' ',
      dateReported: new Date().toISOString().slice(0, 10).replace(/-/g, ''),
      dateOfLastActivity: '',
      consumerTransactionType: '1',
      surname: client.lastName,
      firstName: client.firstName,
      middleName: client.middleName || '',
      generationCode: '',
      socialSecurityNumber: client.ssn.replace(/-/g, ''),
      dateOfBirth: client.dateOfBirth.replace(/-/g, ''),
      telephoneNumber: client.phone?.replace(/\D/g, '').slice(-10) || '',
      ecOA: '1',
      consumerInformationIndicator: 'Y',
      countryCode: 'US',
      firstLineAddress: client.address.street,
      secondLineAddress: '',
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zip.replace(/-/g, ''),
      addressIndicator: 'Y',
      residenceCode: '1',
    }))

    return Metro2Generator.generateFile(records)
  }

  /**
   * Generate CFPB complaint
   */
  static generateCFPBComplaint(client: {
    firstName: string
    lastName: string
    email: string
    phone: string
    address: {
      street: string
      city: string
      state: string
      zip: string
    }
  }, issue: {
    company: string
    description: string
    attempts: string[]
    impact: string
  }): object {
    return {
      complaint: {
        product: 'Credit reporting',
        subproduct: 'Credit reporting',
        issue: 'Incorrect information on your report',
        subissue: 'Account status',
        consumerConsentProvided: true,
        narrative: `I have been attempting to dispute inaccurate information on my credit report with ${issue.company}.

${issue.description}

Previous Attempts:
${issue.attempts.map((attempt, i) => `${i + 1}. ${attempt}`).join('\n')}

Impact: ${issue.impact}

I request that the CFPB investigate this matter and ensure compliance with FCRA regulations.`,
        consumer: {
          name: `${client.firstName} ${client.lastName}`,
          address: {
            street: client.address.street,
            city: client.address.city,
            state: client.address.state,
            zip: client.address.zip,
          },
          email: client.email,
          phone: client.phone,
        },
        company: {
          name: issue.company,
        },
      },
    }
  }

  private static getBureauAddress(bureau: string): {
    name: string
    address: string
    city: string
    state: string
    zip: string
  } {
    const addresses: Record<string, any> = {
      TRANSUNION: {
        name: 'TransUnion LLC',
        address: 'P.O. Box 2000',
        city: 'Chester',
        state: 'PA',
        zip: '19016-2000',
      },
      EQUIFAX: {
        name: 'Equifax Information Services LLC',
        address: 'P.O. Box 740256',
        city: 'Atlanta',
        state: 'GA',
        zip: '30374-0256',
      },
      EXPERIAN: {
        name: 'Experian',
        address: 'P.O. Box 4500',
        city: 'Allen',
        state: 'TX',
        zip: '75013',
      },
    }

    return addresses[bureau] || addresses.TRANSUNION
  }
}
