import { Currency } from "../../expense/enums/currency.enum";

export class CurrencyConfig {
  private static readonly map = {
    [Currency.BRL]: { decimals: 2 },
    // [Currency.USD]: { decimals: 2 },
    // [Currency.EUR]: { decimals: 2 },
    // [Currency.BTC]: { decimals: 8 },
  } as const;

  private static decimals(currency: Currency): number {
    return this.map[currency].decimals;
  }

  private static factor(currency: Currency): number {
    return 10 ** this.decimals(currency);
  }

  /** Converts value "major" (e.g., 10.50 BRL) to "minor" (e.g., 1050) */
  public static toMinorUnits(amount: number, currency: Currency): number {
    if (!Number.isFinite(amount)) {
      throw new Error('Invalid amount');
    }

    const factor = this.factor(currency);
    return Math.round(amount * factor);
  }

  /** Converts "minor" (e.g., 1050) to "major" (e.g., 10.5) */
  public static fromMinorUnits(minor: number, currency: Currency): number {
    if (!Number.isInteger(minor)) {
      throw new Error('Invalid minor units');
    }
    const factor = this.factor(currency);
    return minor / factor;
  }
}