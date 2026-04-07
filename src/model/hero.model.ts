import { Power } from './power.model';

export interface Hero {
    id: number;
    codeName: string;
    originStory: string;
    race: string;
    alignment: string;
    status: string;
    userId: string;
    powers: Power[];
}