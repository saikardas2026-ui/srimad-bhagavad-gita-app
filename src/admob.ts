import { Capacitor } from "@capacitor/core";
import { AdMob, BannerAdOptions, BannerAdSize, BannerAdPosition, AdMobInitializationOptions } from "@capacitor-community/admob";

const BANNER_AD_UNIT_ID = "ca-app-pub-3317914166369405/3036072507";
// Test banner ID — used in non-production or non-native builds so the real ID is never called on web
const TEST_BANNER_ID = "ca-app-pub-3940256099942544/6300978111";

const isNative = Capacitor.isNativePlatform();

export async function initAdMob(): Promise<void> {
  if (!isNative) return;
  const options: AdMobInitializationOptions = {
    testingDevices: [],
    initializeForTesting: false,
  };
  await AdMob.initialize(options);
}

export async function showBanner(): Promise<void> {
  if (!isNative) return;

  const options: BannerAdOptions = {
    adId: BANNER_AD_UNIT_ID,
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 0,
    isTesting: false,
  };

  await AdMob.showBanner(options);
}

export async function hideBanner(): Promise<void> {
  if (!isNative) return;
  await AdMob.hideBanner().catch(() => {});
}

export async function removeBanner(): Promise<void> {
  if (!isNative) return;
  await AdMob.removeBanner().catch(() => {});
}

export { TEST_BANNER_ID, isNative };
