import { Subject } from 'rxjs';
import { Episode } from '../models/episode';
import { ElectronStore } from './electron.store';
import {
    find as _find,
    map as _map,
    remove as _remove,
    cloneDeep as _cloneDeep
} from 'lodash';
import { Round } from '../models/round';
import { STORE_KEY } from '@nsc/common';
import { stat } from 'fs';

class AppStore {

    private static _instance: AppStore;

    private constructor() { }

    public static get Instance() {
        if (this._instance == null || this._instance == undefined) {
            this._instance = new AppStore();
        }
        return this._instance;
    }

    public initData(data: any) {
        ElectronStore.Instance.set(data);
    }

    //Websocket URL
    public getWebSocketURL(): string {
        return ElectronStore.Instance.get(STORE_KEY.WEBSOCKET_URL) || '';
    }

    public updateWebSocketURL(url: string): void {
        ElectronStore.Instance.setItemWithKey(STORE_KEY.WEBSOCKET_URL, url);
    }

    //State
    public getRoundsState(): Round[] {
        return ElectronStore.Instance.get(`${STORE_KEY.STATE}.${STORE_KEY.ROUNDS}`);
    }

    public getTemporalState(): any {
        return ElectronStore.Instance.get(`${STORE_KEY.STATE}`);
    }

    public updateRoundStateByRoundId(roundId: number, gameLogicName: string): void {
        let rounds: Round[] = this.getRoundsState();
        rounds = _map(rounds, (_round: Round) => {
            if (roundId === _round.roundId) {
                _round.gameLogicName = gameLogicName;
                return _round;
            }
            return _round;
        })
        ElectronStore.Instance.setItemWithKey(`${STORE_KEY.STATE}.${STORE_KEY.ROUNDS}`, rounds);
    }

    public updateActiveDraggingElementType(activeDraggingElementType: string) {
        let state = this.getTemporalState();
        state.activeDraggingElementType = activeDraggingElementType;
         ElectronStore.Instance.setItemWithKey(`${STORE_KEY.STATE}`, state);
    }

    public resetRoundsState() {
        let rounds: Round[] = this.getRoundsState();
        rounds = _map(rounds, (_round: Round) => {
            _round.gameLogicName = "";
            return _round;
        })
        ElectronStore.Instance.setItemWithKey(`${STORE_KEY.STATE}.${STORE_KEY.ROUNDS}`, rounds);
    }

    //Episode
    public modifyEpisodeIds() {
        let episodes = this.getAllEpisodes();
        for (let i = 0; i < episodes.length; i++) {
            this.updateEpisodeById(episodes[i].episodeId, { ...episodes[i], episodeId: i + 1 })
        }
        console.log(this.getAllEpisodes());
    }

    public addEpisode(episode: Episode): Episode {
        let _episodes: Episode[] = this.getAllEpisodes();
        _episodes = [...(_episodes || []), episode];
        ElectronStore.Instance.setItemWithKey(STORE_KEY.EPISODES, _episodes);
        return episode;
    }

    public getAllEpisodes(): Episode[] {
        return ElectronStore.Instance.get(STORE_KEY.EPISODES) || [];
    }

    public getEpisodeById(episodeId: number): Episode {
        let _episodes: Episode[] = this.getAllEpisodes();
        return _find(_episodes, [STORE_KEY.EPISODE_ID, episodeId]);
    }

    public updateEpisodeById(episodeId: number, episode: Episode): void {
        let _episodes = this.getAllEpisodes();
        _episodes = _map(_episodes, (_e: Episode) => {
            if (_e.episodeId === episodeId) {
                return episode;
            }
            return _e;
        })
        ElectronStore.Instance.setItemWithKey(STORE_KEY.EPISODES, _episodes);
    }

    public deleteEpisode(episodeId: number) {
        let _episodes = this.getAllEpisodes();
        _remove(_episodes, (_episode: Episode) => {
            return _episode.episodeId === episodeId
        })
        ElectronStore.Instance.setItemWithKey(STORE_KEY.EPISODES, _episodes);
    }
    //End Episode

    //Round
    public addRound(episodeId: number, round: any): Round | Round[] {
        let _episode = this.getEpisodeById(episodeId) || { episodeId: episodeId, rounds: [] };
        if (Array.isArray(round)) {
            _episode[STORE_KEY.ROUNDS] = [..._episode[STORE_KEY.ROUNDS], ...round]
        } else {
            _episode[STORE_KEY.ROUNDS] = [..._episode[STORE_KEY.ROUNDS], round]
        };
        this.updateEpisodeById(episodeId, _episode);
        return round;
    }

    public getRoundsByEpisodeId(episodeId: number): Round[] {
        let _episodes: Episode = this.getEpisodeById(episodeId);
        return _episodes[STORE_KEY.ROUNDS];
    }

    public getRoundByRoundId(roundId: number, episodeId: number): Round {
        let _rounds: Round[] = this.getRoundsByEpisodeId(episodeId);
        let _round = _find(_rounds, (round: Round) => {
            return round.roundId === roundId
        })
        return _round;
    }

    public updateRound(episodeId: number, round: Round) {
        let _episode: Episode = this.getEpisodeById(episodeId);
        _episode[STORE_KEY.ROUNDS] = _map(_episode[STORE_KEY.ROUNDS], (_round: Round) => {
            if (round.roundId === _round.roundId) {
                return round;
            }
            return _round;
        });
        this.updateEpisodeById(episodeId, _episode);
    }

    public deleteRound(episodeId: number, roundId: number) {
        let _episode: Episode = this.getEpisodeById(episodeId);
        let _rounds: Round[] = _cloneDeep(_episode[STORE_KEY.ROUNDS]);
        _remove(_rounds, ((round: Round) => {
            return round.roundId === roundId;
        }))
        _episode[STORE_KEY.ROUNDS] = [..._rounds];
        this.updateEpisodeById(episodeId, _episode);
    }
    //End round

    public onAnyDataChange(): Subject<{ newValue: string, oldValue: string, unsubscribe: Function }> {
        return ElectronStore.Instance.listenDataChange();
    }
}

export { AppStore }
