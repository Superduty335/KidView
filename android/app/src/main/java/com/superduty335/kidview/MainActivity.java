package com.superduty335.kidview;

import android.os.Bundle;
import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(KidLockPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
