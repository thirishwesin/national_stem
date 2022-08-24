import { Player } from "./player";
import { Round } from "./round";

export interface Episode {
    episodeId : number;
    rounds : Round[];
    players?: Player[];
}