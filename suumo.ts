import { OdnTweetData, OdnTweets } from "../../../odnTweets"
import { OdnPlugins, OdnPluginResultData } from "../../../odnPlugins";
import { Log, OdnUtils } from "../../../odnUtils";
import {OdnMutualFollowers} from "../../../odnMutualFollowers";

export class Suumo {
  constructor(private tweetData: OdnTweetData, private fullName: string) {}

  /**
   * プラグインのメイン処理を実行
   *
   * @param {(isProcessed?: boolean) => void} finish
   */
  run(finish: (isProcessed?: boolean) => void) {
    const tweets = new OdnTweets(this.tweetData.accountData);
    tweets.text = Resources.getSuumoMessage(this.tweetData.user.name, this.tweetData.user.screenName);
    // リプライの場合は、リプライ先ツイートのIDをセット
    tweets.targetTweetId = this.tweetData.idStr;

    // ツイートを投稿
    tweets.postTweet((isSuccess) => {
      tweets.likeTweet();
      finish();
    });
  }

  /**
   * プラグインを実行するかどうか判定
   *
   * @param {OdnTweetData} tweetData
   * @returns {boolean}
   */
  static isValid(tweetData: OdnTweetData): boolean {
    const isMutualFollow = OdnMutualFollowers.isMutualFollow(tweetData.accountData.userId, tweetData.user.idStr);
    return false === tweetData.isRetweet && isMutualFollow && tweetData.text.match(/^.*(スーモ|ｽｰﾓ).*$/gi) ? true : false;
  }
}

class Resources {
  private static suumoList: Array<string> = [
    "あ❗️[NAME](@[SCREEN_NAME])❗️🌚ダン💥ダン💥ダン💥シャーン🎶スモ🌝スモ🌚スモ🌝スモ🌚スモ 🌝スモ🌚ス〜〜〜モ⤴🌝スモ🌚スモ🌝スモ🌚スモ🌝スモ🌚スモ🌝ス〜〜〜モ⤵🌞",
    "Oh❗️[NAME](@[SCREEN_NAME])❗️🌚Dan💥DAN💥Dan💥Schaan🎶SUuMO🌝suumo🌚SuuMo🌝Suumo🌚suUMo 🌝SuumO🌚SUu〜〜〜MO⤴🌝sUUmo🌚SUUMo🌝sUuMo🌚sUuMo🌝SUUmo🌚sUMMO🌝SUU〜〜〜MO⤵🌞",
    "ਓ❗ [NAME](@[SCREEN_NAME])❗️🌚ਦਾਨ💥 ਦਾਨ💥ਦਾਨ💥Schaan🎶ਸੂਮੋ🌝ਸੂਮੋ🌚 ਸੂਮੋ🌝ਸੂਮੋ🌚ਸੂਮੋ🌝ਸੂਮੋ🌚ਸਕੈਨ~~~ ਮਾਡਲ⤴🌝ਸੂਮੋ🌚ਸੂਮੋ🌝ਸੂਮੋ ਸੂਮੋ🌚🌝ਸੂਮੋ🌚 ਸੂਮੋ🌝ਸਕੈਨ~~~ਮਾਡਲ⤵🌞"
  ];

  /**
   * 設定済みのスーモメッセージからランダムで取得
   *
   * @param {string} name
   * @param {string} screenName
   * @returns {string}
   */
  static getSuumoMessage(name: string, screenName: string): string {
    const index = OdnUtils.rand(0, this.suumoList.length - 1);
    return this.suumoList[index].replace(ResoucesConstants.NAME, name).replace(ResoucesConstants.SCREEN_NAME, screenName);
  }
}

namespace ResoucesConstants {
  export const NAME = "[NAME]";
  export const SCREEN_NAME = "[SCREEN_NAME]";
}