/**
 * MyFreeScoreNow API Integration
 * Complete API client for credit monitoring and enrollment
 * RJ Business Solutions - Rick Jefferson
 */

import axios, { AxiosInstance } from 'axios'

export interface MFSNConfig {
  email: string
  password: string
  baseUrl?: string
}

export interface MFSNTokenResponse {
  success: boolean
  data: {
    token: string
  }
}

export interface MFSN3BReportResponse {
  success: boolean
  data: {
    creditScores: {
      transUnion: number
      equifax: number
      experian: number
    }
    tradeLines: any[]
    inquiries: any[]
    publicRecords: any[]
    personalInfo: any
    summary: any
  }
}

export interface MFSNEnrollmentStartResponse {
  success: boolean
  data: {
    step: string
    'next-step': string
    message: string
    tracking_token: string
    customer_token: string
    id_questions: {
      referenceNumber: string
      question1: any
      question2: any
      question3: any
    }
  }
}

export interface MFSNEnrollmentIDVerificationResponse {
  success: boolean
  data: {
    currentstep: number
    nextstep: number
    idQuestions: any
    trackingToken: string
    customerToken: string
  }
}

export interface MFSNEnrollmentUpdateCardResponse {
  success: boolean
  data: {
    step: string
    'next-step': string
    message: string
    tracking_token: string
    customer_token: string
    password: string
    offers: {
      offer_days: number
      offer_price: string
      offer_has_fee: string
      hide_affiliates: number
      free_3: string
    }
    security_questions: Array<{
      updateDate: string
      securityQuestionId: number
      question: string
    }>
  }
}

export interface MFSNEnrollmentSecurityQuestionsResponse {
  success: boolean
  data: {
    step: string
    message: string
    username: string
    password: string
  }
}

export interface MFSNSnapshotEnrollmentResponse {
  status: string
  userId: string
  message: string
  smfaToken: string
  utoken: string
  dtoken: string
}

export interface MFSNSnapshotScoreResponse {
  success: string
  userId: string
  score: number
  asOfDate: string
  summary: {
    creditScore: {
      score: number
      provider: string
      scoreReasons: Array<{
        code: string
        description: string
        creditScoreFactorEffect: string
      }>
    }
    revolvingAccounts: any
    mortgageAccounts: any
    installmentAccounts: any
    totalOpenAccounts: any
    lengthOfCreditHistoryMonths: number
    totalNegativeAccounts: number
    averageAccountAgeMonths: number
    totalInquires: number
    totalPublicRecords: number
  }
}

export class MyFreeScoreNowClient {
  private api: AxiosInstance
  private token: string | null = null
  private config: MFSNConfig

