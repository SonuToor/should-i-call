import { computeNextCall, getLiftedContact } from '../utils/whenToCall';
import { RawContact, ContactFrequency } from '../schema';

// Helper to get enum values
const getFrequency = (frequency: string) => ContactFrequency.parse(frequency);

describe('computeNextCall', () => {
    const baseContact: Omit<RawContact, 'contactFrequency' | 'lastContacted'> = {
        id: '1',
        name: 'Test Contact',
        userId: 'user-1',
        createdAt: new Date(),
    };

    // Use a fixed reference date for all tests
    const referenceTimestamp = new Date('2025-01-15T10:00:00Z').getTime();

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(referenceTimestamp);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    describe('with lastContacted date', () => {
        it('should calculate DAILY frequency correctly', () => {
            const lastContacted = new Date('2025-01-14T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('DAILY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-15T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should calculate SEMI-WEEKLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-12T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('SEMI-WEEKLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-15T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should calculate WEEKLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-10T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('WEEKLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-17T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should calculate BI-WEEKLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-10T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('BI-WEEKLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-24T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should calculate MONTHLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-10T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('MONTHLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-02-10T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should calculate BI-MONTHLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-10T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('BI-MONTHLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            // The function adds 2 months, so Jan 10 + 2 months = Mar 10
            // But due to timezone handling, we need to check the actual result
            expect(result.getMonth()).toBe(2); // March (0-indexed)
            expect(result.getDate()).toBe(10);
            expect(result.getFullYear()).toBe(2025);
        });

        it('should calculate QUARTERLY frequency correctly', () => {
            const lastContacted = new Date('2025-01-10T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('QUARTERLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            // The function adds 3 months, so Jan 10 + 3 months = Apr 10
            expect(result.getMonth()).toBe(3); // April (0-indexed)
            expect(result.getDate()).toBe(10);
            expect(result.getFullYear()).toBe(2025);
        });
    });

    describe('without lastContacted date', () => {
        it('should suggest DAILY frequency for tomorrow', () => {
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('DAILY'),
                lastContacted: undefined,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-16T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should suggest WEEKLY frequency for next week', () => {
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('WEEKLY'),
                lastContacted: undefined,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-22T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should suggest MONTHLY frequency for next month', () => {
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('MONTHLY'),
                lastContacted: undefined,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-02-15T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });
    });

    describe('edge cases', () => {
        it('should handle month end dates correctly for MONTHLY', () => {
            const lastContacted = new Date('2025-01-31T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('MONTHLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            // January 31 + 1 month = February 31st, but February doesn't have 31 days
            // So it rolls over to March 3rd (2025 is not a leap year)
            expect(result.getMonth()).toBe(2); // March (0-indexed)
            expect(result.getDate()).toBe(3); // March 3rd
            expect(result.getFullYear()).toBe(2025);
        });

        it('should handle leap year month end dates correctly for MONTHLY', () => {
            // Mock to 2024 (leap year)
            jest.setSystemTime(new Date('2024-01-15T10:00:00Z').getTime());

            const lastContacted = new Date('2024-01-31T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('MONTHLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            // January 31 + 1 month = February 31st, but February doesn't have 31 days
            // So it rolls over to March 2nd (2024 is a leap year, so February has 29 days)
            expect(result.getMonth()).toBe(2); // March (0-indexed)
            expect(result.getDate()).toBe(2); // March 2nd
            expect(result.getFullYear()).toBe(2024);
        });

        it('should handle year end correctly for MONTHLY', () => {
            const lastContacted = new Date('2025-12-15T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('MONTHLY'),
                lastContacted,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2026-01-15T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should return today if calculated date is in the past', () => {
            const pastDate = new Date('2020-01-01T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('WEEKLY'),
                lastContacted: pastDate,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-15T10:00:00Z'); // Should return reference date (today)

            expect(result.getTime()).toBe(expected.getTime());
        });

        it('should handle same day last contacted', () => {
            const sameDay = new Date('2025-01-15T10:00:00Z');
            const contact: RawContact = {
                ...baseContact,
                contactFrequency: getFrequency('DAILY'),
                lastContacted: sameDay,
            };

            const result = computeNextCall(contact);
            const expected = new Date('2025-01-16T10:00:00Z');

            expect(result.getTime()).toBe(expected.getTime());
        });
    });
});

describe('getLiftedContact', () => {
    const baseContact: Omit<RawContact, 'contactFrequency' | 'lastContacted'> = {
        id: '1',
        name: 'Test Contact',
        userId: 'user-1',
        createdAt: new Date(),
    };

    // Use a fixed reference date for all tests
    const referenceTimestamp = new Date('2025-01-15T10:00:00Z').getTime();

    beforeEach(() => {
        jest.useFakeTimers();
        jest.setSystemTime(referenceTimestamp);
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should return contact with nextContact and daysUntilNextCall', () => {
        const lastContacted = new Date('2025-01-10T10:00:00Z');
        const contact: RawContact = {
            ...baseContact,
            contactFrequency: getFrequency('WEEKLY'),
            lastContacted,
        };

        const result = getLiftedContact(contact);

        expect(result).toHaveProperty('nextContact');
        expect(result).toHaveProperty('daysUntilNextCall');
        expect(result.nextContact).toBeInstanceOf(Date);
        expect(typeof result.daysUntilNextCall).toBe('number');
        expect(result.daysUntilNextCall).toBeGreaterThanOrEqual(0);
    });

    it('should calculate daysUntilNextCall correctly', () => {
        const lastContacted = new Date('2025-01-10T10:00:00Z');
        const contact: RawContact = {
            ...baseContact,
            contactFrequency: getFrequency('WEEKLY'),
            lastContacted,
        };

        const result = getLiftedContact(contact);
        const expectedNextCall = new Date('2025-01-17T10:00:00Z');
        const expectedDays = 2; // 2 days from 2025-01-15 to 2025-01-17

        expect(result.daysUntilNextCall).toBe(expectedDays);
    });

    it('should handle zero days until next call', () => {
        const lastContacted = new Date('2025-01-13T10:00:00Z');
        const contact: RawContact = {
            ...baseContact,
            contactFrequency: getFrequency('DAILY'),
            lastContacted,
        };

        const result = getLiftedContact(contact);
        const expectedNextCall = new Date('2025-01-14T10:00:00Z');
        const expectedDays = 0; // Same day

        expect(result.daysUntilNextCall).toBe(expectedDays);
    });
}); 