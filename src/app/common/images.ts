import { ImagesService } from "../core/services/images.service";
import { AppConfig } from "@nsc/environment";

export const Images = {
    MAIN_BACKGROUND: ImagesService.getImage('main_background.png'),
    ONE_THIRD_BACKGROUND: ImagesService.getImage('one_third_background.png'),
    ONE_THIRD_BACKGROUND_CROSS_WORD: ImagesService.getImage('one_third_background_cross_word.png'),
    EPISODE: AppConfig.production ? 'assets/images/episode.png' : '../../assets/images/episode.png',
    MINUS: AppConfig.production ? 'assets/images/minus.png' : '../../assets/images/minus.png',
    MIN_ICON: AppConfig.production ? 'assets/images/min_icon.png' : '../../assets/images/min_icon.png',
    MAX_ICON: AppConfig.production ? 'assets/images/max_icon.png' : '../../assets/images/max_icon.png',
    TIMER: AppConfig.production ? 'assets/images/timer.png' : "../../assets/images/timer.png",
    DROPDOWN: AppConfig.production ? 'assets/images/drop_down_icon.png' : "../../assets/images/drop_down_icon.png",
    VIDEO_DEFAULT_BG: AppConfig.production ? 'assets/images/video_word_video_bg.png' : "../../assets/images/video_word_video_bg.png",
    POINT_BG: AppConfig.production ? 'assets/images/point_bg.png' : "../../assets/images/point_bg.png",
    SETTING_ICON: AppConfig.production ? 'assets/images/setting.png' : "../../assets/images/setting.png",

    PLAYER_SCREEN_BACKGROUND: AppConfig.production ? 'assets/images/player_screen_background.png' : '../../assets/images/player_screen_background.png',
    PLAYER_CENTER_BG_2: AppConfig.production ? 'assets/images/player_center_bg_2.jpg' : '../../assets/images/player_center_bg_2.jpg',
    FOOTER_TOP: AppConfig.production ? 'assets/images/footer_top.png' : '../../assets/images/footer_top.png',
    LINK_ICON: AppConfig.production ? 'assets/images/link.png' : "../../assets/images/link.png",

}