  constructor(config: MFSNConfig) {
    this.config = {
      baseUrl: 'https://api.myfreescorenow.com/api',
      ...config,
    }

    this.api = axios.create({
      baseURL: this.config.baseUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * Authenticate and get JWT token
   */
  async login(): Promise<string> {
    try {
      const response = await this.api.post<MFSNTokenResponse>('/auth/login', {
        email: this.config.email,
        password: this.config.password,
      })

      if (response.data.success) {
        this.token = response.data.data.token
        this.api.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        return this.token
      }

      throw new Error('Login failed')
    } catch (error: any) {
      throw new Error(`MFSN Login Error: ${error.message}`)
    }
  }

  /**
   * Ensure authenticated
   */
  private async ensureAuthenticated(): Promise<void> {
    if (!this.token) {
      await this.login()
    }
  }

  /**
   * Get 3-Bureau Credit Report (JSON)
   */
  async get3BReportJSON(username: string, password: string): Promise<MFSN3BReportResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSN3BReportResponse>(
        '/auth/3B/report.json',
        { username, password }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get 3B Report Error: ${error.message}`)
    }
  }

  /**
   * Get 3-Bureau Credit Report (HTML)
   */
  async get3BReportHTML(username: string, password: string): Promise<string> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<string>(
        '/auth/3B/report.html',
        { username, password },
        { responseType: 'text' }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get 3B Report HTML Error: ${error.message}`)
    }
  }

  /**
   * Get Epic Pro Report (JSON)
   */
  async getEpicProReportJSON(username: string, password: string): Promise<MFSN3BReportResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSN3BReportResponse>(
        '/auth/v2/3B/epic/report.json',
        { username, password }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get Epic Pro Report Error: ${error.message}`)
    }
  }

  /**
   * Get Epic Pro Report (HTML)
   */
  async getEpicProReportHTML(username: string, password: string): Promise<string> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<string>(
        '/auth/v2/3B/epic/report.html',
        { username, password },
        { responseType: 'text' }
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get Epic Pro Report HTML Error: ${error.message}`)
    }
  }

  /**
   * Start Enrollment
   */
  async startEnrollment(data: {
    sponsorCode?: string
    aid: string
    firstName: string
    lastName: string
    email: string
    password: string
    mobile: string
    streetAddress: string
    zip: string
    city: string
    state: string
    ssn: string
    dob: string
    pid: string
    blackboxCode: string
  }): Promise<MFSNEnrollmentStartResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNEnrollmentStartResponse>(
        '/auth/enroll/start',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Start Enrollment Error: ${error.message}`)
    }
  }

  /**
   * ID Verification
   */
  async idVerification(data: {
    trackingToken: string
    customerToken: string
    referenceNumber: string
    answers: {
      answer1: string
      answer2: string
      answer3: string
    }
    userInput?: string
    blackboxCode: string
  }): Promise<MFSNEnrollmentIDVerificationResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNEnrollmentIDVerificationResponse>(
        '/auth/enroll/idverification',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`ID Verification Error: ${error.message}`)
    }
  }

  /**
   * Update Credit Card
   */
  async updateCard(data: {
    trackingToken: string
    customerToken: string
    creditCard: string
    name: string
    cvv: string
    cardMonth: string
    cardYear: string
    isConfirmedTerms: string
    billAddress: string
    billzip: string
    billcity: string
    billstate: string
  }): Promise<MFSNEnrollmentUpdateCardResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNEnrollmentUpdateCardResponse>(
        '/auth/enroll/updatecard',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Update Card Error: ${error.message}`)
    }
  }

  /**
   * Update Security Questions
   */
  async updateSecurityQuestions(data: {
    email: string
    password: string
    securityQuestionId: string
    securityQuestionAnswer: string
  }): Promise<MFSNEnrollmentSecurityQuestionsResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNEnrollmentSecurityQuestionsResponse>(
        '/auth/enroll/securityquestions',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Update Security Questions Error: ${error.message}`)
    }
  }

  /**
   * Start Snapshot Enrollment (Credit)
   */
  async startSnapshotCreditEnrollment(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    aid: string
    streetAddress1: string
    city: string
    state: string
    mobile: string
    dob: string
    ssn: string
    zip: string
    type: string
  }): Promise<MFSNSnapshotEnrollmentResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNSnapshotEnrollmentResponse>(
        '/auth/snapshot/credit/enroll',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Start Snapshot Credit Enrollment Error: ${error.message}`)
    }
  }

  /**
   * Start Snapshot Enrollment (Funding)
   */
  async startSnapshotFundingEnrollment(data: {
    firstName: string
    lastName: string
    email: string
    password: string
    aid: string
    streetAddress1: string
    city: string
    state: string
    mobile: string
    dob: string
    ssn: string
    zip: string
    type: string
  }): Promise<MFSNSnapshotEnrollmentResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNSnapshotEnrollmentResponse>(
        '/auth/snapshot/funding/enroll',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Start Snapshot Funding Enrollment Error: ${error.message}`)
    }
  }

  /**
   * Verify Snapshot Enrollment (Credit)
   */
  async verifySnapshotCreditEnrollment(data: {
    userId: string
    smfaToken: string
    utoken: string
    dtoken: string
  }): Promise<{ status: string; userId: string; message: string }> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post(
        '/auth/snapshot/credit/verify',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Verify Snapshot Credit Enrollment Error: ${error.message}`)
    }
  }

  /**
   * Verify Snapshot Enrollment (Funding)
   */
  async verifySnapshotFundingEnrollment(data: {
    userId: string
    smfaToken: string
    utoken: string
    dtoken: string
  }): Promise<{ status: string; userId: string; message: string }> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post(
        '/auth/snapshot/funding/verify',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Verify Snapshot Funding Enrollment Error: ${error.message}`)
    }
  }

  /**
   * Get Snapshot Score (Credit)
   */
  async getSnapshotCreditScore(data: {
    userId: string
    funding_partner_name?: string
  }): Promise<MFSNSnapshotScoreResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNSnapshotScoreResponse>(
        '/auth/snapshot/credit/score',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get Snapshot Credit Score Error: ${error.message}`)
    }
  }

  /**
   * Get Snapshot Score (Funding)
   */
  async getSnapshotFundingScore(data: {
    userId: string
    funding_partner_name?: string
  }): Promise<MFSNSnapshotScoreResponse> {
    await this.ensureAuthenticated()

    try {
      const response = await this.api.post<MFSNSnapshotScoreResponse>(
        '/auth/snapshot/funding/score',
        data
      )
      return response.data
    } catch (error: any) {
      throw new Error(`Get Snapshot Funding Score Error: ${error.message}`)
    }
  }

  /**
   * Logout
   */
  async logout(): Promise<void> {
    await this.ensureAuthenticated()

    try {
      await this.api.post('/auth/logout')
      this.token = null
      delete this.api.defaults.headers.common['Authorization']
    } catch (error: any) {
      throw new Error(`Logout Error: ${error.message}`)
    }
  }
}

// Export singleton instance
export const mfsnClient = new MyFreeScoreNowClient({
  email: process.env.MYFREESCORENOW_EMAIL || 'rickjefferson@rickjeffersonsolutions.com',
  password: process.env.MYFREESCORENOW_PASSWORD || '',
})
