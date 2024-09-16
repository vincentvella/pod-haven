const getVariantInfo = () => {
  if (process.env.APP_VARIANT === "production") {
    return ["PodHaven", "com.vellapps.podhaven"];
  }

  if (process.env.APP_VARIANT === "preview") {
    return ["PodHaven (Preview)", "com.vellapps.podhaven.preview"];
  }

  return ["PodHaven (Development)", "com.vellapps.podhaven.dev"];
};

const [appName, bundleId] = getVariantInfo();

export default {
  expo: {
    name: appName,
    slug: "pod-haven",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "pod-haven",
    userInterfaceStyle: "automatic",
    splash: {
      image: "./assets/images/splash.png",
      resizeMode: "contain",
      backgroundColor: "#020617",
    },
    ios: {
      supportsTablet: true,
      bundleIdentifier: bundleId,
      infoPlist: {
        UIBackgroundModes: ["audio"],
      },
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/images/adaptive-icon.png",
        backgroundColor: "#020617",
      },
      package: bundleId,
    },
    web: {
      bundler: "metro",
      output: "static",
      favicon: "./assets/images/favicon.png",
    },
    plugins: ["expo-router", "expo-build-properties"],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      eas: {
        projectId: "dc339c44-41d3-4ad9-9ab4-285e639bb99e",
      },
    },
    runtimeVersion: {
      policy: "appVersion",
    },
    updates: {
      url: "https://u.expo.dev/dc339c44-41d3-4ad9-9ab4-285e639bb99e",
    },
  },
};
