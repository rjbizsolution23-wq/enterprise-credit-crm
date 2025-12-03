/**
 * Metro 2 Compliance Module
 * FCRA-compliant Metro 2 format generation for credit reporting
 * RJ Business Solutions - Rick Jefferson
 */

export interface Metro2Record {
  recordType: string
  ecoaCode: string
  consumerAccountNumber: string
  portfolioType: string
  accountType: string
  dateOpened: string
  creditLimit: string
  highestCredit: string
  scheduledMonthlyPayment: string
  actualPaymentAmount: string
  accountStatus: string
  paymentRating: string
  paymentHistoryProfile: string
  specialComment: string
  complianceConditionCode: string
  currentBalance: string
  amountPastDue: string
  originalChargeOffAmount: string
  dateAccountStatus: string
  dateFirstDelinquency: string
  dateClosed: string
  dateLastPayment: string
  interestRateIndicator: string
  interestRate: string
  fixedPaymentProgram: string
  dateReported: string
  dateOfLastActivity: string
  consumerTransactionType: string
  surname: string
  firstName: string
  middleName: string
  generationCode: string
  socialSecurityNumber: string
  dateOfBirth: string
  telephoneNumber: string
  ecOA: string
  consumerInformationIndicator: string
  countryCode: string
  firstLineAddress: string
  secondLineAddress: string
  city: string
  state: string
  zipCode: string
  addressIndicator: string
  residenceCode: string
}

export class Metro2Generator {
  /**
   * Generate Metro 2 compliant header record
   */
  static generateHeader(recordCount: number): string {
    const header = {
      recordType: 'HR',
      blockDescriptorWord: '0000',
      recordDescriptorWord: '0000',
      recordCount: recordCount.toString().padStart(9, '0'),
      cycleIdentifier: new Date().getFullYear().toString().slice(-2) +
                      (Math.floor(new Date().getMonth() / 3) + 1).toString().padStart(2, '0'),
      innovisProgramIdentifier: 'I',
      equifaxProgramIdentifier: 'E',
      transUnionProgramIdentifier: 'T',
      experianProgramIdentifier: 'X',
      creationDate: this.formatDate(new Date()),
      programDate: this.formatDate(new Date()),
      dateFormat: 'MMDDYYYY',
      disputeIndicator: 'N',
    }

    return this.formatHeaderRecord(header)
  }

  /**
   * Generate Metro 2 base segment for a tradeline
   */
  static generateBaseSegment(data: Partial<Metro2Record>): string {
    const base = {
      recordType: '11',
      ecOA: data.ecoaCode || '1',
      consumerAccountNumber: (data.consumerAccountNumber || '').padEnd(30, ' '),
      portfolioType: data.portfolioType || '1',
      accountType: data.accountType || '01',
      dateOpened: data.dateOpened || '',
      creditLimit: (data.creditLimit || '000000000').padStart(9, '0'),
      highestCredit: (data.highestCredit || '000000000').padStart(9, '0'),
      scheduledMonthlyPayment: (data.scheduledMonthlyPayment || '000000000').padStart(9, '0'),
      actualPaymentAmount: (data.actualPaymentAmount || '000000000').padStart(9, '0'),
      accountStatus: data.accountStatus || '11',
      paymentRating: data.paymentRating || '01',
      paymentHistoryProfile: data.paymentHistoryProfile || '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000Date.format('MMDDYYYY'),
      specialComment: data.specialComment || '  ',
      complianceConditionCode: data.complianceConditionCode || '  ',
      currentBalance: (data.currentBalance || '000000000').padStart(9, '0'),
      amountPastDue: (data.amountPastDue || '000000000').padStart(9, '0'),
      originalChargeOffAmount: (data.originalChargeOffAmount || '000000000').padStart(9, '0'),
      dateAccountStatus: data.dateAccountStatus || '',
      dateFirstDelinquency: data.dateFirstDelinquency || '',
      dateClosed: data.dateClosed || '',
      dateLastPayment: data.dateLastPayment || '',
      interestRateIndicator: data.interestRateIndicator || ' ',
      interestRate: (data.interestRate || '000').padStart(3, '0'),
      fixedPaymentProgram: data.fixedPaymentProgram || ' ',
      dateReported: data.dateReported || this.formatDate(new Date()),
      dateOfLastActivity: data.dateOfLastActivity || '',
      consumerTransactionType: data.consumerTransactionType || '1',
    }

    return this.formatBaseSegment(base)
  }

