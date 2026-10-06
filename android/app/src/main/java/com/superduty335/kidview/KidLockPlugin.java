package com.superduty335.kidview;

import android.app.Activity;
import android.app.ActivityManager;
import android.content.Context;
import androidx.core.view.WindowCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.core.view.WindowInsetsControllerCompat;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

/**
 * Screen lock for kid mode. start() pins KidView with Android's lock task mode
 * (the same feature as "App pinning"), so the Home and Recents buttons and
 * notifications can't take a child out of the app, and hides the system bars.
 * stop() unpins it. Android shows its own "Pin app?" confirmation the first time.
 */
@CapacitorPlugin(name = "KidLock")
public class KidLockPlugin extends Plugin {

    @PluginMethod
    public void start(PluginCall call) {
        Activity activity = getActivity();
        activity.runOnUiThread(() -> {
            try {
                activity.startLockTask();
                WindowInsetsControllerCompat bars = WindowCompat.getInsetsController(activity.getWindow(), activity.getWindow().getDecorView());
                bars.setSystemBarsBehavior(WindowInsetsControllerCompat.BEHAVIOR_SHOW_TRANSIENT_BARS_BY_SWIPE);
                bars.hide(WindowInsetsCompat.Type.systemBars());
                call.resolve();
            } catch (Exception e) {
                call.reject("Could not pin the app", e);
            }
        });
    }

    @PluginMethod
    public void stop(PluginCall call) {
        Activity activity = getActivity();
        activity.runOnUiThread(() -> {
            try {
                if (isPinned()) activity.stopLockTask();
                WindowCompat.getInsetsController(activity.getWindow(), activity.getWindow().getDecorView())
                    .show(WindowInsetsCompat.Type.systemBars());
                call.resolve();
            } catch (Exception e) {
                call.reject("Could not unpin the app", e);
            }
        });
    }

    @PluginMethod
    public void status(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("pinned", isPinned());
        call.resolve(ret);
    }

    private boolean isPinned() {
        ActivityManager am = (ActivityManager) getContext().getSystemService(Context.ACTIVITY_SERVICE);
        return am != null && am.getLockTaskModeState() != ActivityManager.LOCK_TASK_MODE_NONE;
    }
}
