import { Contact, RawContact } from "../schema";

export const computeNextCall = (contact: RawContact): Date => {
    const { contactFrequency, lastContacted } = contact;
    const now = new Date();

    const lastCall = lastContacted ? lastContacted : now;
    let nextCall = new Date(lastCall);

    switch (contactFrequency) {
        case 'DAILY':
            nextCall.setDate(lastCall.getDate() + 1);
            break;
        case 'SEMI-WEEKLY':
            nextCall.setDate(lastCall.getDate() + 3); // Every 3-4 days
            break;
        case 'WEEKLY':
            nextCall.setDate(lastCall.getDate() + 7);
            break;
        case 'BI-WEEKLY':
            nextCall.setDate(lastCall.getDate() + 14);
            break;
        case 'MONTHLY':
            nextCall.setMonth(lastCall.getMonth() + 1);
            break;
        case 'BI-MONTHLY':
            nextCall.setMonth(lastCall.getMonth() + 2);
            break;
        case 'QUARTERLY':
            nextCall.setMonth(lastCall.getMonth() + 3);
            break;
        default:
            nextCall.setDate(lastCall.getDate() + 7);
    }

    if (nextCall < now) {
        return now;
    }

    return nextCall;
};

const daysUntilNextCall = (nextCall: Date): number => {
    const now = new Date();
    const diffTime = Math.abs(nextCall.getTime() - now.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
};

export const getLiftedContact = (contact: RawContact): Contact => {
    const nextCall = computeNextCall(contact);
    return {
        ...contact,
        nextContact: nextCall,
        daysUntilNextCall: daysUntilNextCall(nextCall)
    };
};


