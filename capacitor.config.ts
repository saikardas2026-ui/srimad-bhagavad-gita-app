import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.gitaapp.bhagavadgita",
  appName: "শ্রীমদ্ভগবদ্গীতা",
  webDir: "dist/public",
  android: {
    buildOptions: {
      keystorePath: undefined,
      keystorePassword: undefined,
      keystoreAlias: undefined,
      keystoreAliasPassword: undefined,
    },
  },
  plugins: {
    AdMob: {
      appId: {
        android: "ca-app-pub-3317914166369405~8758868553",
      },
    },
  },
};

export default config;
