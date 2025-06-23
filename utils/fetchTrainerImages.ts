import {getUrl} from "aws-amplify/storage";

interface Trainer {
    id: { S: string };
    name?: { S: string };
    gender?: { S: string };
    niche?: { S: string };
    availability?: { L: Array<{ S: string }> };
    age?: { N: string };
    educationLevel?: { S: string };
    image?: { S: string };
    imageUri?: string | null;
    matchScore: number;
}

export const fetchTrainerImages = async (trainers: Trainer[], setMatchedTrainers: (trainers: Trainer[]) => void) => {
    try {
        const trainersWithImages = await Promise.all(
            trainers.map(async (trainer) => {
                if (trainer.image?.S) {
                    try {
                        const imgUrl = await getUrl({
                            path: trainer.image.S,
                            options: {
                                validateObjectExistence: true,
                            },
                        });
                        return { ...trainer, imageUri: imgUrl.url.toString() }; // Add imageUri to the trainer object
                    } catch (error) {
                        console.error('Error fetching image from S3:', error);
                        return { ...trainer, imageUri: null }; // Fallback to placeholder
                    }
                }
                return { ...trainer, imageUri: null }; // Fallback to placeholder
            })
        );
        setMatchedTrainers(trainersWithImages); // Update state with trainers and their image URLs
    } catch (error) {
        console.error('Error fetching trainer images:', error);
    }
};