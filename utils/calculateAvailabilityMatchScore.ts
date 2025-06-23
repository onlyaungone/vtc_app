export default function calculateAvailabilityMatchScore(trainer: any, client: any): number {
    let score = 0;
    const trainerAvailability = trainer.availability?.L.map((day: { S: string }) => day.S) || [];
    const clientAvailability = client?.availability.map((day: { S: string }) => day.S) || [];
    const commonDays = trainerAvailability.filter((day: string) => clientAvailability.includes(day));

    switch (commonDays.length) {
        case 7:
            score += 20;
            break;
        case 6:
            score += 18;
            break;
        case 5:
            score += 16;
            break;
        case 4:
            score += 14;
            break;
        case 3:
            score += 12;
            break;
        case 2:
            score += 10;
            break;
        case 1:
            score += 5;
            break;
        default:
            break;
    }

    if (commonDays.length > 0) {
        // score += 20;
        console.log(`Trainer: ${trainer.name?.S} - Availability Match! Common Days: ${commonDays}, Score: ${score}`);
    } else {
        console.log(`Trainer: ${trainer.name?.S} - No Availability Match. Trainer Availability: ${trainerAvailability}, Client Availability: ${clientAvailability}`);
    }
    return score;
}