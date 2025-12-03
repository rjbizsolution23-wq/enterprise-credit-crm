/**
 * Open Source Tools & Libraries
 * Community-driven enhancements for the CRM
 * RJ Business Solutions - Rick Jefferson
 */

// Credit Score Calculator
export class CreditScoreCalculator {
  /**
   * Calculate estimated credit score improvement
   */
  static calculateImprovement(currentScore: number, factors: {
    utilizationRatio: number
    paymentHistory: number
    creditAge: number
    creditMix: number
    inquiries: number
  }): number {
    let improvement = 0

    // Utilization impact (30% of score)
    if (factors.utilizationRatio > 30) {
      improvement += Math.min(50, (factors.utilizationRatio - 30) * 2)
    }

    // Payment history impact (35% of score)
    if (factors.paymentHistory < 100) {
      improvement += (100 - factors.paymentHistory) * 0.5
    }

    // Credit age impact (15% of score)
    if (factors.creditAge < 84) {
      improvement += Math.min(20, (84 - factors.creditAge) * 0.3)
    }

    // Credit mix impact (10% of score)
    if (factors.creditMix < 3) {
      improvement += (3 - factors.creditMix) * 5
    }

    // Inquiries impact (10% of score)
    if (factors.inquiries > 2) {
      improvement += Math.min(10, (factors.inquiries - 2) * 2)
    }

    return Math.round(improvement)
  }
}

// Credit Report Parser
export class CreditReportParser {
  /**
   * Parse credit report JSON into structured format
   */
  static parseReport(reportData: any): {
    scores: {
      transUnion: number | null
      equifax: number | null
      experian: number | null
    }
    tradelines: any[]
    negativeItems: any[]
    inquiries: any[]
    publicRecords: any[]
  } {
    return {
      scores: {
        transUnion: reportData.transUnion?.score || null,
        equifax: reportData.equifax?.score || null,
        experian: reportData.experian?.score || null,
      },
      tradelines: reportData.tradelines || [],
      negativeItems: reportData.negativeItems || [],
      inquiries: reportData.inquiries || [],
      publicRecords: reportData.publicRecords || [],
    }
  }
}

// Dispute Success Predictor
export class DisputeSuccessPredictor {
  /**
   * Predict likelihood of dispute success
   */
  static predictSuccess(disputeData: {
    itemType: string
    age: number
    balance: number
    creditor: string
    evidence: boolean
  }): number {
    let score = 50 // Base score

    // Item type impact
    const typeScores: Record<string, number> = {
      COLLECTION: 70,
      CHARGE_OFF: 60,
      LATE_PAYMENT: 80,
      FORECLOSURE: 40,
      BANKRUPTCY: 30,
      TAX_LIEN: 50,
      JUDGMENT: 45,
    }
    score += (typeScores[disputeData.itemType] || 50) - 50

    // Age impact (older = better)
    if (disputeData.age > 7) score += 20
    else if (disputeData.age > 4) score += 10
    else if (disputeData.age < 2) score -= 10

    // Balance impact (lower = better)
    if (disputeData.balance < 100) score += 15
    else if (disputeData.balance > 10000) score -= 10

    // Evidence impact
    if (disputeData.evidence) score += 15

    return Math.max(0, Math.min(100, score))
  }
}

// Client Engagement Scorer
export class ClientEngagementScorer {
  /**
   * Calculate client engagement score
   */
  static calculateEngagement(metrics: {
    loginFrequency: number
    responseTime: number
    taskCompletion: number
    communicationCount: number
    scoreImprovement: number
  }): number {
    let score = 0

    // Login frequency (0-25 points)
    score += Math.min(25, metrics.loginFrequency * 5)

    // Response time (0-20 points)
    if (metrics.responseTime < 24) score += 20
    else if (metrics.responseTime < 48) score += 15
    else if (metrics.responseTime < 72) score += 10

    // Task completion (0-25 points)
    score += metrics.taskCompletion * 0.25

    // Communication count (0-15 points)
    score += Math.min(15, metrics.communicationCount * 2)

    // Score improvement (0-15 points)
    if (metrics.scoreImprovement > 50) score += 15
    else if (metrics.scoreImprovement > 25) score += 10
    else if (metrics.scoreImprovement > 0) score += 5

    return Math.max(0, Math.min(100, Math.round(score)))
  }
}

// Churn Risk Calculator
export class ChurnRiskCalculator {
  /**
   * Calculate churn risk probability
   */
  static calculateRisk(factors: {
    daysSinceLastLogin: number
    paymentStatus: string
    engagementScore: number
    scoreImprovement: number
    monthsActive: number
  }): number {
    let risk = 0

    // Days since last login
    if (factors.daysSinceLastLogin > 30) risk += 40
    else if (factors.daysSinceLastLogin > 14) risk += 20
    else if (factors.daysSinceLastLogin > 7) risk += 10

    // Payment status
    if (factors.paymentStatus === 'COLLECTIONS') risk += 30
    else if (factors.paymentStatus === 'PAST_DUE_16_30') risk += 25
    else if (factors.paymentStatus === 'PAST_DUE_1_15') risk += 15

    // Engagement score (inverse)
    risk += (100 - factors.engagementScore) * 0.2

    // Score improvement (inverse)
    if (factors.scoreImprovement < 0) risk += 20
    else if (factors.scoreImprovement === 0) risk += 10

    // Months active (newer clients = higher risk)
    if (factors.monthsActive < 3) risk += 15
    else if (factors.monthsActive < 6) risk += 10

    return Math.max(0, Math.min(100, Math.round(risk)))
  }
}

// Revenue Calculator
export class RevenueCalculator {
  /**
   * Calculate projected revenue
   */
  static calculateProjected(clientCount: number, averageMonthlyFee: number, churnRate: number): {
    monthly: number
    annual: number
    lifetimeValue: number
  } {
    const monthly = clientCount * averageMonthlyFee
    const annual = monthly * 12
    const averageLifespan = 1 / churnRate // in months
    const lifetimeValue = averageMonthlyFee * averageLifespan

    return {
      monthly: Math.round(monthly * 100) / 100,
      annual: Math.round(annual * 100) / 100,
      lifetimeValue: Math.round(lifetimeValue * 100) / 100,
    }
  }
}