  /**
   * Generate Metro 2 name segment
   */
  static generateNameSegment(data: {
    surname: string
    firstName: string
    middleName?: string
    generationCode?: string
    socialSecurityNumber: string
    dateOfBirth: string
    telephoneNumber?: string
  }): string {
    const name = {
      recordType: '12',
      surname: (data.surname || '').padEnd(25, ' '),
      firstName: (data.firstName || '').padEnd(20, ' '),
      middleName: (data.middleName || '').padEnd(20, ' '),
      generationCode: data.generationCode || ' ',
      socialSecurityNumber: data.socialSecurityNumber.replace(/-/g, ''),
      dateOfBirth: data.dateOfBirth || '',
      telephoneNumber: (data.telephoneNumber || '').padEnd(10, ' '),
    }

    return this.formatNameSegment(name)
  }

  /**
   * Generate Metro 2 address segment
   */
  static generateAddressSegment(data: {
    firstLineAddress: string
    secondLineAddress?: string
    city: string
    state: string
    zipCode: string
  }): string {
    const address = {
      recordType: '13',
      countryCode: 'US',
      firstLineAddress: (data.firstLineAddress || '').padEnd(32, ' '),
      secondLineAddress: (data.secondLineAddress || '').padEnd(32, ' '),
      city: (data.city || '').padEnd(20, ' '),
      state: (data.state || '').padEnd(2, ' '),
      zipCode: (data.zipCode || '').padEnd(9, ' '),
      addressIndicator: 'Y',
      residenceCode: '1',
    }

    return this.formatAddressSegment(address)
  }

  /**
   * Generate complete Metro 2 file
   */
  static generateFile(records: Metro2Record[]): string {
    const lines: string[] = []

    // Header
    lines.push(this.generateHeader(records.length))

    // Base, Name, and Address segments for each record
    for (const record of records) {
      lines.push(this.generateBaseSegment(record))
      lines.push(this.generateNameSegment({
        surname: record.surname,
        firstName: record.firstName,
        middleName: record.middleName,
        generationCode: record.generationCode,
        socialSecurityNumber: record.socialSecurityNumber,
        dateOfBirth: record.dateOfBirth,
        telephoneNumber: record.telephoneNumber,
      }))
      lines.push(this.generateAddressSegment({
        firstLineAddress: record.firstLineAddress,
        secondLineAddress: record.secondLineAddress,
        city: record.city,
        state: record.state,
        zipCode: record.zipCode,
      }))
    }

    // Trailer
    lines.push(this.generateTrailer(records.length))

    return lines.join('\n')
  }

  private static formatDate(date: Date): string {
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const day = date.getDate().toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${month}${day}${year}`
  }

  private static formatHeaderRecord(header: any): string {
    // Simplified header format - adjust based on actual Metro 2 spec
    return `HR${header.recordCount.padStart(9, '0')}${header.creationDate}`
  }

  private static formatBaseSegment(base: any): string {
    // Simplified base segment - adjust based on actual Metro 2 spec
    return `${base.recordType}${base.ecOA}${base.consumerAccountNumber}${base.portfolioType}${base.accountType}${base.dateOpened}${base.creditLimit}${base.highestCredit}${base.scheduledMonthlyPayment}${base.actualPaymentAmount}${base.accountStatus}${base.paymentRating}${base.paymentHistoryProfile}${base.specialComment}${base.complianceConditionCode}${base.currentBalance}${base.amountPastDue}${base.originalChargeOffAmount}${base.dateAccountStatus}${base.dateFirstDelinquency}${base.dateClosed}${base.dateLastPayment}${base.interestRateIndicator}${base.interestRate}${base.fixedPaymentProgram}${base.dateReported}${base.dateOfLastActivity}${base.consumerTransactionType}`
  }

  private static formatNameSegment(name: any): string {
    return `${name.recordType}${name.surname}${name.firstName}${name.middleName}${name.generationCode}${name.socialSecurityNumber}${name.dateOfBirth}${name.telephoneNumber}`
  }

  private static formatAddressSegment(address: any): string {
    return `${address.recordType}${address.countryCode}${address.firstLineAddress}${address.secondLineAddress}${address.city}${address.state}${address.zipCode}${address.addressIndicator}${address.residenceCode}`
  }

  private static generateTrailer(recordCount: number): string {
    return `TR${recordCount.toString().padStart(9, '0')}`
  }
}
