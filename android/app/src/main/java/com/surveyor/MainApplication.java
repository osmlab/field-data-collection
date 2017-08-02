package com.surveyor;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.horcrux.svg.SvgPackage;
import com.RNFetchBlob.RNFetchBlobPackage;
import com.tradle.react.UdpSocketsModule;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.react.modules.network.OkHttpClientProvider;
import com.facebook.react.modules.network.ReactCookieJarContainer;
import com.facebook.react.modules.storage.ReactDatabaseSupplier;
import com.facebook.soloader.SoLoader;
import com.facebook.stetho.okhttp3.StethoInterceptor;
import com.facebook.stetho.Stetho;

import okhttp3.OkHttpClient;

import java.util.Arrays;
import java.util.concurrent.TimeUnit;
import java.util.List;

import com.wix.interactable.Interactable;
import com.mapbox.reactnativemapboxgl.ReactNativeMapboxGLPackage;
import com.babisoft.ReactNativeLocalization.ReactNativeLocalizationPackage;
import com.oblador.vectoricons.VectorIconsPackage;

public class MainApplication extends Application implements ReactApplication {

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
        new MainReactPackage(),
        new SvgPackage(),
        new RNFetchBlobPackage(),
        new Interactable(),
        new UdpSocketsModule(),
        new ReactNativeMapboxGLPackage(),
        new ReactNativeLocalizationPackage(),
        new VectorIconsPackage(),
        new RNDeviceInfo()
      );
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    long size = 50L * 1024L * 1024L; // 50 MB
    ReactDatabaseSupplier.getInstance(getApplicationContext()).setMaximumSize(size);
    SoLoader.init(this, /* native exopackage */ false);

    Stetho.initializeWithDefaults(this);
    OkHttpClient client = new OkHttpClient.Builder()
      .connectTimeout(0, TimeUnit.MILLISECONDS)
      .readTimeout(0, TimeUnit.MILLISECONDS)
      .writeTimeout(0, TimeUnit.MILLISECONDS)
      .cookieJar(new ReactCookieJarContainer())
      .addNetworkInterceptor(new StethoInterceptor())
      .build();
    OkHttpClientProvider.replaceOkHttpClient(client);
  }
}
